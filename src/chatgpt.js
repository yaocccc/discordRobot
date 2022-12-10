// 这个文件没办法转为ts

const {sleep} = require('./utils');

let client;
let token = '';

async function init() {
    // To use ESM in CommonJS, you can use a dynamic import
    const { ChatGPTAPI } = await import('chatgpt');
    const { config } = require('./config');
    if (config().chatGptToken != token) {
        console.log('init chatgpt');
        const api = new ChatGPTAPI({
            sessionToken: config().chatGptToken,
        });
        await api.ensureAuth();
        client = api;
    }

    sleep(1000 * 10).then(() => init());
}

async function send(msg) {
    const response = await client.sendMessage(msg);
    return response;
}

exports.runChatGpt = init;
exports.sendChatGpt = send;
