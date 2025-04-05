import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { makeCreatePostUseCase } from '../use-cases/factories/make-create-post.usecase'

import { ResourceNotFoundError } from '../use-cases/errors/resource-not-found-error'

export async function createPost(request: FastifyRequest, reply: FastifyReply) {
  const createPostBodySchema = z.object({
    content: z.string(),
  })

  const { content } = createPostBodySchema.parse(request.body)

  try {
    const createPostUseCase = makeCreatePostUseCase()

    await createPostUseCase.execute({
      userId: request.user.sub,
      content,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
