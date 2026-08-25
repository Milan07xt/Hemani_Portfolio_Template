from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import process_chat_message

app = FastAPI(title="Milan Rathod AI Assistant API")

# Configure CORS so the portfolio frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change to the actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Assistant Backend is running"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    if not req.message or req.message.strip() == "":
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    answer = process_chat_message(req.message)
    return ChatResponse(answer=answer)
