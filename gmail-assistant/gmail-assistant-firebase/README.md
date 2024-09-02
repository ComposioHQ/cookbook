

# ⚡️GmailGenius: Supercharge your Gmail
*Automatically processes new emails, extracts data from attachments, and organizes everything in a spreadsheet!*

## Demo
[![gmailgenius-demo](https://github.com/user-attachments/assets/abb24495-d242-42f3-8cff-599182f735f4)](https://drive.google.com/file/d/1aoKGYiq5QKr037Q5A9v58JERe0aGjXiC/preview)

## Description
GmailGenius simplifies the process of finding relevant emails, downloading attachments, and extracting key data. Here's how it works:

1. **Sign up on GmailGenius** and link your Gmail account and Google Sheet
2. **Enter keywords** you want the AI agent to look for in your email
3. **GmailGenius finds emails and attachments** from Gmail that match your keyword criteria
4. **Useful information from the attachments is extracted and stored** in your linked Google Sheet.

### Under the hood, the AI agent divides the task into multiple steps and executes them:

1. **Retrieves emails from Gmail** that match the keyword/phrase criteria.
2. **Downloads** the relevant attachments.
3. **Extracts useful attributes** from the attachments using Nanonets.
4. **Stores** the extracted data in the linked Google Sheet

## Tech Stack
- Frontend: ReactJS, Vite, TailwindCSS
- Backend: Python, FastAPI
- AI Agent: CrewAI, Composio, OpenAI


## Run Locally

Clone the project

```bash
  git clone https://github.com/abhishekpatil4/GmailGenius.git
```

Go to the project directory

```bash
  cd GmailGenius
```

### Backend

Go to backend dir & run setup script, this will create a virtual environment & download necessary libraries (Note: if you're unable to execute then grant permisson -> chmod +x setup.sh)
You'll then be prompted to login to **Composio**, link **Gmail** & **Goole Sheets**. 
Add API keys in **.env file**

```bash
  cd backend && ./setup.sh
```

Start the server

```bash
  python main.py
```


### Frontend

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
  
