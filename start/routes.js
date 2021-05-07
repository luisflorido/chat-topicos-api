'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.post('/login', 'UserController.login')
Route.post('/register', 'UserController.register')
Route.get('/user/:userName', 'UserController.findBy').middleware(['auth'])

Route.get('/chats', 'ChatController.index').middleware(['auth', 'pagination'])
Route.get('/chats/:id', 'ChatController.listMessages').middleware(['auth', 'pagination'])
Route.post('/chats/:id', 'ChatController.store').middleware(['auth'])