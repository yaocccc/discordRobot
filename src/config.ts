import fs from 'fs';
import path from 'path';
import { RssFeed, Config } from './types';
import { sleep } from './utils';

const configFile = path.resolve(__dirname, '../config.json');

const _config: Config = {
    discordToken: '',
    discordGuildId: '',
    chatGptToken: '',
    chatGptChannelId: '',
    discordSelfId: '',
    appPort: 0,
    feeds: [],
};

const config = () => _config;

const runConfig = async () => {
    const __config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    for (const key in __config) {
        if (JSON.stringify(_config[key]) !== JSON.stringify(__config[key])) {
            _config[key] = __config[key];
        }
    }

    sleep(1000 * 60).then(() => runConfig());
};

// const configToFile = async () => {
//     fs.writeFileSync(
//         configFile,
//         JSON.stringify({
//             _config,
//         })
//     );
// };

export { runConfig, config };
