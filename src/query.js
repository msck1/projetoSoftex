import 'dotenv/config'
import { BufferMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "@langchain/redis";
import { ChatOpenAI } from "@langchain/openai";
import { createClient } from 'redis';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { vectorStore } from './database.js';

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
        sessionId: '4',
        sessionTTL: 300,
        client,
    }),
    inputKey: "human_input",
    memoryKey: "chat_history",
    returnMessages: true,
});

const model = new ChatOpenAI({ // modelo, por algum motivo está sempre chamando a api da azure entao eu deixe ele como nula e funciona normalmente com a api da openai
    model: "gpt-4o",
    temperature: 1,
    azureOpenAIApiKey: "",
    openAIApiKey: process.env.OPENAI_API_KEY
});
 

async function main(question, questionRetriever) {

const history = await memory.loadMemoryVariables({})


const contextualizarIaPrompt = `Com um historico de chat e a ultima pergunta do usuario que pode referenciaralgum contexto no historico de chat, formule uma pergunta autonoma que pode ser entendida sem o historico dechat. NÃO responda a pergunta, apenas refaça ela se necessario e retorne como est;a.;
`

const contextualizarPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizarIaPrompt],
    ...history.chat_history,
    ["human", question]
]);

const contextualizarChain = contextualizarPrompt.pipe(model).pipe(new StringOutputParser());
const contextualizadaQuestion = await contextualizarChain.invoke({});

// busca os 5 chunks mais proximos de acordo com o query
const retriever = vectorStore.asRetriever({
    k: 5,
})

const context = await retriever.invoke(questionRetriever) 

const template = `Voce é um ajudante que responde perguntas do usuario. Use os pedaços de contexto recuperado a seguir para formular sua pergunta. Se voce não sabe a pergunta, diga que não sabe.
Pergunta: {human_input}
Contexto: {context}
Historico de Chat: {chat_history}
Resposta: `

const prompt = PromptTemplate.fromTemplate(template)

const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt,
    outputParser: new StringOutputParser(),
})

const resposta = await chain.invoke({
    human_input: question,
    context: context,
    chat_history: history.chat_history
})

// imprime os documentos fontes e suas linhas 
for (const doc of context) {
      console.log(`Fontes: [${JSON.stringify(doc.metadata, null)}]`)
    }

await memory.saveContext(
    {human_input: question},
    {ai_output: resposta}
);

return resposta

}

// mudar para input do usuario e talvez pensar em uma logica melhor para esses input 
const questionRetriever = "Oque é o Manual de Oslo"
const question = "Para oque ele serve ?"; 
const response = await main(question, questionRetriever);

console.log(response)
