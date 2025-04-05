import type { Post } from '@/db/schemas'

import type { PostsRepository } from '@/repositories/posts.repositiory'

import type { UsersRepository } from '@/repositories/users.repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreatePostUseCaseRequest {
  userId: string
  content: string
}

interface CreatePostUseCaseResponse {
  post: Post
}

export class CreatePostUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    content,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const user = this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const post = await this.postsRepository.create({
      userId: userId,
      content,
    })

    return { post }
  }
}
