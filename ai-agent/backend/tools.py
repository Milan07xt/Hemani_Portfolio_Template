import os
import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

def load_json(filename):
    file_path = DATA_DIR / filename
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": f"File {filename} not found."}

def get_profile():
    """Get general profile information about Milan (bio, role, location, status)."""
    return json.dumps(load_json("profile.json"))

def get_skills():
    """Get Milan's technical skills, languages, frameworks, and developer tools."""
    return json.dumps(load_json("skills.json"))

def get_education():
    """Get Milan's educational background, university, degree, and CGPA."""
    return json.dumps(load_json("education.json"))

def get_projects():
    """Get a list of Milan's projects, descriptions, technologies used, and live/code links."""
    return json.dumps(load_json("projects.json"))

def get_certificates():
    """Get Milan's certifications and achievements."""
    return json.dumps(load_json("certificates.json"))

def get_experience():
    """Get Milan's professional experience and open source contributions."""
    return json.dumps(load_json("experience.json"))

def get_contact():
    """Get Milan's contact information (email, phone, linkedin, github, location)."""
    return json.dumps(load_json("contact.json"))

def get_resume():
    """Get the link to download Milan's resume."""
    return json.dumps(load_json("resume.json"))

# Define tool schemas for OpenAI function calling
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_profile",
            "description": "Get general profile information about Milan Rathod (bio, role, location, status)."
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_skills",
            "description": "Get Milan's technical skills, languages, frameworks, and developer tools."
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_education",
            "description": "Get Milan's educational background, university, degree, and CGPA."
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_projects",
            "description": "Get a list of Milan's projects, descriptions, technologies used, and live/code links."
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_certificates",
            "description": "Get Milan's certifications and achievements."
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_experience",
            "description": "Get Milan's professional experience and open source contributions."
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_contact",
            "description": "Get Milan's contact information (email, phone, linkedin, github, location)."
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_resume",
            "description": "Get the link to download Milan's resume."
        }
    }
]

# Map tool names to functions
TOOL_FUNCTIONS = {
    "get_profile": get_profile,
    "get_skills": get_skills,
    "get_education": get_education,
    "get_projects": get_projects,
    "get_certificates": get_certificates,
    "get_experience": get_experience,
    "get_contact": get_contact,
    "get_resume": get_resume,
}
