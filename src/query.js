import 'dotenv/config'
import { BufferMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "@langchain/redis";
import { ChatOpenAI } from "@langchain/openai";
import { createClient } from 'redis';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { PromptTemplate } from '@langchain/core/prompts';
import { ConversationChain } from "langchain/chains";
import { vectorStore } from './database.js';
import { cos_sim } from 'chromadb-default-embed/src/transformers.js';

// inserir dados do banco
const client = createClient({ // criando conexao com banco redis para que a api lembre do contexto da conversa
    password: '',
    socket: {
        host: '',
        port: '',
    }
});

const conexao = await client.connect();

const memory = new BufferMemory({ // faz a memory do chat
    chatHistory: new RedisChatMessageHistory({
        sessionId: '10',
        sessionTTL: 300,
        client,
    }),
    inputKey: "human_input",
    memoryKey: "chat_history",
});

const model = new ChatOpenAI({ // modelo, por algum motivo está sempre chamando a api da azure entao eu deixe ele como nula e funciona normalmente com a api da openai
    model: "gpt-4o",
    temperature: 1,
    azureOpenAIApiKey: "",
    openAIApiKey: process.env.OPENAI_API_KEY
});
 
// pensar em uma logica para essas ambas const
const question = "Oque é o Manual de Oslo" // mudar para input do usuario

const questionRetriver = "Oque é o Manual de Oslo"

// busca os 5 chunks mais proximos de acordo com o query
const retriever = vectorStore.asRetriever({
    k: 5,
})
const context = await retriever.invoke(questionRetriver) 

const template = `Voce é um ajudante que responde perguntas do usuario. Use os pedaços de contexto recuperado a seguir para formular sua pergunta. Se voce não sabe a pergunta, diga que não sabe.
Pergunta: {human_input}
Contexto: {context}
Resposta: `

const prompt = PromptTemplate.fromTemplate(template)

const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt,

})

const resposta = await chain.invoke({
    human_input: question,
    context: context,
})

console.log(resposta)

// imprime os documentos fontes e suas linhas 
for (const doc of context) {
      console.log(`Fontes: [${JSON.stringify(doc.metadata, null)}]`)
    }