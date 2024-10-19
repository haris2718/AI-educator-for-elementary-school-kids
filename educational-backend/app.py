from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Ενεργοποίηση CORS για να επιτρέπονται αιτήματα από το React frontend

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json  # Λήψη των δεδομένων από το frontend
    question = data.get('question')
    subject = data.get('subject')
    student_class = data.get('class')

    # Προσομοιωμένη απάντηση
    answer = f'Απάντηση στο ερώτημα "{question}" για το μάθημα "{subject}" και την τάξη "{student_class}".'

    # Επιστροφή της απάντησης σε JSON μορφή
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
