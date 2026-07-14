require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const { OpenAI } = require('openai');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const callLogger = require('./utils/callLogger');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(helmet());
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ============================================================================
// INITIALIZATION
// ============================================================================

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const callConversations = {};

// ============================================================================
// CONFIGURATION
// ============================================================================

const config = {
  systemPrompt: `You are a friendly, professional AI voice assistant. You're helping to answer calls and have conversations with people. 
Keep your responses concise and natural (as if you're speaking, not reading). 
Speak in a conversational tone, be helpful, and when appropriate, ask clarifying questions.
Your responses should be 1-3 sentences maximum when spoken aloud.
If you don't know something, be honest about it and offer to help in other ways.`,
  
  voiceSettings: {
    voice: process.env.VOICE_TYPE || 'Polly.Amy',
    language: process.env.LANGUAGE || 'en-US',
  },
  
  maxCallDuration: parseInt(process.env.MAX_CALL_DURATION || '3600', 10),
  responseTimeout: parseInt(process.env.RESPONSE_TIMEOUT || '10000', 10),
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// MAIN VOICE WEBHOOK - Initial Call Greeting
// ============================================================================

app.post('/voice', (req, res) => {
  const callSid = req.body.CallSid;
  const from = req.body.From;
  const to = req.body.To;
  
  logger.info(`Incoming call: ${callSid} from ${from}`);
  
  if (!verifyTwilioRequest(req)) {
    logger.warn(`Unauthorized request`);
    return res.status(403).send('Unauthorized');
  }

  callConversations[callSid] = [
    {
      role: 'system',
      content: config.systemPrompt,
    },
  ];

  callLogger.startCall(callSid, from, to);

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(
    { voice: config.voiceSettings.voice },
    'Hello! I\'m an AI voice assistant. How can I help you today?'
  );

  twiml.gather({
    input: 'speech',
    speechTimeout: 5,
    action: '/process-speech',
    method: 'POST',
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

// ============================================================================
// SPEECH PROCESSING WEBHOOK - Handle Caller Input
// ============================================================================

app.post('/process-speech', async (req, res) => {
  const callSid = req.body.CallSid;
  const callerSpeech = req.body.SpeechResult;

  logger.info(`Processing: "${callerSpeech}"`);

  if (!verifyTwilioRequest(req)) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const conversationHistory = callConversations[callSid] || [
      {
        role: 'system',
        content: config.systemPrompt,
      },
    ];

    conversationHistory.push({
      role: 'user',
      content: callerSpeech,
    });

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: conversationHistory,
      max_tokens: 150,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message.content;

    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage,
    });

    if (conversationHistory.length > 22) {
      conversationHistory.splice(1, 2);
    }

    callConversations[callSid] = conversationHistory;
    callLogger.logInteraction(callSid, callerSpeech, assistantMessage);

    const twiml = new twilio.twiml.VoiceResponse();

    twiml.say(
      { voice: config.voiceSettings.voice },
      assistantMessage
    );

    twiml.gather({
      input: 'speech',
      speechTimeout: 5,
      action: '/process-speech',
      method: 'POST',
    });

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    logger.error(`Error: ${error.message}`);

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(
      { voice: config.voiceSettings.voice },
      'Sorry, I encountered an error. Please try again.'
    );
    twiml.gather({
      input: 'speech',
      speechTimeout: 5,
      action: '/process-speech',
      method: 'POST',
    });

    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// ============================================================================
// CALL STATUS WEBHOOK
// ============================================================================

app.post('/call-status', (req, res) => {
  const callSid = req.body.CallSid;
  const callStatus = req.body.CallStatus;

  logger.info(`Call ${callSid}: ${callStatus}`);

  if (callStatus === 'completed' || callStatus === 'failed') {
    callLogger.endCall(callSid);
    delete callConversations[callSid];
  }

  res.json({ status: 'ok' });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function verifyTwilioRequest(req) {
  if (process.env.NODE_ENV === 'production') {
    const twilioSignature = req.headers['x-twilio-signature'];
    const url = `${process.env.WEBHOOK_URL}${req.originalUrl}`;
    
    return twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      twilioSignature,
      url,
      req.body
    );
  }
  return true;
}

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  logger.info(`🎙️  Voice Agent running on port ${PORT}`);
  logger.info(`Model: ${process.env.OPENAI_MODEL || 'gpt-4'}`);
  logger.info(`Phone: ${process.env.TWILIO_PHONE_NUMBER}`);
  
  if (process.env.NODE_ENV === 'development') {
    logger.info(`\n📱 Local testing: ngrok http ${PORT}`);
  }
});

module.exports = app;
