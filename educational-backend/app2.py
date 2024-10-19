from flask import Flask, request, jsonify
from flask_cors import CORS
from QuestionAnsweringSystem import QuestionAnsweringSystem  # Εισαγωγή της κλάσης

app = Flask(__name__)
CORS(app)  # Ενεργοποίηση CORS για να επιτρέπονται αιτήματα από το React frontend

# Αρχικοποίηση του QuestionAnsweringSystem κατά την εκκίνηση του Flask app γεωργαφια 
qa_system = QuestionAnsweringSystem(chroma_path="pyth/chroma_index1#geo",chroma_path2="pyth/chroma_index2#geo")

# Αρχικοποίηση του QuestionAnsweringSystem κατά την εκκίνηση του Flask app αριστοτελης
qa_system_arist = QuestionAnsweringSystem(chroma_path="pyth/chroma_index1#aristotelis",chroma_path2="pyth/chroma_index2#aristotelis")


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json  # Λήψη των δεδομένων από το frontend
    question = data.get('question')
    subject = data.get('subject')
    student_class = data.get('class')

    if not question:
        return jsonify({'error': 'No question provided'}), 400

    if subject=="Γεωγραφία":
        # Χρήση της κλάσης για να πάρεις την απάντηση από το LLM μέσω του Groq API
        answer = qa_system.get_answer(question)
    if subject=="Αριστοτέλης":
         # Χρήση της κλάσης για να πάρεις την απάντηση από το LLM μέσω του Groq API
        answer = qa_system_arist.get_answer(question)

    # Επιστροφή της απάντησης σε JSON μορφή
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
