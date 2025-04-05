import type { UserInsert, User } from '@/db/schemas'

import type { UsersRepository } from '../users.repository'

export class UsersInMemoryRepository implements UsersRepository {
  private users: User[] = []

  async create(data: UserInsert) {
    const user = {
      id: 'a04jftqc19ejj5x8xdwvb68d',
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      bio: data.bio ?? '',
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      emailIsVerified: false,
      emailVerificationToken: '397515',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id)

    return user ?? null
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    return user ?? null
  }

  async findByUsername(username: string) {
    const user = this.users.find((user) => user.username === username)

    return user ?? null
  }
}
