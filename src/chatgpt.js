// 这个文件没办法转为ts

const {sleep} = require('./utils');

let client;
let token = '';

const conversationMap = new Map();

function resetConversation(id) {
    if (conversationMap.has(id)) {
        conversationMap.delete(id);
    }
}

function getConversation(id) {
    if (conversationMap.has(id)) {
        return conversationMap.get(id);
    }
    const conversation = client.getConversation();
    conversationMap.set(id, conversation);
    return conversation;
}

// TODO: chatGPT鉴权部分
async function init() {
    // To use ESM in CommonJS, you can use a dynamic import
    const {ChatGPTAPI, getOpenAIAuth} = await import('chatgpt');
    const {config} = require('./config');
    if (config().chatGptToken != token) {
        console.log('init chatgpt');
        const _c = config();
        token = _c.chatGptToken;

        const api = new ChatGPTAPI({
            sessionToken: token,
            userAgent: _c.chatGptUserAgent,
            clearanceToken: _c.chatGptClearanceToken,
        });
        // await api.ensureAuth()
        client = api;
    }

    sleep(1000 * 10).then(() => init());
}

async function send(id, msg) {
    try {
        const currentConversation = getConversation(id);
        const response = await currentConversation.sendMessage(msg);
        return response;
    } catch (e) {
        console.log(e)
        conversationMap.delete(id);
        return e.toString();
    }
}

exports.runChatGpt = init;
exports.sendChatGpt = send;
