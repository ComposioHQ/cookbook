# Tweetify 
*Improve your Twitter game with Tweetify! Create posts, share permissions effortlessly, and let our AI generate engaging retweet content. Amplify your reach while you focus on what matters most*

## Why Tweetify?
I built Tweetify to help marketing agencies and event promoters maximize their social media impact on Twitter. With Tweetify, users can easily create engaging tweets and repost on behalf of others, making it effortless to promote events and engage audiences. I built the AI agents using CrewAI, which allowed me to create specialized agents tailored for this task. The real magic comes from [Composio](https://app.composio.dev)'s  powerful [Twitter](https://app.composio.dev/app/twitter) tool, which made the process a lot simpler—just plug and play! Thanks to Composio, I could focus on creating a seamless user experience while my AI Agent does the heavy lifting. Now you can amplify your twitter presence and boost engagement with just a few clicks!

## Demo
[![Live Demo](https://img.shields.io/badge/Live%20Link-Vercel-black?logo=vercel&style=for-the-badge)](https://tweetify-three.vercel.app) <br>
[![Open in Replit](https://img.shields.io/badge/Open%20in-Replit-blue?logo=replit&style=for-the-badge)](https://replit.com/@abishkpatil/tweetify?v=1) <br>
[![Watch on YouTube](https://img.shields.io/badge/Watch%20tutorial%20on-YouTube-red?logo=youtube&style=for-the-badge)](https://youtu.be/ooMl1Wew1tk)

### Live Demo
[![tweetify-demo](https://github.com/user-attachments/assets/c1582f92-a4a7-460b-8c65-cf48a4fa1084)](https://drive.google.com/file/d/1hQSjQc0GdQj8kPrrIlqLJvPzUpphU5hc/preview)

## Description
Tweetify is an AI agent using which you can create posts, get authorisation from other users to repost tweets on their behalf, generate repost quote using AI

## Tech Stack
- Frontend: ReactJS, Vite, TailwindCSS
- Backend: Python, FastAPI
- AI Agent: CrewAI
- Composio tools: [Twitter](https://app.composio.dev/app/twitter)

## Run Locally
### Setup tutorial
[![gmailgenius-demo](https://github.com/user-attachments/assets/abb24495-d242-42f3-8cff-599182f735f4)](https://drive.google.com/file/d/1kC9oVSUatqQ6Tcs3u6CTsVsmczzG-F6k/preview)

Clone the project
```bash
  git clone https://github.com/abhishekpatil4/tweetify.git
```

Go to the project directory

```bash
  cd tweetify
```

### Backend

Go to backend dir & run setup script, this will create a virtual environment & download necessary libraries (Note: if you're unable to execute then grant permisson -> chmod +x setup.sh)
You'll then be prompted to login to **Composio**, link **Gmail** & **Google Sheets**. 
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

### Composio Login
If you're prompted to login & enter API key, run the below command to login

```bash
  composio login
```

You'll be redirected to composio website, login, get the API key and paste it
  
