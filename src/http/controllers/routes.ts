import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '../middlewares/verify-jwt'

import { register } from './register.controller'

import { authenticate } from './authenticate.controller'

import { refresh } from './refresh.controller'

import { createPost } from './create-post.controller'

export async function routes(app: FastifyInstance) {
  /* users routes */
  app.post('/register', register)
  app.post('/authenticate', authenticate)
  app.patch('/token/refresh', refresh)

  /* posts routes */
  app.post('/posts', { onRequest: [verifyJwt] }, createPost)
}
