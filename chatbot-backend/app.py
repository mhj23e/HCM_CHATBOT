from flask import Flask, request, jsonify
from flask_cors import CORS
from docx import Document
import spacy
import os
from werkzeug.utils import secure_filename

# Initialize Flask app and spaCy NLP model
app = Flask(__name__)
CORS(app)
nlp = spacy.load("en_core_web_sm")

# In-memory storage for parsed FAQ data
faq_data = {}

# Helper function to parse document and extract Q&A data
def parse_docx(file_path):
    data = {}
    doc = Document(file_path)
    current_question = None
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if text.startswith("Q:"):
            current_question = text
            data[current_question] = ""
        elif text.startswith("A:") and current_question:
            data[current_question] += text
    return data

# Route to upload file and parse content
@app.route('/api/upload', methods=['POST'])
def upload_file():
    global faq_data
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save file to temporary location
    filename = secure_filename(file.filename)
    temp_file_path = os.path.join("/tmp", filename)
    file.save(temp_file_path)

    # Parse the document and store Q&A
    faq_data = parse_docx(temp_file_path)
    os.remove(temp_file_path)  # Clean up the temporary file
    
    return jsonify({"message": "File successfully uploaded and parsed!"}), 200

# Helper function to find the best-matching answer
def get_best_answer(user_question):
    user_doc = nlp(user_question)
    best_match = None
    best_similarity = 0.0

    for question, answer in faq_data.items():
        question_doc = nlp(question)
        similarity = user_doc.similarity(question_doc)
        
        if similarity > best_similarity:
            best_similarity = similarity
            best_match = answer
    
    return best_match if best_match else "Sorry, I couldn't find a relevant answer."

# Route to handle chat queries
@app.route('/api/chat', methods=['POST'])
def chat():
    if not faq_data:
        return jsonify({"response": "Please upload a document first."}), 400

    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"response": "Please provide a valid message."}), 400

    answer = get_best_answer(user_input)
    return jsonify({"response": answer})

if __name__ == "__main__":
    app.run(debug=True)
