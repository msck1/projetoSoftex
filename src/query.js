import 'dotenv/config'
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createClient } from 'redis';
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { RedisChatMessageHistory } from '@langchain/redis';
import { vectorStore } from './database.js';

const client = createClient({ // criando conexao com banco redis para que a api lembre do contexto da conversa
    password: 'W1CCCPdJbVqr8SYiLmsCXgdrbqddbMEb',
    socket: {
        host: 'redis-10293.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
        port: 10293
    }
});

// tenta conectar ao redis
try {
    
    await client.connect();

    console.log("Conexão com Redis feita com sucesso")

} catch (error) {

    console.error("A conexão com o Redis falhou",error)
    
}

//inputs de usuario aqui 
const perguntaRetriever = "Oque é o manual de oslo ?";

const perguntaQuery = "Oque é o manual de oslo ?";

//busca chunks mais proximos ai perguntaRetriever
const searchResults = await vectorStore.similaritySearch(perguntaRetriever, 3);

const texto = searchResults.map(doc => doc.pageContent);

const textoFontes = searchResults.map(doc => doc.metadata);

//transforma o resultado em string
const fontes = JSON.stringify(textoFontes)

const context = texto.join('\n\n');

// prompt 
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Voce é um ajudante que responde perguntas do usuario. Oriente suas respostas com os pedaços de contexto recuperado a seguir e o historico de chat para formular sua resposta. Se voce não sabe a resposta, diga que não sabe. Contexto: ${context}`],
    new MessagesPlaceholder("history"),
    ["human", "{question}"],
  ]);

// modelo 
  const chain = prompt.pipe(
    new ChatOpenAI({ 
        model: "gpt-3.5-turbo-0125",
        temperature: 1,
        azureOpenAIApiKey: "",
        openAIApiKey: process.env.OPENAI_API_KEY,
    })
  ); 

// chain principal
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (sessionId) => new RedisChatMessageHistory({
    client,
    sessionId: '1',
    sessionTTL: 300,
  }),
  inputMessagesKey: "question",
  historyMessagesKey: "history",
});

// chain de resposta
const result = await chainWithHistory.invoke(
    {
      question: perguntaQuery,
    },
    {
      configurable: {
        sessionId: '1',
      },
    }
  );

console.log(result)

console.log(fontes)