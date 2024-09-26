# projetoSoftex

Este projeto faz um RAG usando JavaScript, Chroma, LangChain e LlamaIndex.

Como executar o programa:

1. Clone o repositório ou baixe o arquivo zip.

2. Navegue até o diretorio do repositório.

3. Execute o comando abaixo para instalar todas as dependências:

```javascript
npm install
```

4. Navegue até a pasta src e crie um arquivo dotenv e configure as chaves de API no arquivo dotenv e as configure corretamente no arquvi configDotEnv.js, as chaves são OpenAI, Llama Cloud e LangSmith para fazer o tracing. 

5. Inicie o banco de dados com o comando abaixo, use um terminal para o Chroma e outro para o Node.

```javascript
Chroma com chroma run --path ./chroma
```

6. Rode o arquivo database.js para popular o chroma com os arquivos da pasta txt.

7. Execute o arquivo query.js para fazer perguntas relacionados aos arquivos na pasta txt.

Veja requirements.txt para ver todas as dependências mais detalhadamente.