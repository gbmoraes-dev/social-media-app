import { eq } from 'drizzle-orm'

import { createId } from '@paralleldrive/cuid2'

import { db } from '@/db'

import { type UserInsert, users, type User } from '@/db/schemas'

import type { UsersRepository } from '../users.repository'

export class UsersDrizzleRepository implements UsersRepository {
  async create(data: UserInsert): Promise<User> {
    const [user] = await db.insert(users).values({
      ...data,
      emailVerificationToken: createId(),
    })

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email))

    return user ?? null
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))

    return user ?? null
  }
}
