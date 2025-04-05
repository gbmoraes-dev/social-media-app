import type { Post, PostInsert } from '@/db/schemas'

import type { PostsRepository } from '../posts.repositiory'

export class PostsInMemoryRepository implements PostsRepository {
  private posts: Post[] = []

  async create(data: PostInsert) {
    const post = {
      id: 'a04jfkqc09egj5x8gdwvb68d',
      userId: data.userId,
      content: data.content,
      createdAt: new Date(),
    }

    this.posts.push(post)

    return post
  }

  async findById(id: string) {
    const post = this.posts.find((post) => post.id === id)

    return post ?? null
  }

  async findByUserId(userId: string) {
    const posts = this.posts.filter((post) => post.userId === userId)

    return posts.length > 0 ? posts : null
  }
}
