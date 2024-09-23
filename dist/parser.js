import 'dotenv/config';
import { LlamaParseReader } from 'llamaindex';
async function main() {
    const path = "pdf/OCDE-Manual-Frascati-em-portugues-Brasil.pdf"; // path do arquivo
    const reader = new LlamaParseReader({ resultType: "markdown", language: "pt" }); // classe que le o arquivo e salva ele em md
    const documents = await reader.loadData(path); // carrega os documetos para a api
    console.log(documents);
}
main().catch(console.error);
