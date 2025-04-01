import type { FastifyInstance } from 'fastify'

import { register } from './register.controller'

export async function routes(app: FastifyInstance) {
  /* users routes */
  app.post('/register', register)
}
