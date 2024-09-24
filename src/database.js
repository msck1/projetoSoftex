import "dotenv/config"
import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory"
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new DirectoryLoader("../md",{
        ".txt": (path) => new TextLoader (path),
    },
);

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    
});

const chunks = await splitter.splitDocuments(docs);

console.log(chunks)

console.log(docs)

console.log(splitter)

eddings( chunks, { // faz o embedding
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-large",
  azureOpenAIApiKey: "",
})

const vectorStore = new ChromaClient() // cria cliente chroma

await vectorStore.deleteCollection({ // deleta cliente chroma
  name: "colecaocerta"
})

const collection = await vectorStore.createCollection({ // cria coleçao
  name: "colecaocerta",
  metadata: {
    "descricao": "primeira_colecao"
  },
  embeddingFunction: embeddings
})

const collections = await vectorStore.listCollections() // lista todas coleçoes

console.log(collections)

console.log(collection)