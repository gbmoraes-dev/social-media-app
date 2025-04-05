import { beforeEach, describe, expect, it } from 'vitest'

import { UsersInMemoryRepository } from '@/repositories/in-memory/users-in-memory.repository'

import { PostsInMemoryRepository } from '@/repositories/in-memory/posts-in-memory.repository'

import { CreatePostUseCase } from './create-post'

let userRepository: UsersInMemoryRepository
let createPostRepository: PostsInMemoryRepository
let sut: CreatePostUseCase

describe('Register Use Case', () => {
  beforeEach(async () => {
    userRepository = new UsersInMemoryRepository()
    createPostRepository = new PostsInMemoryRepository()
    sut = new CreatePostUseCase(createPostRepository, userRepository)

    await userRepository.create({
      id: 'a04jftqc19ejj5x8xdwvb68d',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: '123456',
    })
  })

  it('should be able to create a post', async () => {
    const { post } = await sut.execute({
      userId: 'a04jftqc19ejj5x8xdwvb68d',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    })

    expect(post.id).toEqual(expect.any(String))
  })
})
