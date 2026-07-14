# Where to Clone the Repository 📍

## What is Cloning?

Cloning means downloading your project files from GitHub to your computer so you can work on them locally.

---

## Step 1: Choose Where to Store It

Pick a location on your computer where you want to store the project. Common locations:

### **On Mac:**
```bash
~/Desktop/projects/
~/Documents/
~/ (home directory)
```

### **On Windows:**
```bash
C:\Users\YourUsername\Desktop\
C:\Users\YourUsername\Documents\
C:\Users\YourUsername\projects\
```

### **On Linux:**
```bash
~/projects/
~/Desktop/
~/Documents/
```

---

## Step 2: Open Terminal/Command Prompt

### **On Mac:**
- Press `Cmd + Space`
- Type `Terminal`
- Press Enter

### **On Windows:**
- Press `Windows key + R`
- Type `cmd`
- Press Enter

### **On Linux:**
- Right-click on desktop → Open Terminal
- Or press `Ctrl + Alt + T`

---

## Step 3: Navigate to Your Chosen Location

Example: Navigate to Desktop

### **On Mac/Linux:**
```bash
cd ~/Desktop
```

### **On Windows:**
```bash
cd C:\Users\YourUsername\Desktop
```

Or create a new projects folder:

### **On Mac/Linux:**
```bash
mkdir projects
cd projects
```

### **On Windows:**
```bash
mkdir projects
cd projects
```

---

## Step 4: Clone the Repository

Copy and paste this command:

```bash
git clone https://github.com/bnagasuman-source/voice-agenet.git
```

You'll see output like:
```
Cloning into 'voice-agenet'...
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
...
```

Wait for it to finish (usually 5-10 seconds).

---

## Step 5: Enter the Project Folder

```bash
cd voice-agenet
```

Now verify you're in the right place:

```bash
ls
```

You should see:
```
src/
package.json
README.md
.env.example
.gitignore
INSTALLATION.md
```

---

## Visual Guide

```
Your Computer
├── Desktop/
│   ├── voice-agenet/          ← Cloned here!
│   │   ├── src/
│   │   ├── package.json
│   │   ├── README.md
│   │   └── ...
│   └── Other files...
└── Documents/
    └── ...
```

---

## Alternative: Using GitHub Desktop (Easier if New to Git)

If you're not comfortable with terminal commands, use GitHub Desktop:

1. Download: https://desktop.github.com
2. Install it
3. Go to https://github.com/bnagasuman-source/voice-agenet
4. Click green **"Code"** button → **"Open with GitHub Desktop"**
5. Choose where to save → Click **"Clone"**

Done! Files are now on your computer.

---

## Verify Installation

Once cloned, verify everything is there:

```bash
cd voice-agenet
ls -la
```

You should see:
- `src/` folder
- `package.json` file
- `README.md` file
- `.env.example` file
- `INSTALLATION.md` file

If you see all these, you're ready for the next step!

---

## Next Step

After cloning, run:

```bash
npm install
```

This installs all the dependencies (libraries the project needs).

**Need help?** Let me know! 🚀
