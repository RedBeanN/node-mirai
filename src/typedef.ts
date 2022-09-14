/**
 * @file typedef.ts
 * @description Define types for .d.ts
 */
/**
 * @description 来自 MiraiApiHttp 的响应状态码
 */
export enum ResponseCode {
  SUCCESS = 0,
  VERIFY_KEY_ERROR = 1,
  BOT_NOT_EXIST = 2,
  SESSION_INVALID = 3,
  SESSION_NOT_AUTH = 4,
  TARGET_NOT_EXIST = 5,
  FILE_NOT_EXIST = 6,
  NOT_PERMISSION = 10,
  BOT_MUTED = 20,
  MESSAGE_TOO_LONG = 30,
  PARAM_ERROR = 400,
}
/**
 * @description 群员或 bot 在群内的权限
 */
export enum Permission {
  OWNER = 'OWNER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  MEMBER = 'MEMBER',
}
/**
 * @description 消息类型
 */
export enum MessageType {
  FriendMessage = 'FriendMessage',
  GroupMessage = 'GroupMessage',
  TempMessage = 'TempMessage',
  // TODO: Support following types
  StrangerMessage = 'StrangerMessage',
  OtherClientMessage = 'OtherClientMessage',
  FriendSyncMessage = 'FriendSyncMessage',
  GroupSyncMessage = 'GroupSyncMessage',
  TempSyncMessage = 'TempSyncMessage',
  StrangerSyncMessage = 'StrangerSyncMessage',
}
/**
 * 好友资料 - 性别
 */
