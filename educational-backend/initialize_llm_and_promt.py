#αρχικοποιείς το llm και δημιουργής το prompt
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
#import bs4
from langchain import hub
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain import HuggingFacePipeline
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from langchain import HuggingFacePipeline
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain_huggingface import HuggingFaceEndpoint
from langchain import PromptTemplate
from huggingface_hub import InferenceApi
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_experimental.text_splitter import SemanticChunker
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.runnables import RunnableMap, RunnablePassthrough
from langchain_community.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings
import os
os.environ['LANGCHAIN_TRACING_V2'] = 'true'
os.environ['LANGCHAIN_ENDPOINT'] = 'https://api.smith.langchain.com'
os.environ['LANGCHAIN_API_KEY'] = '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'
#os.environ["GROQ_API_KEY"] = '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'
os.environ["GROQ_API_KEY"] = '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'
# Set your Hugging Face API token
embedding_model = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-base")

#chroma_path2 = "/content/drive/MyDrive/chroma_index2#geo"
chroma_path = "/content/drive/MyDrive/chroma_index1#geo"
#vectorstore_aristotelis_semantic = Chroma(persist_directory=chroma_path2, embedding_function=embedding_model)
vectorstore_aristotelis = Chroma(persist_directory=chroma_path, embedding_function=embedding_model)

huggingfacehub_api_token='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'


llm = ChatGroq(
    #model="mixtral-8x7b-32768",
    #model="llama3-8b-8192",
    #model="llama-3.1-8b-instant",
    model="llama-3.1-70b-versatile",
    temperature=0,
    max_tokens=2048,
    timeout=None,
    max_retries=2,
    # other params...
)

# Prompt template
template3 = """Χρησιμοποίησε τα ακόλουθα κομμάτια πληροφοριών (context) για να απαντήσεις στην ερώτηση στο τέλος.
Αν δεν γνωρίζεις την απάντηση, απλά πες ότι δεν γνωρίζεις, μην προσπαθήσεις να επινοήσεις μια απάντηση.
Η απαντηση να είναι  στα ελληνικα.

Πληροφορίες:
{context}

Ερώτηση: {question}

Απάντηση στα ελληνικά:"""

prompt = PromptTemplate.from_template(template3)

#κάνε την ερώτηση που θέλεις
question="ποιά είναι τα είδη των χαρτών ?"

#βρές τα 7 πιο σχετικά απο το semantic
#retriever = vectorstore_aristotelis_semantic.as_retriever(search_kwargs={"k": 6})

#βρές τα 10 πιο σχετικά απο το proposal
retriever2 = vectorstore_aristotelis.as_retriever(search_kwargs={"k": 6})


# Βρες τα 10 πιο σχετικά από το semantic retriever
#retrieved_docs_1 = retriever.get_relevant_documents(question)

# Βρες τα 10 πιο σχετικά από το proposal retriever
retrieved_docs_2 = retriever2.get_relevant_documents(question)

# Συνδυασμός των ανακτηθέντων εγγράφων από τα δύο retrievers
#combined_docs = retrieved_docs_1 + retrieved_docs_2
combined_docs = retrieved_docs_2
# Format the combined documents
def format_docs(documents):
    return "\n\n".join(doc.page_content for doc in documents)

# Χρήση του format_docs για να προετοιμάσεις το context από τα συνδυασμένα έγγραφα
formatted_context = format_docs(combined_docs)



# Χρήση του RunnableMap για να περάσει το context και την ερώτηση στο prompt
rag_chain = (
    RunnableMap(
        {
            "context": RunnablePassthrough(),
            "question": RunnablePassthrough(),
        }
    )
    | prompt
    | llm
    | StrOutputParser()
)

# Κάνε invoke στο chain με την ερώτηση
result = rag_chain.invoke({"context": formatted_context, "question": question})
print(result)
