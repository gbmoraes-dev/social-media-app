import { UsersDrizzleRepository } from '@/repositories/drizzle/users-drizzle.repository'

import { PostsDrizzleRepository } from '@/repositories/drizzle/posts-drizzle.repository'

import { CreatePostUseCase } from '../create-post'

export function makeCreatePostUseCase() {
  const usersRepository = new UsersDrizzleRepository()
  const postsRepository = new PostsDrizzleRepository()
  const createPostUseCase = new CreatePostUseCase(
    postsRepository,
    usersRepository,
  )

  return createPostUseCase
}
