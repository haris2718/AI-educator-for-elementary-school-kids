from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableMap, RunnablePassthrough
import os

class QuestionAnsweringSystem:
    def __init__(self, chroma_path, chroma_path2, groq_model="llama-3.1-70b-versatile", temperature=0, max_tokens=2048):
        # Αρχικοποίηση μεταβλητών περιβάλλοντος και ενσωματώσεων
        os.environ['LANGCHAIN_TRACING_V2'] = 'true'
        os.environ['LANGCHAIN_ENDPOINT'] = 'https://api.smith.langchain.com'
        os.environ['LANGCHAIN_API_KEY'] = ''
        os.environ["GROQ_API_KEY"] = ''

        # Αρχικοποίηση των embeddings και του vectorstore
        self.embedding_model = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-base")
        self.vectorstore = Chroma(persist_directory=chroma_path, embedding_function=self.embedding_model)
        self.vectorstore2 = Chroma(persist_directory=chroma_path2, embedding_function=self.embedding_model)
        # Αρχικοποίηση του Groq LLM
        self.llm = ChatGroq(
            model=groq_model,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout=None,
            max_retries=2
        )

        # Δημιουργία του prompt template
        template3 = """Χρησιμοποίησε τα ακόλουθα κομμάτια πληροφοριών (context) για να απαντήσεις στην ερώτηση στο τέλος.
        Αν δεν γνωρίζεις την απάντηση, απλά πες ότι δεν γνωρίζεις, μην προσπαθήσεις να επινοήσεις μια απάντηση.
        Η απαντηση να είναι στα ελληνικά.

        Πληροφορίες:
        {context}

        Ερώτηση: {question}

        Απάντηση στα ελληνικά:"""
        self.prompt = PromptTemplate.from_template(template3)

        # Προετοιμασία του retriever για αναζήτηση
        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 6})
        self.retriever2 = self.vectorstore2.as_retriever(search_kwargs={"k": 6})
        # Προετοιμασία της αλυσίδας για την εκτέλεση
        self.rag_chain = (
            RunnableMap(
                {
                    "context": RunnablePassthrough(),
                    "question": RunnablePassthrough(),
                }
            )
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

    def format_docs(self, documents):
        # Συνδυασμός των κειμένων από τα έγγραφα σε μία ενιαία συμβολοσειρά
        return "\n\n".join(doc.page_content for doc in documents)

    def get_answer(self, question):
        # Βρες τα σχετικά έγγραφα από το retriever
        retrieved_docs1 = self.retriever.get_relevant_documents(question)
        retrieved_docs2 = self.retriever2.get_relevant_documents(question)
        retrieved_docs = retrieved_docs1 + retrieved_docs2
        # Προετοιμασία του context από τα συνδυασμένα έγγραφα
        formatted_context = self.format_docs(retrieved_docs)

        # Κάνε invoke στο chain με την ερώτηση και το context
        result = self.rag_chain.invoke({"context": formatted_context, "question": question})
        
        return result
'''
# Παράδειγμα χρήσης της κλάσης
if __name__ == '__main__':
    # Αρχικοποίηση της κλάσης με το path του Chroma index
    qa_system = QuestionAnsweringSystem(chroma_path="/content/drive/MyDrive/chroma_index1#geo")

    # Κάνε μια ερώτηση
    question = "ποιά είναι τα είδη των χαρτών ?"
    answer = qa_system.get_answer(question)

    # Εκτύπωσε την απάντηση
    print(answer)
'''