export enum UserSex {
  UNKNOWN = 'UNKNOWN',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ChainType {
  Source = 'Source',
  Plain = 'Plain',
  At = 'At',
  AtAll = 'AtAll',
  Face = 'Face',
  Image = 'Image',
  FlashImage = 'FlashImage',
  Xml = 'Xml',
  Json = 'Json',
  App = 'App',
  Quote = 'Quote',
  Poke = 'Poke',
  Dice = 'Dice',
  Voice = 'Voice',
  Audio = 'Audio',
  MarketFace = 'MarketFace',
  MusicShare = 'MusicShare',
  ForwardMessage = 'Forward',
  File = 'File',
  MiraiCode = 'MiraiCode',
}

/**
 * @typedef { Object } GroupMember 群成员
 * @property { number } id QQ
 * @property { string } memberName 群昵称
 * @property { 'OWNER' | 'ADMINISTRATOR' | 'MEMBER' } permission 群员在群中的权限
 * @property { string } specialTitle 群头衔
 * @property { number } joinTimestamp 加群时间
 * @property { number } lastSpeakTimestamp 最近发言时间
 * @property { number } muteTimeRemaining 禁言剩余时间
 * @property { GroupPermissionInfo } group bot在群中的权限信息
 */
export type GroupMember = {
  /**
   * QQ 号
   */
  id: number,
  /**
   * 群昵称
   */
  memberName: string,
  /**
   * 群权限
   */
  permission: Permission,
  /**
   * 群头衔
   */
  specialTitle: string,
  /**
   * 加群时间
   */
  joinTimestamp: number,
  /**
   * 最后发言时间
   */
  lastSpeakTimestamp: number,
  /**
   * 禁言剩余时间
   */
  muteTimeRemaining: number,
}
/**
 * @typedef { Object } GroupInfo 群资料
 * @property { number } id 群号
 * @property { string } name 群名
 * @property { string } announcement 群公告
 * @property { boolean } confessTalk 是否开启坦白说
 * @property { boolean } allowMemberInvite 是否允许群员邀请
 * @property { boolean } autoAprove 是否开启自动审批
 * @property { boolean } anonymousChat 是否开启匿名聊天
 */
export type GroupInfo = {
  /**
   * 群号
   */
  id: number,
  /**
   * 群名
   */
  name: string,
  /**
   * 群公告
   */
  announcement: string,
  /**
   * 是否开启坦白说
   */
  confessTalk: boolean,
  /**
   * 是否允许群员邀请
   */
  allowMemberInvite: boolean,
  /**
   * 是否开启自动审批
   */
  autoAprove: boolean,
  /**
   * 是否开启匿名聊天
   */
  anonymousChat: boolean,
}

/**
 * @typedef { Object } GroupFile 群文件
 * @property { string } name 文件名
 * @property { string } id 文件ID
 * @property { string } path 文件路径
 * @property { GroupFile | null } parent 所在文件夹, null为根目录
 * @property { GroupPermissionInfo } contact 群权限信息
 * @property { boolean } isFile 是否为文件
 * @property { boolean } isDirectory 是否为文件夹
 * @property { object } [downloadInfo] 下载信息
 * @property { string } downloadInfo.sha1 sha1校验
 * @property { string } downloadInfo.md5 md5校验
 * @property { number } downloadInfo.downloadTimes 下载次数
 * @property { number } downloadInfo.uploaderId 上传者
 * @property { number } downloadInfo.uploadTime 上传时间
 * @property { number } downloadInfo.lastModifyTime 更新时间
 * @property { string } downloadInfo.url 下载url
 */
export type GroupFile = {
  /**
   * 文件名
   */
  name: string,
  /**
   * 文件ID
   */
  id: string,
  /**
   * 文件路径
   */
  path: string,
  /**
   * 所在文件夹, null为根目录
   */
  parent: GroupFile | null,
  /**
   * 群权限信息
   */
  contact: GroupPermissionInfo,
  /**
   * 是否为文件
   */
  isFile: boolean,
  /**
   * 是否为文件夹
   */
  isDirectory: boolean,
  downloadInfo?: {
    /**
     * SHA1 校验
     */
    sha1: string,
    /**
     * MD5 校验
     */
    md5: string,
    /**
     * 下载次数
     */
    downloadTimes: number,
    /**
     * 上传者
     */
    uploaderId: number,
    /**
     * 上传时间
     */
    uploadTime: number,
    /**
     * 更新时间
     */
    lastModifyTime: number,
    /**
     * 下载 URL
     */
    url: string,
  }
}

/**
 * @typedef { Object } GroupPermissionInfo 群权限信息
 * @property { number } id 群号
 * @property { string } name 群名
 * @property { 'OWNER' | 'ADMINISTRATOR' | 'MEMBER' } permission bot 在群内的权限
 */
export type GroupPermissionInfo = {
  id: number,
  name: string,
  /**
   * Bot 在群内的权限
   */
  permission: Permission,
}
/**
 * @typedef { Object } Friend
 * @property { number } id 发送者的QQ
 * @property { string } nickname 发送者的昵称
 * @property { string } remark 发送者的备注
 */
export type Friend = {
  id: number,
  nickname: string,
  remark: string,
}
export type GroupSender = {
  id: number,
  memberName: String,
  specialTitle: String,
  permission: Permission,
  joinTimestamp: number,
  lastSpeakTimestamp: number,
  group: GroupPermissionInfo,
}


/**
 * @typedef { Object } httpApiResponse
 * @property { number } code 状态码 https://github.com/project-mirai/mirai-api-http/blob/master/docs/api/API.md#%E7%8A%B6%E6%80%81%E7%A0%81
 * @property { string } msg response message
 * @property { string } [session] auth(verify) 响应
 * @property { number } [messageId] reply/quoteReply 响应，标识本条消息，用于撤回和引用回复
 */
export type httpApiResponse = {
  code: ResponseCode,
  msg: string,
  session?: string,
  messageId?: string,
}

export type MessageResponse = httpApiResponse & {
  /**
   * 撤回发出的消息
   */
  recall: () => Promise<httpApiResponse>
}

/**
 * @typedef { Object } ForwardNode
 * @property { number } senderId 发送人QQ
 * @property { number } time 发送时间
 * @property { string } senderName 显示名称
 * @property { MessageChain[] } [messageChain]
 */
export type ForwardNode = {
  senderId: number,
  time: number,
  senderName: string,
  messageChain: MessageChain[]
}
/**
 * @typedef { Array<ForwardNode & {messageId:number}> } ForwardNodeList
 */
export type ForwardNodeList = Array<ForwardNode & { messageId?: number }>

/**
 * @typedef { Object } MessageChain 消息链对象, node-mirai-sdk 提供各类型的 .value() 方法获得各自的属性值
 * @property { string } type 消息类型
 * @property { number | string } [id] Source 类型中的消息 id, 或Quote类型中引用的源消息的 id, 或文件 id
 * @property { number } [time] Source 类型中的时间戳
 * @property { number } [groupId] Quote 类型中源消息所在群的群号, 好友消息时为 0
 * @property { number } [senderId] Quote 类型中源消息发送者的 qq 号
 * @property { object } [origin] Quote 类型中源消息的 MessageChain
 * @property { string } [text] Plain 类型的文本
 * @property { number } [target] At 类型中 @ 目标的 qq 号
 * @property { string } [display] At 类型中 @ 目标的群名片
 * @property { number } [faceId] Face 类型中表情的编号
 * @property { string } [imageId] Image/FlashImage 类型中图片的 imageId
 * @property { string } [voiceId] Voice 类型中语音的 voiceId
 * @property { string } [url] Image/FlashImage/Voice 类型中图片的 url, 可用于下载图片和语音
 * @property { string } [xml] Xml 类型中的 xml 字符串
 * @property { string } [json] Json 类型中的 json 字符串
 * @property { string } [content] App 类型中的 app content 字符串
 * @property { string } [name] Poke/File 类型中的 name
 * @property { number } [size] File 类型中的 size
 * @property { number } [value] Dice 类型中的骰子点数
 * @property { 'QQMusic'|'NeteaseCloudMusic'|'MiguMusic'|'KugouMusic'|'KuwoMusic' } [kind] MusicShare - 类型
 * @property { string } [title] MusicShare - 标题
 * @property { string } [summary] MusicShare - 概括
 * @property { string } [jumpUrl] MusicShare - 跳转路径
 * @property { string } [pictureUrl] MusicShare - 封面路径
 * @property { string } [musicUrl] MusicShare - 音源路径
 * @property { string } [brief] MusicShare - 简介
 * @property { string } [code] MiraiCode
 * @property { ForwardNodeList } [nodeList] ForwardMessage - 转发消息列表
 */
export type MessageChain = {
  type: ChainType,
  /**
   * Source 类型中的消息 id, 或Quote类型中引用的源消息的 id, 或文件 id
   */
  id?: number,
  /**
   * Source 类型中的时间戳
   */
  time?: number,
  /**
   * Quote 类型中源消息所在群的群号, 好友消息时为 0
   */
  groupId?: number,
  /**
   * Quote 类型中源消息发送者的 qq 号
   */
  senderId?: number,
  /**
   * Quote 类型中源消息的 MessageChain
   */
  origin?: MessageChain,
  /**
   * Plain 类型的文本
   */
  text?: string,
  /**
   * At 类型中 @ 目标的 qq 号
   */
  target?: number,
  /**
   * At 类型中 @ 目标的群名片
   */
  display?: string,
  /**
   * Face 类型中表情的编号
   */
  faceId?: number,
  /**
   * Image/FlashImage 类型中图片的 imageId
   */
  imageId?: string,
  /**
   * Image/FlashImage 类型中图片的宽度
   */
  width: number,
  /**
   * Image/FlashImage 类型中图片的高度
   */
  height: number,
  /**
   * Image/FlashImage 类型中图片是否为表情
   */
  isEmoji: boolean,
  /**
   * Image/FlashImage 类型中图片的大小 / File 类型中的 size
   */
  size?: number,
  /**
   * Voice 类型中语音的 voiceId
   */
  voiceId?: string,
  /**
   * Image/FlashImage/Voice 类型中图片的 url, 可用于下载图片和语音
   */
  url?: string,
  /**
   * Xml 类型中的 xml 字符串
   */
  xml?: string,
  /**
   * Json 类型中的 json 字符串
   */
  json?: string,
  /**
   * App 类型中的 app content 字符串
   */
  content?: string,
  /**
   * Poke/File 类型中的 name
   */
  name?: string,
  /**
   * Dice 类型中的骰子点数
   */
  value?: number,
  /**
   * MusicShare - 类型
   */
  kind?: 'QQMusic'|'NeteaseCloudMusic'|'MiguMusic'|'KugouMusic'|'KuwoMusic',
  /**
   * MusicShare - 标题
   */
  title?: string,
  /**
   * MusicShare - 概括
   */
  summary?: string,
  /**
   * MusicShare - 跳转路径
   */
  jumpUrl?: string,
  /**
   * MusicShare - 封面路径
   */
  pictureUrl?: string,
  /**
   * MusicShare - 音源路径
   */
  musicUrl?: string,
  /**
   * MusicShare - 简介
   */
  brief?: string,
  code?: string,
  /**
   * Forward - 消息列表
   */
  nodeList: ForwardNodeList,
}
/**
 * @callback replyFunction
 * @param { string | MessageChain[] } message 回复的消息
 * @returns { Promise<MessageResponse> }
 */
declare function replyFunction(message: string | MessageChain[]): Promise<MessageResponse>;
/**
 * @callback recallFunction
 * @param { string | MessageChain[] } message 回复的消息
 * @returns { Promise<httpApiResponse> }
 */
declare function recallFunction(message: string | MessageChain[]): Promise<httpApiResponse>;

/**
 * @typedef { Object } message 消息
 * @property { "FriendMessage"|"GroupMessage"|"TempMessage" } type 消息类型
 * @property { MessageChain[] } messageChain 消息链对象
 * @property { Sender } sender 发送者
 * @property { replyFunction } reply 快速回复消息
 * @property { replyFunction } quoteReply 快速引用回复消息
 * @property { recallFunction } recall 撤回此条消息
 */
export type message = {
  type: MessageType,
  messageChain: MessageChain[],
  sender: Friend | GroupSender,
  /**
   * 快速回复消息
   */
  reply: typeof replyFunction,
  /**
   * 快速引用回复消息
   */
  quoteReply: typeof replyFunction,
  /**
   * 撤回此条消息
   */
  recall: typeof recallFunction,
}

/**
 * @typedef { Object } UserInfo 用户资料
 * @property { string } nickname 用户名
 * @property { string } email 邮箱
 * @property { number } age 年龄
 * @property { number } level 等级
 * @property { string } sign 签名
 * @property { 'UNKNOWN' | 'MALE' | 'FEMALE' } sex 性别
 */
export type UserInfo = {
  nickname: string,
  email: string,
  age: number,
  level: number,
  sign: string,
  sex: UserSex,
}

// these seems not working well with tsc, just ignore its warning
// @ts-ignore
export type Buffer = import('buffer').Buffer
// @ts-ignore
export type ReadStream = import('fs').ReadStream
// @ts-ignore
export type WebSocket = import('ws')