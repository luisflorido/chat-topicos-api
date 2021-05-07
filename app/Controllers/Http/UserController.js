'use strict'
const User = use('App/Models/User')

class UserController {
    async login({request, response, auth}) {
        const { username, password } = request.all();
        const token = await auth.withRefreshToken().attempt(username, password);

        return response.ok(token)
    }

    async findBy({request, response, auth}) {
        const { userName } = request.params;
        const findUser = await User.findBy("username", userName)

        if (!findUser) {
            return response.notFound({ message: "Usuário não encontrado." })
        }

        return response.ok(findUser)
    }

    async register({request, response}) {
        const { username, name, password } = request.all();
        const findUser = await User.findBy("username", username)
        if (findUser) {
            return response.badRequest({message: "Usuário já cadastrado"})
        }
        const user = await User.create({name, username, password})

        return response.ok(user)
    }
}

module.exports = UserController
