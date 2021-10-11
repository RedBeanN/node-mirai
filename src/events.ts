import { Permission, GroupPermissionInfo, GroupMember, MessageChain, MessageType, message, httpApiResponse } from "./typedef"

export enum events {
  online = "online",
  offlineActive = "offlineActive",
  offlineForce = "offlineForce",
  offlineDropped = "offlineDropped",
  relogin = "relogin",
  groupPermissionChange = "groupPermissionChange",
  mute = "mute",
  unmute = "unmute",
  leaveActive = "leaveActive",
  leaveKick = "leaveKick",
  joinGroup = "joinGroup",
  invitedJoinGroupRequest = "invitedJoinGroupRequest",
  groupNameChange = "groupNameChange",
  groupEntranceAnnouncementChange = "groupEntranceAnnouncementChange",
  groupMuteAll = "groupMuteAll",
  groupAllowAnonymousChat = "groupAllowAnonymousChat",
  groupAllowConfessTalk = "groupAllowConfessTalk",
  groupAllowMemberInvite = "groupAllowMemberInvite",
  groupRecall = "groupRecall",
  friendRecall = "friendRecall",
  friendNickChanged = "friendNickChanged",
  friendInputStatusChanged = "friendInputStatusChanged",
  memberJoin = "memberJoin",
  memberLeaveKick = "memberLeaveKick",
  memberLeaveQuit = "memberLeaveQuit",
  memberCardChange = "memberCardChange",
  memberSpecialTitleChange = "memberSpecialTitleChange",
  memberPermissionChange = "memberPermissionChange",
  memberMute = "memberMute",
  memberUnmute = "memberUnmute",
  memberHonorChange = "memberHonorChange",
  memberJoinRequest = "memberJoinRequest",
  newFriendRequest = "newFriendRequest",
  nudge = "nudge",
  otherClientOnline = "otherClientOnline",
  otherClientOffline = "otherClientOffline",
  commandExecuted = "commandExecuted",
}

interface online {
  type: 'BotOnlineEvent',
  qq: number,
}
interface offlineActive {
  type: 'BotOfflineEventActive',
  qq: number,
}
interface offlineForce {
  type: 'BotOfflineEventForce',
  qq: number,
}
interface offlineDropped {
  type: 'BotOfflineEventDropped',
  qq: number,
}
interface relogin {
  type: 'BotReloginEvent',
  qq: number,
}

interface Friend {
  id: number,
  nickname: string,
  remark: string,
}
interface friendInputStatusChanged {
  type: 'FriendInputStatusChangedEvent',
  friend: Friend,
  inputting: boolean,
}
interface friendNickChanged {
  type: 'FriendNickChangedEvent',
  friend: Friend,
  from: string,
  to: string,
}

interface MemberWithPermission extends GroupMember {
  group: GroupPermissionInfo,
}
interface groupPermissionChange {
  type: 'BotGroupPermissionChangeEvent',
  origin: Permission,
  current: Permission,
  group: GroupPermissionInfo,
}
interface mute {
  type: 'BotMuteEvent',
  durationSeconds: number,
  operator: MemberWithPermission,
}
interface unmute {
  type: 'BotUnmuteEvent',
  operator: MemberWithPermission,
}
interface groupMuteAll {
  type: 'GroupMuteAllEvent',
  origin: boolean,
  current: boolean,
  group: GroupPermissionInfo,
  operator: MemberWithPermission,
}
interface joinGroup {
  type: 'BotJoinGroupEvent',
  group: GroupPermissionInfo,
  invitor?: GroupMember | null,
}
interface leaveActive {
  type: 'BotLeaveEventActive',
  group: GroupPermissionInfo,
}
interface leaveKick {
  type: 'BotLeaveEventKick',
  group: GroupPermissionInfo,
  operator: MemberWithPermission,
}
interface groupNameChange {
  type: 'GroupNameChangeEvent',
  origin: string,
  current: string,
  group: GroupPermissionInfo,
  operator: MemberWithPermission,
}
interface groupEntranceAnnouncementChange {
  type: 'GroupEntranceAnnouncementChangeEvent',
  origin: string,
  current: string,
  group: GroupPermissionInfo,
  operator: MemberWithPermission
}
interface groupRecall {
  type: 'GroupRecallEvent',
  authorId: number,
  messageId: number,
  time: number,
  group: GroupPermissionInfo,
  operator: MemberWithPermission,
}
interface friendRecall {
  type: 'FriendRecallEvent',
  authorId: number,
  messageId: number,
  time: number,
  operator: number,
}
interface groupAllowAnonymousChat {
  type: 'GroupAllowAnonymousChatEvent',
  origin: boolean,
  current: boolean,
  group: GroupPermissionInfo,
  operator: MemberWithPermission,
}
interface groupAllowConfessTalk {
  type: 'GroupAllowConfessTalkEvent',
  origin: boolean,
  current: boolean,
  group: GroupPermissionInfo,
  isByBot: boolean,
}
interface groupAllowMemberInvite {
  type: 'GroupAllowMemberInviteEvent',
  origin: boolean,
  current: boolean,
  group: GroupPermissionInfo,
  operator: MemberWithPermission,
}
interface memberJoin {
  type: 'MemberJoinEvent',
  member: MemberWithPermission,
  invitor: GroupMember | null,
}
interface memberLeaveKick {
  type: 'MemberLeaveEventKick',
  member: MemberWithPermission,
  operator: MemberWithPermission,
}
interface memberLeaveQuit {
  type: 'MemberLeaveEventQuit',
  member: MemberWithPermission,
}
interface memberCardChange {
  type: 'MemberCardChangeEvent',
  origin: string,
  current: string,
  member: MemberWithPermission,
}
interface memberSpecialTitleChange {
  type: 'MemberSpecialTitleChangeEvent',
  origin: string,
  current: string,
  member: MemberWithPermission,
}
interface memberPermissionChange {
  type: 'MemberPermissionChangeEvent',
  origin: Permission,
  current: Permission,
  member: MemberWithPermission,
}
interface memberMute {
  type: 'MemberMuteEvent',
  durationSeconds: number,
  member: MemberWithPermission,
  operator: MemberWithPermission,
}
interface memberUnmute {
  type: 'MemberUnmuteEvent',
  member: MemberWithPermission,
  operator: MemberWithPermission,
}
interface memberHonorChange {
  type: 'MemberHonorChangeEvent',
  action: 'achieve' | 'lose',
  honor: string,
  member: MemberWithPermission,
}

