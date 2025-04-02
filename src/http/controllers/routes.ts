import type { FastifyInstance } from 'fastify'

import { register } from './register.controller'

import { authenticate } from './authenticate.controller'

export async function routes(app: FastifyInstance) {
  /* users routes */
  app.post('/register', register)
  app.post('/authenticate', authenticate)
}
