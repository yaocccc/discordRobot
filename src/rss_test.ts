import * as RSSHub from 'rsshub';
import path from 'path';
import { sleep, runCMD } from './utils';
import { RssFeed } from './types';
import { send } from './discord';
import { config } from './config';

const rss2jsonBin = path.resolve(__dirname, '../rss2json/rss2json');

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
        if (feed.channels.length) {
            if (feed.preparse) {
                const rssData = await runCMD(`${rss2jsonBin} "${feed.url}"`).then(r => JSON.parse(r));
                rssData.item = rssData.items;
                const msgs = rssToMsg(feed, rssData);
                console.log(msgs)
            } else {
                const msgs = await RSSHub.request(feed.url).then((res: any) => rssToMsg(feed, res));
                console.log(msgs);
            }
        }
    } catch (e) {
        console.log(feed.url, e);
    }

    await sleep(feed.cronTime * 1000);
    runFeed(feed, pid);
};

// run all feeds
const run = async () => {
    runState.pid = Date.now();
    const feed: RssFeed = {
        "url": "http://cointelegraph.com/rss",
        "desc": "SBF的推特",
        "cronTime": 60,
        "preparse": true,
        "template": "[title]\n[link]",
        "channels": ["1049608642917302313"]
    }
    runFeed(feed, runState.pid);
};

run();
