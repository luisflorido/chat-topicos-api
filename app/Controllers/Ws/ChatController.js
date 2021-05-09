'use strict'
const Message = use('App/Models/Message')

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onMessage (message) {
    try {
      const chatId = this.socket.topic.match(/\d+/)[0]
  
      await Message.create({
        chat_id: chatId,
        user_id: message.user._id,
        text: message.text
      })
      this.socket.broadcastToAll('message', message)
    } catch (e) {
      console.log('ERRO', e)
    }
  }
}

module.exports = ChatController
