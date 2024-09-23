import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma"
import { OpenAIEmbeddings } from "@langchain/openai"




const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});



// const client = new ChromaClient();

// const collection = await client.createCollection({
//     name: "teste2",
// });

// await collection.add({
//     documents: [
//         "Documento sobre carros",
//         "Documento sobre maças"
//     ],
//     ids: ["id1", "id2"],
// })

// const results = await collection.query({
//     queryTexts: "Carros",
//     nResults: 2,
// });

// console.log(results);