interface newFriendRequest {
  type: 'NewFriendRequestEvent',
  eventId: number,
  fromId: number,
  groupId: number,
  nick: string,
  message: string,
  /**
   * 接受好友申请
   */
  accept: (msg?: string) => Promise<httpApiResponse>,
  /**
   * 拒绝好友申请
   */
  reject: (msg?: string) => Promise<httpApiResponse>,
  /**
   * 拒绝并拉黑, 不再接收该用户的好友申请
   */
  rejectAndBlock: (msg?: string) => Promise<httpApiResponse>,
}
interface memberJoinRequest {
  type: 'MemberJoinRequestEvent',
  eventId: number,
  fromId: number,
  groupId: number,
  groupName: string,
  nick: string,
  message: string,
  /**
   * 接受加群申请
   */
  accept: (msg?: string) => Promise<httpApiResponse>,
  /**
   * 拒绝加群申请
   */
  reject: (msg?: string) => Promise<httpApiResponse>,
  /**
   * 忽略加群申请
   */
  ignore: (msg?: string) => Promise<httpApiResponse>,
  /**
   * 拒绝并拉黑
   */
  rejectAndBlock: (msg?: string) => Promise<httpApiResponse>,
  /**
   * 忽略并拉黑
   */
  ignoreAndBlock: (msg?: string) => Promise<httpApiResponse>,
}
interface invitedJoinGroupRequest {
  type: 'BotInvitedJoinGroupRequestEvent',
  eventId: number,
  fromId: number,
  groupId: number,
  groupName: string,
  nick: string,
  message: string,
  /**
   * 接受邀请
   */
  accept: (msg?: string) => Promise<httpApiResponse>,
  /**
   * 拒绝邀请
   */
  reject: (msg?: string) => Promise<httpApiResponse>,
}
interface otherClientOnline {
  type: 'OtherClientOnlineEvent',
  client: {
    id: number,
    platform: string,
  },
  kind: number,
}
interface otherClientOffline {
  type: 'OtherClientOfflineEvent',
  client: {
    id: number,
    platform: string,
  },
}

interface nudge {
  type: 'NudgeEvent',
  fromId: number,
  subject: {
    id: number,
    kind: 'Friend' | 'Group',
  },
  action: string,
  suffix: string,
  target: number,
}

interface commandExecuted {
  type: 'CommandExecutedEvent',
  name: string,
  friend: Friend | null,
  member: GroupMember | null,
  args: Array<MessageChain>,
}

export interface EventMap {
  online: online,
  offlineActive: offlineActive,
  offlineForce: offlineForce,
  offlineDropped: offlineDropped,
  relogin: relogin,
  groupPermissionChange: groupPermissionChange,
  mute: mute,
  unmute: unmute,
  leaveActive: leaveActive,
  leaveKick: leaveKick,
  joinGroup: joinGroup,
  invitedJoinGroupRequest: invitedJoinGroupRequest,
  groupNameChange: groupNameChange,
  groupEntranceAnnouncementChange: groupEntranceAnnouncementChange,
  groupMuteAll: groupMuteAll,
  groupAllowAnonymousChat: groupAllowAnonymousChat,
  groupAllowConfessTalk: groupAllowConfessTalk,
  groupAllowMemberInvite: groupAllowMemberInvite,
  groupRecall: groupRecall,
  friendRecall: friendRecall,
  friendNickChanged: friendNickChanged,
  friendInputStatusChanged: friendInputStatusChanged,
  memberJoin: memberJoin,
  memberLeaveKick: memberLeaveKick,
  memberLeaveQuit: memberLeaveQuit,
  memberCardChange: memberCardChange,
  memberSpecialTitleChange: memberSpecialTitleChange,
  memberPermissionChange: memberPermissionChange,
  memberMute: memberMute,
  memberUnmute: memberUnmute,
  memberHonorChange: memberHonorChange,
  memberJoinRequest: memberJoinRequest,
  newFriendRequest: newFriendRequest,
  nudge: nudge,
  otherClientOnline: otherClientOnline,
  otherClientOffline: otherClientOffline,
  commandExecuted: commandExecuted,
}

export interface AllEventMap extends EventMap {
  message: message,
  authed: void,
  verified: void,
  released: void,
}