import { runConfig } from './config';
import { runDiscord } from './discord';
import { runRss } from './rss';
import { runChatGpt } from './chatgpt';
import { runServer } from './server';

const run = async () => {
    await runConfig();  console.log('config loaded');
    // await runChatGpt(); console.log('chatgpt loaded');
    await runDiscord(); console.log('discord loaded');
    await runRss();     console.log('rss loaded');
    await runServer();  console.log('server loaded');
};

run();
