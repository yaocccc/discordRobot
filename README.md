# Hi

nodejs

使用rsshub收集信息，并向config.json中配置的discord频道进行推送，接入chatGPT

动态配置

```plaintext
  yarn
  yarn build
  node dist/index.js
```

```plaintext
  .
  ├── rss2json              -- 一个rss转json的实现 特殊源需要使用
  │   ├── README.md
  │   ├── rss2json          -- 可执行文件
  │   └── rss2json.go       -- go源码
  ├── src
  │   ├── chatgpt.js        -- 接入chatgpt实现 别问我为啥是js的
  │   ├── config.ts         -- 配置载入实现
  │   ├── discord.ts        -- dc实现
  │   ├── discord_getter.ts -- dc获取信息使用 临时使用
  │   ├── index.ts          -- 入口
  │   ├── rss.ts            -- rsshub 实现
  │   ├── rss_test.ts       -- rsshub test文件 
  │   ├── types.ts          -- 全局类型
  │   └── utils.ts          -- 工具方法
  ├── config.json           -- 配置文件(gitignore保护)
  ├── package.json
  ├── README.md
  ├── tsconfig.json
  └── yarn.lock
```

# Config

默认没有config.json文件(gitignore保护)

格式:

```plaintext
{
    "discordToken": "dc机器人token",
    "discordGuildId": "dc服务器id",
    "chatGptToken": "chatGptSessionToken",
    "chatGptChannelId": "chatGpt频道id",
    "discordSelfId": "机器人自己的id",
    "appPort": 1763,
    "feeds": [ // RSSHub feed
        {
            "url": "/twitter/user/cz_binance/excludeReplies=1&count=3",
            "desc": "cz的推特",
            "cronTime": 20, // 获取间隙 秒
            "preparse": false,
            "template": "[author]: [title]\n[link]", // 消息模板
            "channels": [] // 关联频道id列表
        }
    ]
}
```
