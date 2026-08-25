# AI Portfolio Assistant

A professional AI assistant backend for Milan Rathod's portfolio. It uses FastAPI and OpenAI to dynamically answer visitor questions based on portfolio data without hallucinating.

## Project Architecture

The project consists of three main parts:
1. **Frontend Widget**: Injected into `index.html` via `ai-agent-widget.js` and `ai-agent-widget.css`. It provides a modern, responsive chat interface.
2. **FastAPI Backend**: Located in `backend/`, exposing a `/chat` POST endpoint.
3. **Data/Knowledge Base**: Located in `data/`, storing portfolio information in structured JSON files.

**Future RAG Implementation**: Currently, the agent uses function calling (tools) to read JSON files. The architecture is modular so that later, these JSONs (or PDFs/Docs) can be processed by a document loader, embedded, and stored in a vector database for semantic retrieval (RAG).

## Installation

### 1. Python Virtual Environment

Ensure you have Python 3.10+ installed. Open a terminal in the `ai-agent/backend` directory:

```bash
cd ai-agent/backend
python -m venv venv
```

Activate the virtual environment:
- **Windows**: `venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

### 2. Required Packages

Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the `ai-agent/backend` directory (you can copy `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and add your real OpenAI API key:
```env
OPENAI_API_KEY=sk-your-real-api-key
```
*Note: Never commit `.env` to GitHub.*

## How to Run FastAPI

While inside the activated virtual environment in the `backend` folder:
```bash
uvicorn main:app --reload
```
The server will start at `http://localhost:8000`.

## How to Connect the Portfolio

The frontend widget `ai-agent-widget.js` is already configured to point to `http://localhost:8000/chat`.
Simply open the root `index.html` in your browser (using Live Server or just double-clicking).
The floating AI button will appear in the bottom right corner.

## How to Test the `/chat` Endpoint

You can test the API directly using Swagger UI:
Navigate to http://localhost:8000/docs in your browser. Click on the `/chat` endpoint, click "Try it out", enter a JSON body like `{"message": "Tell me about Milan"}`, and click "Execute".

## How to Update Portfolio Information

- **Add New Projects**: Edit `ai-agent/data/projects.json` and add a new JSON object to the list.
- **Add Certificates**: Edit `ai-agent/data/certificates.json`.
- **Update Skills/Bio**: Edit `skills.json` or `profile.json`.
The AI will immediately use the updated data on the next question.

## How to Deploy the Backend

1. Push your code to GitHub (ensure `.env` is ignored!).
2. Connect your repo to a service like **Render**, **Railway**, or **Heroku**.
3. Set the build command to `pip install -r requirements.txt`.
4. Set the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Add your `OPENAI_API_KEY` in the hosting provider's Environment Variables section.
6. Once deployed, update `API_URL` in `ai-agent-widget.js` from `http://localhost:8000/chat` to your deployed URL.

## Future Enhancements
- **RAG**: Integrate LangChain/LlamaIndex and a vector DB for semantic search over large documents.
- **GitHub API**: Fetch live repos directly from GitHub instead of a static JSON.
- **Voice AI**: Add Twilio or OpenAI Whisper for a phone-call agent or voice interactions on the site.
