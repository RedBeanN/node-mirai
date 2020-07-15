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
const { Plain, At, FlashImage, Image,Face,AtAll,Xml,Json,App,Poke } = Mirai.MessageComponent;
//服务端设置
const bot = new Mirai({ 
  host:'http://127.0.0.1:8080',
  authKey:'1234567890',
  qq:123456789,
  enableWebsocket:true,
});

//auth认证
bot.onSignal('authed', () => {
  console.log(`认证会话 ${bot.sessionKey}`);
  bot.verify();
});

//获取好友列表
bot.onSignal('verified', async () => {
  console.log(`会话使用 ${bot.sessionKey}`);
  const friendList = await bot.getFriendList();
  console.log(`There are ${friendList.length} friends in bot`);
});

//接受消息,发送消息(*)
bot.onMessage(message => {
  const { type, sender, messageChain, reply, quoteReply } = message; //接受其他消息,进行提取关键消息
  let msg = ''; 
  messageChain.forEach(chain => {
    if (chain.type === 'Plain') msg += Plain.value(chain); //判断消息类型是不是文字
  });
  switch (msg) {
    case "文字测试" :
      bot.reply([Plain('文字测试ok')],message) //回复文字
      break;
    
    case "撤回测试" :
      bot.recall(message) //撤回测试,注意:管理不能撤回群主消息
      break;

    case "图片测试":
      bot.reply([Image({url:'https://i2.hdslb.com/bfs/archive/68662ffb133c15232d4c7e763c43e07bccc98ccb.jpg'})],message) // 回复图片
      break

    case "表情测试":
      bot.reply([Face(123)],message) // 回复表情
      break

    case "闪照测试":
      bot.reply([FlashImage({url:'https://i2.hdslb.com/bfs/archive/68662ffb133c15232d4c7e763c43e07bccc98ccb.jpg'})],message) // 回复闪照
      break

    case "引用测试":
      bot.quoteReply([Plain('引用测试')], message) // 引用消息
      break
    
    case "@测试":
      bot.reply([At(sender.id)], message) // @测试
      break

    case "全体@测试":
      bot.reply([AtAll()], message) // 全体@测试"
      break

    case "戳一戳测试":
      bot.reply([Poke('Poke')], message) // 戳一戳
      break

    case "全体禁言测试":
      bot.setGroupMuteAll(sender.group.id, message) // 全体禁言"
      break
      
    case "全体禁言取消测试":
      bot.setGroupUnmuteAll(sender.group.id, message) // 全体禁言取消"
      break
    
    case "禁言群员测试":
      bot.setGroupMute(sender.group.id,sender.id) // 禁言群成员10分钟"
      break

    case "解除禁言群员测试":
      bot.setGroupUnmute(sender.group.id,sender.id) // 解除群成员禁言"
      break
    
    case "移除群成员测试":
      bot.setGroupKick(sender.group.id,sender.id) // 移除群成员"
      break
    
    case "发布群公告测试":
      bot.setGroupConfig(sender.group.id,{announcement:'这是一个测试公告'}) // 发布群公告
      break

    case "修改群员资料测试":
      bot.setGroupMemberInfo(sender.group.id,sender.id,{name:'测试'}) // 修改群员资料"
      break
  }
});

/* 开始监听消息(*)
 * 'all' - 监听好友和群
 * 'friend' - 只监听好友
 * 'group' - 只监听群
 * 'temp' - 只监听临时会话
*/
bot.listen('group');

process.on('exit', () => {
  bot.release();
});
```

另请参考[事件订阅说明](https://github.com/RedBeanN/node-mirai/blob/master/event.md)

[API文档](https://redbean.tech/node-mirai-sdk)
