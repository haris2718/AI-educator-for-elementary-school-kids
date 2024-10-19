#Μια φορα και αποθηκεύει  τις προτάσεις που θα εξάγουμε στο drive
import langchain
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain import hub
from langchain.text_splitter import RecursiveCharacterTextSplitter
#from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import Chroma
from langchain import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.pydantic_v1 import BaseModel
from langchain.chains import create_extraction_chain_pydantic
from langchain.embeddings import SentenceTransformerEmbeddings
import PyPDF2
import sys
import json
import os
import pdfplumber
import re
import pdfplumber
#import pytesseract
from PIL import Image
import ast

os.environ['LANGCHAIN_TRACING_V2'] = 'true'
os.environ['LANGCHAIN_ENDPOINT'] = 'https://api.smith.langchain.com'
os.environ['LANGCHAIN_API_KEY'] = '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'
#os.environ["GROQ_API_KEY"] = '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'
os.environ["GROQ_API_KEY"] = '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'


#sys.path.append('/content/drive/MyDrive/Colab Notebooks/llama3.1/')
#from agentic_chunker import AgenticChunker

# Set your Hugging Face API token
huggingfacehub_api_token = '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'

#obj = hub.pull("wfh/proposal-indexing")
llm = ChatGroq(
    model="llama-3.1-70b-versatile",
    temperature=0,
    max_tokens=2048,
    timeout=None,
    max_retries=5,
)

# Prompt template
template3 = """
SYSTEM
1.Διάσπασε τo "κείμενο" σε απλές και σαφείς προτάσεις.
2.Κράτησε το αυθεντικό ύφος από το κείμενο όταν αυτό είναι εφικτό.
3.Για κάθε οντότητα που συνοδεύεται από επιπρόσθετες πληροφορίες, διαχώρισε αυτές τις πληροφορίες σε ξεχωριστή πρόταση.
4.Αποσαφήνισε την πρόταση προσθέτοντας τους απαραίτητους προσδιορισμούς στα ουσιαστικά ή σε ολόκληρες προτάσεις και αντικατάστησε τις αντωνυμίες με τα πλήρη ονόματα των οντοτήτων στις οποίες αναφέρονται.
5.Η απάντηση πρέπει να είναι στα ελληνικά
6.Να επιστρεψεις το αποτελεσμα σε μορφή json

Example:

Input:Ο Αριστοτέλης ήταν ένας από τους κορυφαίους φιλοσόφους και επιστήμονες της
Κλασσικής εποχής. Ιδρυτής της περιπατητικής φιλοσοφίας, ο συστηματικότερος,
μεθοδικότερος νους του αρχαίου κόσμου και ένας από τους μεγαλύτερους στοχαστές
όλων των εποχών. Όπως επίσης και θεμελιωτής και πρόδρομος πλήθους παλαιότερων
όσο και νεότερων κλάδων της επιστήμης.
Ο φιλόσοφος Αριστοτέλης γεννήθηκε το 384 π.Χ. στα Στάγιρα, το σημερινό Σταυρό
στη βορειοανατολική ακτή της Χαλκιδικής (η οποία ήταν γνήσια ελληνική πόλη που
την είχαν ιδρύσει άποικοι από την Άνδρο και η Χαλκίδα 665 π.Χ., οι οποίοι μιλούσαν
μια παραλλαγή της ιωνικής διαλέκτου) και πέθανε στο κτήμα της μητέρας του στη
Χαλκίδα το 322 π.Χ. Οι γονείς του, Νικόμαχος και Φαιστίδα, κατάγονταν από τους
οικιστές της Χαλκιδικής. Συγκεκριμένα, ο πατέρας του, ανήκε στο γένος ή τη
συντεχνία των Ασκληπιαδών και πολλοί λένε ότι η οικογένειά του είχε μετοικήσει
από τη Μεσσηνία κατά τον 8ο ή 7ο αιώνα. Επίσης λένε ότι θεωρούσε πρόγονό του τον
ομηρικό ήρωα και γιατρό Μαχάονα, γιό του Ασκληπιού. Ο Νικόμαχος ήταν γιατρός,
εύκολα λοιπόν αντιλαμβανόμαστε από που πήγαζε το ενδιαφέρον του Αριστοτέλη για
τις φυσικές επιστήμες και κυρίως τη βιολογία.
Output: ["Ο Αριστοτέλης ήταν ένας από τους κορυφαίους φιλοσόφους και επιστήμονες της Κλασσικής εποχής.",
"Ο Αριστοτέλης ήταν ιδρυτής της περιπατητικής φιλοσοφίας.",
"Ο Αριστοτέλης ήταν ο συστηματικότερος και μεθοδικότερος νους του αρχαίου κόσμου.",
"Ο Αριστοτέλης ήταν ένας από τους μεγαλύτερους στοχαστές όλων των εποχών.",
"Ο Αριστοτέλης ήταν θεμελιωτής και πρόδρομος πλήθους παλαιότερων και νεότερων κλάδων της επιστήμης.",
"Ο Αριστοτέλης γεννήθηκε το 384 π.Χ. στα Στάγιρα.",
"Τα Στάγιρα είναι το σημερινό Σταυρό στη βορειοανατολική ακτή της Χαλκιδικής.",
"Η Χαλκιδική ήταν γνήσια ελληνική πόλη που την είχαν ιδρύσει άποικοι από την Άνδρο και η Χαλκίδα το 665 π.Χ.",
"Οι άποικοι από την Άνδρο και η Χαλκίδα μιλούσαν μια παραλλαγή της ιωνικής διαλέκτου.",
"Ο Αριστοτέλης πέθανε στο κτήμα της μητέρας του στη Χαλκίδα το 322 π.Χ.",
"Οι γονείς του Αριστοτέλη ήταν ο Νικόμαχος και η Φαιστίδα.",
"Ο Νικόμαχος και η Φαιστίδα κατάγονταν από τους οικιστές της Χαλκιδικής.",
"Ο πατέρας του Αριστοτέλη, Νικόμαχος, ανήκε στο γένος ή τη συντεχνία των Ασκληπιαδών.",
"Πολλοί λένε ότι η οικογένεια του Αριστοτέλη είχε μετοικήσει από τη Μεσσηνία κατά τον 8ο ή 7ο αιώνα.",
"Ο Αριστοτέλης θεωρούσε πρόγονό του τον ομηρικό ήρωα και γιατρό Μαχάονα, γιό του Ασκληπιού.",
"Ο Νικόμαχος ήταν γιατρός.",
"Το ενδιαφέρον του Αριστοτέλη για τις φυσικές επιστήμες και κυρίως τη βιολογία προερχόταν από τον πατέρα του."]
HUMAN
Αποσυνθέστε τα παρακάτω:
{input}
"""
# Ρύθμιση του Tesseract OCR για ελληνική γλώσσα
# Ορισμός της διαδρομής του tesseract αν χρησιμοποιείς Windows
#pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
prompt = PromptTemplate.from_template(template3)
runnable = prompt | llm
essay_propositions=[]

