'use strict'


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Chat = use('App/Models/Chat')
const User = use('App/Models/User')
const Message = use('App/Models/Message')
/**
 * Resourceful controller for interacting with chats
 */
class ChatController {
  /**
   * Show a list of all chats.
   * GET chats
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    const { page, size } = request.pagination;
    const user = auth.user;

    const chats = await Chat.query()
      .where('from_user_id', user.id)
      .orWhere('to_user_id', user.id)
      .with('to')
      .with('from')
      .with('messages', builder => {
        builder.orderBy("messages.created_at", "desc").limit(1);
      })
      .paginate(page, size)

    return response.ok(chats)
  }

  async listMessages ({ request, response, view, auth }) {
    const { page, size } = request.pagination;
    const { user } = auth;
    const { id } = request.params;

    const findChat = await Chat.query()
      .where(builder => {
        builder.where('from_user_id', user.id)
          .orWhere('to_user_id', user.id)
      })
      .where('id', id)
      .first()
    

    if (!findChat) {
      return response.notFound({ message: "Chat não encontrado." })
    }

    const messages = await Message.query()
      .where('chat_id', id)
      .orderBy('created_at', 'desc')
      .paginate(page, size)

    return response.ok(messages)
  }

  /**
   * Create/save a new chat.
   * POST chats
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const { user } = auth
      const { id } = request.params;
  
      const findUserTo = await User.findBy("username", id);
      if (!findUserTo) {
        return response.badRequest({ message: "Usuário não encontrado." })
      }
  
      const findChat = await Chat.query()
        .where('from_user_id', user.id)
        .where('to_user_id', user.id)
        .first();

      if (findChat) {
        return response.badRequest({ message: "Já existe um chat com este usuário" })
      }

      const chat = await Chat.create({
        from_user_id: user.id,
        to_user_id: findUserTo.id
      })
  
      return response.ok(chat);
    } catch (e) {
      console.log(e)
      return response.internalServerError({message: "Erro interno"});
    }
  }

  /**
   * Display a single chat.
   * GET chats/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update chat details.
   * PUT or PATCH chats/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a chat with id.
   * DELETE chats/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ChatController
