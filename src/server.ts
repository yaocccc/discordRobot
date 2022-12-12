import Koa from 'koa';
import { Middleware, ParameterizedContext } from 'koa';
import bodyParser from 'koa-body';
import Router from 'koa-router';
import { getChannelById } from './discord';
import { config } from './config';

// request parse
export const createRequestParse = (bodyParser: Middleware): Middleware => {
    return async (ctx: ParameterizedContext, next: () => Promise<any>) => {
        const startTime = Date.now();
        try {
            await bodyParser(ctx, () => Promise.resolve(0));
        } catch (e) {
            ctx.logger.info(`monitor: error parsing request.`);
        }
        await next();
    };
};

const run = async () => {
    const app = new Koa();
    const router = new Router();

    router.get('/feeds', async (ctx: ParameterizedContext) => {
        const feeds = config().feeds;
        ctx.body = feeds
            .map((feed) =>
                [
                    `url: ${feed.url}`,
                    `desc: ${feed.desc}`,
                    `template: ${JSON.stringify(feed.template)}`,
                    `channels: ${feed.channels.map((id) => getChannelById(id).name)}`,
                    `interval: ${feed.cronTime}`,
                    `rss2json: ${feed.rss2json}`,
                ].join('\n')
            )
            .join('\n\n');
    });

    app.use(createRequestParse(bodyParser({ multipart: true, formidable: { maxFileSize: 3145728 } }))).use(router.routes());

    const server = app.listen(config().appPort);
    return server;
};

export { run as runServer };
