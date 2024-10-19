const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', (req, res) => {
  const { question, subject, class: studentClass } = req.body;

  // Προσομοιωμένη απάντηση (εδώ μπορεί να γίνει το RAG μέσω του API Groq)
  const answer = `Απάντηση στο ερώτημα "${question}" για το μάθημα "${subject}" και την τάξη "${studentClass}".`;

  res.json({ answer });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
