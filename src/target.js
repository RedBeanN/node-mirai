const Friend = (qq) => ({
  type: 'FriendMessage',
  sender: {
    id: qq
  }
});

const Group = (groupId) => ({
  type: 'GroupMessage',
  sender: {
    group: {
      id: groupId
    }
  }
});

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
