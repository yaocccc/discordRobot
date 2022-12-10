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
    console.log("_________");
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

// 1049607633293819934 区块律动
// 1049607877255503932 panews
// 1049607943886209034 深潮
// 1049608642917302313 推特-名人
// 1049612903113818122 机构持仓
// 1050296604529270824 coindesk
// 1050296682547531827 cointelegraph
// 1050296828412825631 chainfeeds
// 1050297075427983431 链捕手
// 1050346402405949491 ico资讯
// 1051083126383845396 推特-交易所
// 1051084100489973851 推特-kol
// 1051088935658463232 推特-机构
