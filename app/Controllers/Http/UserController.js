'use strict'
const User = use('App/Models/User')

class UserController {
    async login({request, response, auth}) {
        try {
            const { username, password, refresh_token } = request.all();
            if (refresh_token) {
                const token = await auth
                    .newRefreshToken()
                    .generateForRefreshToken(refresh_token);
    
                const { uid } = await auth
                    .authenticator("jwt")
                    ._verifyToken(token.token);
    
                const user = await User.find(uid);
                return {...token, user}
            }
            const token = await auth.withRefreshToken().attempt(username, password);
    
            const user = await User.findBy("username", username);
            return response.ok({...token, user})
        } catch (e) {
            return response.internalServerError({ message: "Erro ao efetuar login."})
        }
    }

    async findBy({request, response, auth}) {
        const { userName } = request.params;
        const findUser = await User.findBy("username", userName)

        if (!findUser) {
            return response.notFound({ message: "Usuário não encontrado." })
        }

        return response.ok(findUser)
    }

    async update({request, response, auth}) {
        const { user } = auth;

        user.merge(request.all());
        await user.save()

        return response.ok(user)
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
