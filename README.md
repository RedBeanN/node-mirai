# node-mirai

[![NPM Version](https://img.shields.io/npm/v/node-mirai-sdk)](https://www.npmjs.com/package/node-mirai-sdk)

[mirai](https://github.com/mamoe/mirai) 的 Node.js SDK.

由于还在开发中, 所有 API 均为待定.

最低支持:

- `mirai-core-2.6.2`
- `mirai-api-http-2.0.0` (部分兼容 `1.x`)

## QuickStart / 快速开始

- 运行你的 [mirai-api-http](https://github.com/project-mirai/mirai-api-http) service
- 安装 [node-mirai-sdk](https://www.npmjs.com/package/node-mirai-sdk)

```bash
# for mirai-api-http 2.x
npm i -S node-mirai-sdk@latest
# for mirai-api-http 1.x
npm i -S node-mirai-sdk@0.2.4
```

- 编写代码 (main.js)

*PS: 注释中带 \* 为必须有。*

```javascript
// es5 CommonJS
const Mirai = require('node-mirai-sdk');
// es6 module or typescript
import * as Mirai from 'node-mirai-sdk';
// typescript with `esModuleInterop: true`
import Mirai from 'node-mirai-sdk';

const { Plain, At } = Mirai.MessageComponent;

/**
* 服务端设置(*)
* host: mirai-api-http 的地址和端口，默认是 http://127.0.0.1:8080
* verifyKey: mirai-api-http 的 verifyKey，建议手动指定
* qq: 当前 BOT 对应的 QQ 号
* enableWebsocket: 是否开启 WebSocket，需要和 mirai-api-http 的设置一致
* wsOnly: 使用 WebSocket 发送数据
*/
const bot = new Mirai({
  host: 'http://hostname:port',
  // mirai-api-http-2.x
  verifyKey: 'YourVerifyKey',
  // mirai-api-http-1.x
  authKey: 'YourAuthKey',
  qq: 123456,
  enableWebsocket: false,
  wsOnly: false, // 由于 WebSocket Adapter 不支持发送文件，部分功能仍需使用 HTTP Adapter
});

// auth 认证(*)
bot.onSignal('authed', () => {
  console.log(`Authed with session key ${bot.sessionKey}`);
  bot.verify();
});

// session 校验回调
bot.onSignal('verified', async () => {
  console.log(`Verified with session key ${bot.sessionKey}`);

  // 获取好友列表，需要等待 session 校验之后 (verified) 才能调用 SDK 中的主动接口
  const friendList = await bot.getFriendList();
  console.log(`There are ${friendList.length} friends in bot`);
});

// 接受消息,发送消息(*)
bot.onMessage(async message => {
  const { type, sender, messageChain, reply, quoteReply } = message;
  let msg = '';
  messageChain.forEach(chain => {
    if (chain.type === 'Plain')
        msg += Plain.value(chain);                  // 从 messageChain 中提取文字内容
  });

  // 直接回复
  if (msg.includes('收到了吗'))
    reply('收到了收到了');                          // 或者: bot.reply('收到了收到了', message)
  // 引用回复
  else if (msg.includes('引用我'))
    quoteReply([At(sender.id), Plain('好的')]);     // 或者: bot.quoteReply(messageChain, message)
  // 撤回消息
  else if (msg.includes('撤回'))
    bot.recall(message, sender.group.id);           // 私聊为 sender.id
  // 发送图片，参数接受图片路径或 Buffer
  else if (msg.includes('来张图'))
    bot.sendImageMessage("./image.jpg", message);
});

/* 开始监听消息(*)
 * 'all' - 监听好友和群
 * 'friend' - 只监听好友
 * 'group' - 只监听群
 * 'temp' - 只监听临时会话
*/
bot.listen('all'); // 相当于 bot.listen('friend', 'group', 'temp')

// 退出前向 mirai-http-api 发送释放指令(*)
process.on('exit', () => {
  bot.release();
});
```

- 运行 BOT

```bash
node main.js
```

## 高级用法

另请参考

- [事件订阅说明](https://github.com/RedBeanN/node-mirai/blob/master/event.md)
- [API文档](https://redbean.tech/node-mirai-sdk)

```javascript
const Mirai = require('node-mirai-sdk');
const { Plain, At, FlashImage, Image, Face, AtAll, Xml, Json, App, Poke, Forward } = Mirai.MessageComponent;
const { Friend, Group } = Mirai.Target
const { serialize, deserialize } = Mirai.MessageComponent;

// ...

bot.onMessage(async message => {
  const { type, sender, messageChain, reply, quoteReply, recall } = message; //接受其他消息,进行提取关键消息

  // 遍历消息链提取文本内容
  let msg = '';
  messageChain.forEach(chain => {
    if (chain.type === 'Plain') msg += Plain.value(chain); //判断消息类型是不是文字
  });

  // 将消息链序列化为含 mirai 码的字符串
  // 返回内容类似: 文字123[mirai:at:12345]文字234[mirai:image:{abcd}.png]文字345
  const serialized = serialize(messageChain0);

  // 把序列化后的字符串解析为 messageChain
  // [{ type: 'Plain', text: '文字123' }, { type: 'At', target: 12345, display: '' }, ...]
  const deserialized = deserialize(serialized);

  switch (msg) {
    case "文字测试":
      // 回复文字, 第一个参数可以是字符串或消息链, 第二个参数为原始消息或 `Mirai.Target` 构造的对象
      bot.reply('文字测试', message);
      bot.reply([Plain('文字测试')], Friend(123456))
      // 可以使用从 `message` 解构的 `reply` 方法, 无需传入原始消息
      reply('文字测试'); // message.reply('文字测试')
      break;
    
    case "撤回测试":
      // 撤回指定的消息
      // 从 MAH 2.6.0 开始, 如果`message`不带有`sender`信息则需传入原始 QQ 或群号
      // 撤回其他群员的消息需要 bot 有管理权限, 管理员不能撤回群主的消息
      bot.recall(message, sender.group.id);
      // 可以使用从 `message` 解构的 `recall` 方法, 无需传入原始消息
      recall(); // message.recall()
      break;
    // 或者
    case "撤回测试2":
      // 发送消息的接口返回值均提供 `recall` 方法以供撤回, 无需传入原始 QQ 或群号
      const res = await reply('这条消息将被撤回'); // bot.recall(res) throws error!
      setTimeout(() => res.recall(), 2000);
      break;

    case "图片测试":
      bot.reply([
        Image({
          url: 'https://i2.hdslb.com/bfs/archive/68662ffb133c15232d4c7e763c43e07bccc98ccb.jpg'
        })
      ], message); // 回复图片
      break;

    case "表情测试":
      bot.reply([Face(123)], message); // 回复表情
      break;

    case "闪照测试":
      bot.reply([
        FlashImage({
          url:'https://i2.hdslb.com/bfs/archive/68662ffb133c15232d4c7e763c43e07bccc98ccb.jpg'
        })
      ], message); // 回复闪照
      break;

    case "引用测试":
      bot.quoteReply([Plain('引用测试')], message); // 引用消息
      break;
    
    case "@测试":
      bot.reply([At(sender.id)], message); // @测试
      break;

    case "全体@测试":
      bot.reply([AtAll()], message); // 全体@测试"
      break;

    case "戳一戳测试":
      bot.reply([Poke('Poke')], message); // 戳一戳
      break;

    case "转发测试":
      const forwardMessage = [Forward([
        message, // 可以直接转发消息本体
        message.messageChain.find(c => c.type === 'Source').id, // 也可以引用源消息ID
        {
          senderId: 10001, // QQ号
          senderName: 'Pony', // 显示名称
          time: Math.floor(Date.now() / 1000), // 时间戳以秒为单位
          messageChain: [Plain('用_创造快乐')]
        } // 或者自行构建消息列表
      ])]; // 三者可以混合使用
      reply(forwardMessage); // 转发消息
      break;

    case "全体禁言测试":
      bot.setGroupMuteAll(sender.group.id, message); // 全体禁言
      break;
      
    case "全体禁言取消测试":
      bot.setGroupUnmuteAll(sender.group.id, message); // 全体禁言取消
      break;
    
    case "禁言群员测试":
      bot.setGroupMute(sender.group.id,sender.id); // 禁言群成员10分钟
      break;

    case "解除禁言群员测试":
      bot.setGroupUnmute(sender.group.id,sender.id); // 解除群成员禁言
      break;
    
    case "移除群成员测试":
      bot.setGroupKick(sender.group.id,sender.id); // 移除群成员
      break;
    
    case "发布群公告测试":
      bot.setGroupConfig(sender.group.id, {
        announcement:'这是一个测试公告'
      }); // 发布群公告
      break;

    case "修改群员资料测试":
      bot.setGroupMemberInfo(sender.group.id, sender.id, {
        name: '测试'
      });   // 修改群员资料
      break;
  }
});

```

## TypeScript 支持(实验性)

`types/index.d.ts` 为 `tsc` 自动生成, 部分枚举类型可通过 `node-mirai-sdk/type` 引入

``` typescript
import { events, Permission } from 'node-mirai-sdk/type'
// ...
bot.onEvent(events.groupPermissionChange, (event) => {
  if (event.Permission === Permission.MEMBER) {
    // do something
  }
})

```

## 使用 `target` 构造

(由 [@kirainmoe](https://github.com/kirainmoe) 提供)

`Bot` 主动调用部分接口, 需要按照消息的格式, 构造发送对象 `target`:

```javascript
// 私聊发送图片给 12345678
bot.sendImageMessage(url, { type: 'FriendMessage', sender: { id: 12345678 } });
// 群聊发送图片到 998244353
bot.sendImageMessage(url, { type: 'FriendMessage', sender: { group:  { id: 998244353 } } });

```

通过从 NodeMirai.Target 引入 Friend, Group 或 Temp 可以省去构造 target 的过程:

```javascript
const { Friend, Group, Temp } = require("node-mirai-sdk").Target;
bot.sendImageMessage(url, Friend(12345678));
bot.sendImageMessage(url, Group(998244353));
bot.sendImageMessage(url, Temp(998244353, 12345678));               // 给群号为 998244353 的用户 12345678 发送临时消息图片

```
