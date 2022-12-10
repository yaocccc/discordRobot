import * as RSSHub from 'rsshub';
import { sleep } from './utils';
import { RssFeed } from './types';
import { runConfig, config } from './config';
import { send } from './discord';

const runState = {
    pid: 0, // 每次运行run时，会更新pid，旧的pid会被丢弃，防止旧的runFeed在新的run中运行
};

RSSHub.init({
    CACHE_TYPE: null,
});

const rssToMsg = (feed: RssFeed, rssData: any) => {
    console.log(feed.url, rssData.item.length);
    return rssData.item.map((item: any) => {
        return feed.template.replace(/\[([a-z]+)\]/g, (_, key) => {
            return item[key];
        });
    });
};

const runFeed = async (feed: RssFeed, pid: number) => {
    if (pid !== runState.pid) return;

    try {
        const msgs = await RSSHub.request(feed.url).then((res: any) => rssToMsg(feed, res));
        send(feed.channels, msgs);
    } catch (e) {
        console.log(feed.url, e);
    }

    await sleep(feed.cronTime * 1000);
    runFeed(feed, pid);
};

// run all feeds
const run = async () => {
    await runConfig();
    runState.pid = Date.now();
    for (const feed of config().feeds) {
        await sleep(100);
        runFeed(feed, runState.pid);
    }
};

run();
