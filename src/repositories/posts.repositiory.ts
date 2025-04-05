import type { Post, PostInsert } from '@/db/schemas'

export interface PostsRepository {
  create(data: PostInsert): Promise<Post>
  findById(id: string): Promise<Post | null>
  findByUserId(userId: string): Promise<Post[] | null>
}