'''
with open(pdf_path, 'rb') as pdf_file:
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    essay = [page.extract_text() for page in pdf_reader.pages]
    num_pages = len(pdf_reader.pages)
    print(f"Αριθμός σελίδων: {num_pages}")
'''
# Συνάρτηση για χρήση OCR σε PDF με ελληνική γλώσσα
def ocr_extract_text(page):
    image = page.to_image(resolution=900)  # Μετατροπή σε εικόνα
    ocr_text = pytesseract.image_to_string(image.original, lang='ell+eng')  # Χρήση OCR με ελληνική γλώσσα
    return ocr_text


def clean_text(text):
    """Καθαρισμός κειμένου για αφαίρεση ειδικών χαρακτήρων και κενών γραμμών."""
    # Αφαίρεση ειδικών χαρακτήρων εκτός από αλφαριθμητικά και σημεία στίξης
    #cleaned_text = re.sub(r'[^a-zA-Z0-9α-ωΑ-Ω.,;:\s]', '', text)
    cleaned_text=re.sub(r'[^\w\s.,;:ΆΊΈΌΎΏΪΫα-ωΑ-Ω]', '', text)
    # Αφαίρεση περιττών κενών γραμμών
    cleaned_text = ' '.join(cleaned_text.split())
    return cleaned_text


def get_propositions(text):
    runnable_output = runnable.invoke({
        "input": text
    }).content

    print("Raw output from runnable:")
    print(runnable_output)  # Εμφάνιση της ακατέργαστης εξόδου για διάγνωση

    try:
        propositions = json.loads(runnable_output)
        return propositions
    except json.JSONDecodeError as e:
        print(f"Σφάλμα κατά την ανάλυση JSON: {str(e)}")
        print("Προβληματική έξοδος:")
        try:
          print(runnable_output.split('\n*')[1:])
          #propositions = re.split(r'"\s*,\s*"', runnable_output[1:].strip('[]"'))
          propositions = re.split(r',"\s*|\["|\]', runnable_output)
          #return   runnable_output.split('\n*')
          return propositions
        except Exception as e:
          print(f"Σφάλμα κατά την επεξεργασία runnable_output.split('\n*') : {str(e)}")
          return   runnable_output.split('\n*')[1:]

