/**
 * @typedef { Object } Sender
 * @property { number } [id]
 * @property { Object } [group]
 * @property { number } [group.id]
 * 
 * @typedef { Object } FriendTarget
 * @property { 'FriendMessage' } type
 * @property { Object } sender
 * @property { number } sender.id
 * 
 * @typedef { Object } GroupTarget
 * @property { 'GroupMessage' } type
 * @property { Object } sender
 * @property { Object } sender.group
 * @property { number } sender.group.id
 * 
 * @typedef { Object } TempTarget
 * @property { 'TempMessage' } type
 * @property { number } id
 * @property { Object } sender
 * @property { Object } sender.group
 * @property { number } sender.group.id
 * 
 * @typedef { FriendTarget | GroupTarget | TempTarget } MessageTarget
 */

/**
 * @function Friend
 * @param { number } qq
 * @returns { FriendTarget }
 */
const Friend = (qq) => ({
  type: 'FriendMessage',
  sender: {
    id: qq
  }
});

/**
 * @function Group
 * @param { number } groupId
 * @returns { GroupTarget }
 */
const Group = (groupId) => ({
  type: 'GroupMessage',
  sender: {
    group: {
      id: groupId
    }
  }
});

/**
 * @function Temp
 * @param { number } groupId
 * @param { number } qq
 * @returns { TempTarget }
 */
const Temp = (groupId, qq) => ({
  type: 'TempMessage',
  sender: {
    id: qq,
    group: {
      id: groupId
    }
  }
});

module.exports = {
  Friend,
  Group,
  Temp
};
