'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Chat extends Model {
    from() {
        return this.belongsTo('App/Models/User', 'from_user_id', 'id')
    }

    to() {
        return this.belongsTo('App/Models/User', 'to_user_id', 'id')
    }
}

module.exports = Chat
