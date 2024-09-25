import "dotenv/config"
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

const embeddings = new OpenAIEmbeddings({ // faz o embedding
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-large",
  azureOpenAIApiKey: "",
})

const vectorStore = new Chroma(embeddings, {
  collectionName: "Banco_Vetores"
})

// codigo comentado abaixo é para testar que os chunks foram adicionados ao chroma e buscar eles depois

// const adicionar = await vectorStore.addDocuments(chunks)

// const buscar = await vectorStore.similaritySearch("Oque é a lei do bem", 3);

// for (const doc of buscar) {
//   console.log(`*${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`)
  
// }

export { vectorStore }