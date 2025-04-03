import type { FastifyInstance } from 'fastify'

import { register } from './register.controller'

import { authenticate } from './authenticate.controller'

import { refresh } from './refresh.controller'

export async function routes(app: FastifyInstance) {
  /* users routes */
  app.post('/register', register)
  app.post('/authenticate', authenticate)
  app.patch('/token/refresh', refresh)
}
