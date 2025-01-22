# Resume Parser

A web application that parses resumes in PDF format and extracts key information using Natural Language Processing (NLP).

## Video Demonstration

[Direct Google Drive Link](https://drive.google.com/file/d/1FF5YQWRWTSbCdIR83X6YxL2rxLut2JLq/view?usp=sharing)

## Features

- PDF text extraction
- Automated extraction of:
  - Name
  - Phone number
  - Address
  - Skills
  - Experience
  - Education
  - Achievements
  - Links/URLs
- Modern React frontend with Material UI
- Django REST API backend
- Advanced NLP using Hugging Face Transformers

## Project Structure

```
resume_parser/
├── api/                # Django backend
│   ├── utils.py       # PDF parsing and NLP utilities
│   ├── views.py       # API endpoints
│   └── urls.py        # URL routing
└── ...

fe/                    # React frontend
├── src/
│   ├── App.tsx        # Main application component
│   └── types.ts       # TypeScript type definitions
└── ...
```

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv resenv
source resenv/bin/activate  # On Windows: resenv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

3. Set up environment variables:
```bash
# Create .env file in resume_parser directory
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english
HUGGINGFACE_API_TOKEN=your_huggingface_api_token
```

4. Run migrations and start server:
```bash
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd fe
npm install
```

2. Start development server:
```bash
npm run dev
```

## Usage

1. Access the application at `http://localhost:5173`
2. Upload a PDF resume
3. View extracted information in a structured format

## Technologies Used

- **Backend**
  - Django 5.1.5
  - Django REST Framework 3.15.2
  - spaCy 3.8.4 (NLP)
  - pdfplumber 0.11.5 (PDF parsing)
  - Hugging Face Transformers 4.48.1 (Named Entity Recognition)
  - Hugging Face Hub 0.27.1 (API Integration)

- **Frontend**
  - React 18
  - TypeScript
  - Material UI
  - Axios

## API Endpoints

- `POST /api/parse-resume/`: Upload and parse resume
  - Input: PDF file
  - Output: JSON with extracted information

## Requirements

See `requirements.txt` for a complete list of Python dependencies. Key requirements:
- Python 3.8+
- Node.js 16+
- npm 8+
- Hugging Face API key

## Models Used

The application uses the following Hugging Face model for Named Entity Recognition:
- Model: `dbmdz/bert-large-cased-finetuned-conll03-english`
- Task: Named Entity Recognition (NER)
- Capabilities: Identifies names, organizations, locations, and other entities in text 
