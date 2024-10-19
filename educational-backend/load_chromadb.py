# Φόρτωση του Chroma vector store από το Google Drive
from langchain_community.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings

embedding_model = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-base")

#chroma_path2 = "/content/drive/MyDrive/chroma_index2#geo"
chroma_path = "/chroma_index1#geo"
#vectorstore_aristotelis_semantic = Chroma(persist_directory=chroma_path2, embedding_function=embedding_model)
vectorstore_aristotelis = Chroma(persist_directory=chroma_path, embedding_function=embedding_model)