import re
import os

import pdfplumber
import requests
import spacy
from dotenv import load_dotenv

load_dotenv()

# Load the spaCy NLP model for NER (can be replaced with a Hugging Face model)
nlp = spacy.load("en_core_web_sm")
url_pattern = r"https?://(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}(?:\S*)?"

# Hugging Face API configuration


hf_api_url = os.getenv("HUGGINGFACE_API_URL")

hf_api_token = os.getenv("HUGGINGFACE_API_TOKEN")

# Use the token in your headers
headers = {"Authorization": f"Bearer {hf_api_token}"}

# Define a regex pattern for phone number detection
phone_regex = r'(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4})'




def extract_text_from_pdf(pdf_file):
    with pdfplumber.open(pdf_file) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text

def extract_named_entities(text):
    response = requests.post(hf_api_url, headers=headers, json={"inputs": text})
    entities = response.json()
    return entities

def extract_name(text):
    # Check if the name is in the first line or first few lines (often where it appears in resumes)
    lines = text.split('\n')
    first_lines = lines[:3]  # Take the first 3 lines

    # Look for capitalized words in the first few lines (heuristic for name)
    for line in first_lines:
        if line.strip():  # Skip empty lines
            name = re.match(r"^[A-Z][a-z]+(?: [A-Z][a-z]+)*$", line.strip())
            if name:
                return name.group(0)  # If match found, return name

    # If no name found, fallback to spaCy's NER
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text

    return None


def extract_resume_fields(text):
    # Process the text with spaCy
    doc = nlp(text)

    extracted_data = {
        'name': None,
        'phone': None,
        'address': None,
        'links': [],
        'skills': [],
        'experience': [],
        'education': [],
        'achievements': []
    }

    # Extract Name
    extracted_data['name'] = extract_name(text)

    # Extract Phone Numbers - Use updated regex to find phone numbers
    phone_matches = re.findall(phone_regex, text)
    if phone_matches:
        # Combine the matched parts into one phone number string
        full_phone_number = ''.join([part for part in phone_matches[0] if part])  # Join only non-empty parts
        extracted_data['phone'] = full_phone_number.strip()

    # Extract Name from NER if not found via regex
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not extracted_data['name']:
            extracted_data['name'] = ent.text

    # Extract Address from NER
    for ent in doc.ents:
        if ent.label_ in ["GPE", "LOC"] and not extracted_data['address']:
            extracted_data['address'] = ent.text

    # Extract Links (URLs)
    links_regex = r'(https?://\S+|www\.\S+)'
    links = re.findall(links_regex, text)
    extracted_data['links'] = links

    # Extract Skills (based on keywords)
    skills_keywords = ['Python', 'Java', 'JavaScript', 'React', 'Django', 'Node.js', 'C++', 'HTML', 'CSS']
    for skill in skills_keywords:
        if skill.lower() in text.lower() and skill not in extracted_data['skills']:
            extracted_data['skills'].append(skill)

    # Extract Experience (based on keywords)
    experience_keywords = ['Engineer', 'Developer', 'Intern']
    for keyword in experience_keywords:
        if keyword.lower() in text.lower() and keyword not in extracted_data['experience']:
            extracted_data['experience'].append(keyword)

    # Extract Education (based on keywords)
    education_keywords = ['Degree', 'University', 'College']
    for keyword in education_keywords:
        if keyword.lower() in text.lower() and keyword not in extracted_data['education']:
            extracted_data['education'].append(keyword)

    # Extract Achievements (based on keywords)
    achievements_keywords = ['Achievement', 'Award']
    for keyword in achievements_keywords:
        if keyword.lower() in text.lower() and keyword not in extracted_data['achievements']:
            extracted_data['achievements'].append(keyword)

    return extracted_data