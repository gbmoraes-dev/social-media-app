import * as bcryptjs from 'bcryptjs'

import type { User } from '@/db/schemas'

import type { UsersRepository } from '@/repositories/users.repository'

import { EmailAlreadyExistsError } from './errors/email-already-exists'

import { UsernameAlreadyExistsError } from './errors/username-already-exists'

interface RegisterUseCaseRequest {
  firstName?: string
  lastName?: string
  bio?: string
  username: string
  email: string
  passwordHash: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    firstName,
    lastName,
    bio,
    username,
    email,
    passwordHash,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const usernameAlreadyExists =
      await this.usersRepository.findByUsername(username)

    if (usernameAlreadyExists) {
      throw new UsernameAlreadyExistsError()
    }

    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const hashedPassword = await bcryptjs.hash(passwordHash, 6)

    const user = await this.usersRepository.create({
      firstName,
      lastName,
      bio,
      username,
      email,
      passwordHash: hashedPassword,
    })

    return { user }
  }
}
