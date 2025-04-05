import { eq } from 'drizzle-orm'

import { db } from '@/db'

import { type PostInsert, type Post, posts } from '@/db/schemas'

import type { PostsRepository } from '../posts.repositiory'

export class PostsDrizzleRepository implements PostsRepository {
  async create(data: PostInsert): Promise<Post> {
    const [post] = await db.insert(posts).values({
      ...data,
    })

    return post
  }

  async findById(id: string): Promise<Post | null> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id))

    return post ?? null
  }

  async findByUserId(userId: string): Promise<Post[] | null> {
    const postsList = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))

    return postsList ?? null
  }
}
