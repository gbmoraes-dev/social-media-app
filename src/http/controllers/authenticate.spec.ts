import request from 'supertest'

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { sql } from 'drizzle-orm'

import { app } from '@/app'

import { db } from '@/db'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await db.execute(sql`BEGIN`)
  })

  afterEach(async () => {
    await db.execute(sql`ROLLBACK`)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: '123456',
    })

    const response = await request(app.server).post('/authenticate').send({
      username: 'johndoe',
      password: '123456',
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong username', async () => {
    await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: '123456',
    })

    const response = await request(app.server).post('/authenticate').send({
      username: 'wrongusername',
      password: '123456',
    })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: 'Invalid credentials.' })
  })

  it('should not be able to authenticate with wrong password', async () => {
    await request(app.server).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      username: 'johndoe',
      email: 'johndoe@test.com',
      passwordHash: '123456',
    })

    const response = await request(app.server).post('/authenticate').send({
      username: 'johndoe',
      password: 'wrongpassword',
    })

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ message: 'Invalid credentials.' })
  })
})
