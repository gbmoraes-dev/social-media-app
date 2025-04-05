import type { User, UserInsert } from '@/db/schemas'

export interface UsersRepository {
  create(data: UserInsert): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
}
