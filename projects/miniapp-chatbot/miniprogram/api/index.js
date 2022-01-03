

// API
const getMessages = () => {
  const app = getApp()
  return `${app.globalData.serverHostApi}/message/list234`
}

const getUserChats = () => {
  const app = getApp()
  return `${app.globalData.serverHostApi}/message/user-chats`
}

module.exports = {
  getMessages,
  getUserChats,
}
