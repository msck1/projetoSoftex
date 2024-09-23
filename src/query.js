import 'dotenv/config'
import { BufferMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "@langchain/redis";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { createClient } from 'redis';


const client = createClient({ // criando conexao com banco redis para que a api lembre do contexto da conversaa
    password: 'gU6NAhdRkxOmBUixr4jyAXMnLkUG5tux',
    socket: {
        host: 'redis-10511.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
        port: 10511
    }
});

const conexao = await client.connect();

const memory = new BufferMemory({ // faz a memory do chat 
    chatHistory: new RedisChatMessageHistory({
        sessionId: '2',
        sessionTTL: 300,
        client,
    }),
});

const model = new ChatOpenAI({ // modelo, por algum motivo está sempre chamando a api da azure entao eu deixe ele como nula e funciona normalmente com a api da openai
    model: "gpt-4o",
    temperature: 1,
    azureOpenAIApiKey: "",
    openAIApiKey: process.env.OPENAI_API_KEY
});

// faz a chain de input + memory do chat 
const chain = new ConversationChain({ llm: model, memory});

const pergunta1 = await chain.invoke({ input: "Qual meu nome ?" });

console.log({ pergunta1 })

