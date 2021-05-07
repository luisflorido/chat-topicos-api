'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Pagination {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    const { size, page, filters } = request.get();
    request.pagination = {
      size: size || 10,
      page: page || 1,
      filters: JSON.parse(filters || null),
    };
    await next()
  }
}

module.exports = Pagination
