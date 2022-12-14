import * as RSSHub from 'rsshub';
import { parse as rss2json } from 'rss-to-json';
import { sleep } from './utils';
import { RssFeed } from './types';
import { send } from './discord';
import { config } from './config';

const runState = {
    pid: 0, // 每次运行run时，会更新pid，旧的pid会被丢弃，防止旧的runFeed在新的run中运行
    feeds: [],
};

RSSHub.init({
    CACHE_TYPE: null,
});

const rssToMsg = (feed: RssFeed, rssData: any) => {
    console.log(feed.url, rssData.item.length);
    return rssData.item.map((item: any) => feed.template.replace(/\[([a-z]+)\]/g, (_, key) => item[key]));
};

const runFeed = async (feed: RssFeed, pid: number) => {
    if (pid !== runState.pid) return;

    try {
        if (feed.channels.length) {
            if (feed.rss2json) {
                const rssData = await rss2json('https://www.chainfeeds.xyz/rss');
                const msgs = rssToMsg(feed, { item: rssData.items });
                send(feed.channels, msgs);
            } else {
                const msgs = await RSSHub.request(feed.url).then((res: any) => rssToMsg(feed, res));
                send(feed.channels, msgs);
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
    const feeds = config().feeds;
    if (runState.feeds !== feeds) {
        console.log('rss feeds changed, start');
        runState.feeds = feeds;
        runState.pid = Date.now();
        for (const feed of feeds) {
            await sleep(100);
            runFeed(feed, runState.pid);
        }
    }
    sleep(1000 * 10).then(() => run());
};

export { run as runRss };
