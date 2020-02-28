# node-mirai

## [mirai](https://github.com/mamoe/mirai) 的 NodeJs SDK

由于还在开发中, 所有 API 均为待定.

TODO List

- [x] 发送消息
- [x] 引用回复
- [x] 撤回消息
- [ ] 发送图片
- [x] 群管理相关

### Usage/使用方法

·运行你的 mirai-api-http service

`npm i -S node-mirai-sdk`

```javascript
const Mirai = require('node-mirai-sdk');

const bot = new Mirai({
  host: 'http://your.host.name:port', // your server host
  authKey: 'YourAuthKey',
  qq: 123456 // your qq
});

bot.onSignal('authed', () => {
  console.log(`Authed with session key ${bot.sessionKey}`);
  bot.verify();
});

bot.onSignal('verified', async () => {
  console.log(`Verified with session key ${bot.sessionKey}`);
  // 获取好友列表
  const friendList = await bot.getFriendList();
  console.log(`There are ${friendList.length} friends in bot`);
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

// 其他 API
// 获取群列表
bot.getGroupList();
// 获取群成员列表
bot.getGroupMemberList(groupId);

// 禁言群成员, 需有相应权限
bot.setGroupMute(groupId, memberId);
bot.setGroupUnmute(groupId, memberId);
// 全体禁言, 需有相应权限
bot.setGroupMuteAll(groupId);
bot.setGroupUnmuteAll(groupId);
// 群踢人, 需有相应权限
bot.setGroupKick(groupId, memberId, message);
// 群设置, 需有相应权限
bot.setGroupConfig(groupId, config);
bot.getGroupConfig(groupId);
// 群成员信息, 设置信息需有相应权限
bot.setGroupMemberInfo(groupId, memberId, info);
bot.getGroupMemberInfo(groupId, memberId);
```
