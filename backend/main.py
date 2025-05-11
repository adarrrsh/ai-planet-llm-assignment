from fastapi import FastAPI,File,UploadFile,Form
from fastapi.middleware.cors import CORSMiddleware
import fitz
from langchain_chroma import Chroma
from langchain_openai import AzureOpenAIEmbeddings,AzureChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from PyPDF2 import PdfReader
import getpass
import os



os.environ["AZURE_OPENAI_API_KEY"] = "YOUR API KEY"
os.environ["AZURE_OPENAI_ENDPOINT"] = "YOUR ENDPOINT"
os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"] = "YOUR DEPLYOEMENT NAME"
os.environ["AZURE_OPENAI_API_VERSION"] = "YOUR API VERSION"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


retriever = None
rag_chain = None

def build_retriever_and_chain():
    global retriever, rag_chain

  
    loader = PyPDFLoader("./llm.pdf")
    docs = loader.load()

 
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    embedding = AzureOpenAIEmbeddings(
        azure_endpoint="YOUR ENDPOINT",
        deployment="YOUR DEPLYOMENT",
        openai_api_key="YOUR API KEY",
        openai_api_version="YOUR VERSION"
    )

  
    vector_store = Chroma.from_documents(splits, embedding=embedding)
    retriever = vector_store.as_retriever()

 
    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Use three sentences maximum and keep the "
        "answer concise.\n\n{context}"
    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    llm = AzureChatOpenAI(
        azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        azure_deployment=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
        openai_api_key=os.environ["AZURE_OPENAI_API_KEY"],
        openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
        model="gpt-4o"
    )


    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)




@app.get("/")
def home():
    return ("Hello world")

@app.post("/read_pdf")
async def read_pdf(pdf: UploadFile = File(...)):
    contents = await pdf.read()
    with open("./llm.pdf", "wb") as f: 
        f.write(contents)

    try:
        
        reader = PdfReader("llm.pdf")
        if reader.pages:
            build_retriever_and_chain()  
            return {"message": "PDF uploaded and retriever rebuilt successfully"}
        else:
            return {"error": "PDF is empty or invalid."}
    except Exception as e:
        return {"error": f"Error opening PDF: {str(e)}"}





@app.post("/ask_pdf")
async def ask_pdf(text: str = Form(...)):
    if rag_chain is None:
        return {"error": "RAG chain not initialized. Please upload a PDF first."}
    result = rag_chain.invoke({"input": text})
    return result