# node-mirai

## [mirai](https://github.com/mamoe/mirai) 的 NodeJs SDK

由于还在开发中, 所有 API 均为待定.

最低支持: `mirai-console-wrapper-0.2.0` `mirai-core-0.31.1` `mirai-api-http-1.3.2`

### QuickStart/快速开始

- 运行你的 [mirai-api-http](https://github.com/mamoe/mirai-api-http) service

`npm i -S node-mirai-sdk`

main.js

PS:注释中带*为必须有

```javascript
const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

//服务端设置(*)
const bot = new Mirai({
  host: 'http://your.host.name:port', // your server host
  authKey: 'YourAuthKey',
  qq: 123456, // your qq
  enableWebsocket: false,
});

//auth认证(*)
bot.onSignal('authed', () => {
  console.log(`Authed with session key ${bot.sessionKey}`);
  bot.verify();
});

//获取好友列表
bot.onSignal('verified', async () => {
  console.log(`Verified with session key ${bot.sessionKey}`);
  const friendList = await bot.getFriendList();
  console.log(`There are ${friendList.length} friends in bot`);
});

//接受消息,发送消息(*)
bot.onMessage(message => {
  const { type, sender, messageChain, reply, quoteReply } = message;
  let msg = '';
  messageChain.forEach(chain => {
    if (chain.type === 'Plain') msg += Plain.value(chain);
  });
  // 直接回复
  if (msg.includes('收到了吗')) reply('收到了收到了'); // 或者: bot.reply('收到了', message)
  // 引用回复
  else if (msg.includes('引用我')) bot.quoteReply([At(sender.id), Plain('好的')], message); // 或者: bot.reply([...], message, true)
  // 撤回
  else if (msg.includes('撤回')) bot.recall(message);
});

/* 开始监听消息(*)
 * 'all' - 监听好友和群
 * 'friend' - 只监听好友
 * 'group' - 只监听群
 * 'temp' - 只监听临时会话
*/
bot.listen('all');

process.on('exit', () => {
  bot.release();
});

```

另请参考[事件订阅说明](https://github.com/RedBeanN/node-mirai/blob/master/event.md)

[API文档](https://redbean.tech/node-mirai-sdk)
