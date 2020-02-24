# node-mirai

## [mirai](https://github.com/mamoe/mirai) 的 NodeJs SDK

由于还在开发中, 所有 API 均为待定.

### Usage/使用方法

·运行你的 mirai-api-http service

`npm install node-mirai`

```javascript
const Mirai = require('node-mirai-sdk');

const bot = new Mirai({
  port: 8080,
  authKey: 'YourAuthKey',
  qq: 123456
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
  if (msg.includes('收到了吗')) bot.reply('收到了收到了', message);
  else if (msg.includes('引用我')) bot.quoteReply('好的', message);
});

bot.listen('all');

process.on('exit', () => {
  bot.release();
});
```