def print_proposition(text):
    i = 0
    while i < len(text):
        try:
            # Καθαρισμός του κειμένου πριν το στείλουμε στο LLM
            print(text[i])
            para = clean_text(text[i])

            print(f"Processing paragraph {i}:\n{para}")
            propositions = get_propositions(para)

            print(f"Extracted propositions: {propositions}")
            if (len(propositions)>0) or (para == None ):
              essay_propositions.extend(propositions)
              i += 1
              print(f"Done with chunk {i}")
        except Exception as e:
            print(f"Error in chunk {i}: {e}")

'''
το Chroma δεν μπορεί να διαχειριστεί τόσα πολλά δεδομένα ταυτόχρονα σε μία προσθήκη (upsert)
 και χρειάζεται να διαχωρίσεις τα δεδομένα σου σε μικρότερα τμήματα.
 Για να λύσεις αυτό το πρόβλημα, μπορείς να χωρίσεις τα δεδομένα σου σε μικρότερα batches
   και να τα προσθέσεις σταδιακά.
'''
def chunk_list(data_list, batch_size):
    """Συνάρτηση για να διαχωρίσει τα δεδομένα σε μικρότερα batches."""
    for i in range(0, len(data_list), batch_size):
        yield data_list[i:i + batch_size]

# Δημιουργία λίστας για αποθήκευση του κειμένου κάθε σελίδας
page_texts = []

#Δημιουργία λίστας για αποθήκευση των προτάσεων που θα εξάγουμε απο το κείμενο
essay_propositions = []

# PDF processing

pdf_path = 'Geografia_E-Dimotikou_Vivlio-Mathiti-1.pdf'


with pdfplumber.open(pdf_path) as pdf:
    # Εξαγωγή κειμένου από κάθε σελίδα και αποθήκευση στη λίστα
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            page_texts.append(text)  # Αποθήκευση του κειμένου της σελίδας στη λίστα

'''
# για να κάνει την σελιδά εικόνα και έπειτα κείμενο, βοηθα όταν το PDF είναι χάλια
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:

        text = ocr_extract_text(page)
        page_texts.append(text)
'''

temp="".join(page_texts)
# Ορισμός των χαρακτήρων με βάση τους οποίους θα γίνει το split
separators = ["\n\n", "."]

# Δημιουργία του text splitter με τους καθορισμένους separators κοψε το κείμενο ανα 1300 χαρακτηρες
text_splitter = RecursiveCharacterTextSplitter(chunk_size = 1300, chunk_overlap=200 , separators=separators)


# Διάσπαση του κειμένου σε chunks
paragraphs = text_splitter.split_text(temp)

#ξεκινα η διαδικασία ανάκτησεις
print_proposition(paragraphs)

print(f"You have {len(essay_propositions)} propositions")
print(essay_propositions)




# Υποθέτουμε ότι έχεις συνδέσει το Drive και έχεις δημιουργήσει τον Chroma vector store
#documents = ["Αυτό είναι το πρώτο έγγραφο.", "Το δεύτερο έγγραφο έχει άλλο κείμενο.", "Αυτό είναι το τρίτο έγγραφο."]
embedding_model = SentenceTransformerEmbeddings(model_name="intfloat/multilingual-e5-base")

# Αποθήκευση του Chroma vector store στο Google Drive
chroma_path = "/chroma_index1#_geo"

'''
vectorstore_aristotelis = Chroma.from_texts(essay_propositions, embedding_model, persist_directory=chroma_path)
vectorstore_aristotelis.persist()
'''
# Μέγεθος batch (<= 166 σύμφωνα με το σφάλμα)
batch_size = 166

# Διαχωρισμός των δεδομένων σε μικρότερα batches
for batch_texts in chunk_list(essay_propositions, batch_size):
    # Προσθήκη του κάθε batch στο Chroma
    vectorstore_aristotelis = Chroma.from_texts(batch_texts, embedding_model, persist_directory=chroma_path)

print("Chroma αποθηκεύτηκε στο Google Drive.")



