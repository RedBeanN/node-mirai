# node-mirai

## [mirai](https://github.com/mamoe/mirai) 的 NodeJs SDK

由于还在开发中, 所有 API 均为待定.

TODO List

- [x] 发送消息
- [x] 引用回复
- [x] 撤回消息
- [ ] 发送图片
- [ ] 群管理相关

### Usage/使用方法

·运行你的 mirai-api-http service

`npm install node-mirai-sdk`

```javascript
const Mirai = require('node-mirai-sdk');

const bot = new Mirai({
  port: 8080, // your server port
  authKey: 'YourAuthKey',
  qq: 123456 // your qq
});

bot.onSignal('authed', () => {
  console.log(`Authed with session key ${bot.sessionKey}`);
  bot.verify();
});

bot.onSignal('verified', () => {
  console.log(`Verified with session key ${bot.sessionKey}`);
});

bot.onMessage(message => {
  const { type, sender, messageChain } = message;
  let msg = '';
  messageChain.forEach(chain => {
    if (chain.type === 'Plain') msg += chain.text;
  });
  // 直接回复
  if (msg.includes('收到了吗')) bot.reply('收到了收到了', message);
  // 引用回复
  else if (msg.includes('引用我')) bot.quoteReply('好的', message);
  // 撤回
  else if (msg.includes('撤回')) bot.recall(message);
});

/*
 * 'all' - 监听好友和群
 * 'friend' - 只监听好友
 * 'group' - 只监听群
*/
bot.listen('all');

process.on('exit', () => {
  bot.release();
});
```
