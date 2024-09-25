# projetoSoftex

Este projeto faz um RAG usando JavaScript, Chroma, LangChain e LlamaIndex.

Execute o código para instalar todas as dependências:

```javascript
npm install
```

Configure as chaves de API no arquivo dotenv, [siga essas instruções para criar um banco de dados redis](https://redis.io/docs/latest/operate/rc/rc-quickstart/).

As chaves são OpenAI, Llama Cloud se quiser fazer o index e LangSmith para fazer o tracing

Inicie o Chroma com chroma run --path ./chroma

Ver requirements.txt para ver todas as dependências