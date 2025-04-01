import { db } from '.'

import chalk from 'chalk'

import { faker } from '@faker-js/faker'

import { createId } from '@paralleldrive/cuid2'

import {
  comments,
  follows,
  likes,
  notifications,
  posts,
  users,
} from './schemas'

const usersToInsert: (typeof users.$inferInsert)[] = []

const postsToInsert: (typeof posts.$inferInsert)[] = []

const commentsToInsert: (typeof comments.$inferInsert)[] = []

const likesToInsert: (typeof likes.$inferInsert)[] = []

const followsToInsert: (typeof follows.$inferInsert)[] = []

const notificationsToInsert: (typeof notifications.$inferInsert)[] = []

await db.delete(users)
await db.delete(posts)
await db.delete(comments)
await db.delete(likes)
await db.delete(follows)
await db.delete(notifications)

console.log(chalk.redBright('✔ Database reseted succesfully!\n'))

console.log(chalk.cyanBright('Start seeding database...\n'))

for (let i = 0; i < 10; i++) {
  const id = createId()

  usersToInsert.push({
    id: id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    bio: faker.lorem.paragraph(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    emailVerificationToken: faker.string.uuid(),
  })
}

await db.insert(users).values(usersToInsert)

console.log(chalk.greenBright('✔ Users created succesfully!'))

const userIds = usersToInsert.map((user) => user.id)

for (let i = 0; i < 100; i++) {
  const id = createId()

  postsToInsert.push({
    id: id,
    userId: faker.helpers.arrayElement(userIds) as string,
    content: faker.lorem.paragraph(),
  })
}

await db.insert(posts).values(postsToInsert)

console.log(chalk.greenBright('✔ Posts created succesfully!'))

const postIds = postsToInsert.map((post) => post.id)

for (let i = 0; i < 500; i++) {
  const id = createId()

  commentsToInsert.push({
    id: id,
    userId: faker.helpers.arrayElement(userIds) as string,
    postId: faker.helpers.arrayElement(postIds) as string,
    content: faker.lorem.paragraph(),
  })
}

await db.insert(comments).values(commentsToInsert)

console.log(chalk.greenBright('✔ Comments created succesfully!'))

const uniqueLikes = new Set<string>()

const commentIds = commentsToInsert.map((comment) => comment.id)

for (let i = 0; i < 1000; i++) {
  const userId = faker.helpers.arrayElement(userIds) as string

  const type = faker.helpers.arrayElement(['post', 'comment']) as
    | 'post'
    | 'comment'

  const likeableId =
    type === 'post'
      ? (faker.helpers.arrayElement(postIds) as string)
      : (faker.helpers.arrayElement(commentIds) as string)

  const key = `${userId}-${likeableId}-${type}`

  if (!uniqueLikes.has(key)) {
    uniqueLikes.add(key)

    likesToInsert.push({
      id: createId(),
      userId,
      likeableId,
      type,
    })
  }
}

await db.insert(likes).values(likesToInsert)

console.log(chalk.greenBright('✔ Likes created succesfully!'))

const uniqueFollows = new Set<string>()

for (let i = 0; i < 100; i++) {
  const followerId = faker.helpers.arrayElement(userIds) as string

  const followingId = faker.helpers.arrayElement(userIds) as string

  const key = `${followerId}-${followingId}`

  if (!uniqueFollows.has(key) && followerId !== followingId) {
    uniqueFollows.add(key)

    followsToInsert.push({
      id: createId(),
      followerId,
      followingId,
    })
  }
}

await db.insert(follows).values(followsToInsert)

console.log(chalk.greenBright('✔ Follows created succesfully!'))

const uniqueNotifications = new Set<string>()

const likesIds = likesToInsert.map((likes) => likes.id)

const followsIds = followsToInsert.map((follows) => follows.id)

const userMap = new Map(usersToInsert.map((user) => [user.id, user.username]))

for (let i = 0; i < 333; i++) {
  const actorId = faker.helpers.arrayElement(userIds) as string

  const userId = faker.helpers.arrayElement(
    userIds.filter((id) => id !== actorId),
  ) as string

  if (likesIds.length === 0) continue

  const referenceId = faker.helpers.arrayElement(likesIds) as string

  const content = `${userMap.get(actorId)} liked your post.`

  const key = `${userId}-${referenceId}-like`

  if (!uniqueNotifications.has(key)) {
    uniqueNotifications.add(key)

    notificationsToInsert.push({
      id: createId(),
      userId,
      actorId,
      referenceId,
      type: 'like',
      content,
    })
  }
}

for (let i = 0; i < 333; i++) {
  const actorId = faker.helpers.arrayElement(userIds) as string

  const userId = faker.helpers.arrayElement(
    userIds.filter((id) => id !== actorId),
  ) as string

  if (commentIds.length === 0) continue

  const referenceId = faker.helpers.arrayElement(commentIds) as string

  const content = `${userMap.get(actorId)} commented on your post.`

  const key = `${userId}-${referenceId}-comment`

  if (!uniqueNotifications.has(key)) {
    uniqueNotifications.add(key)

    notificationsToInsert.push({
      id: createId(),
      userId,
      actorId,
      referenceId,
      type: 'comment',
      content,
    })
  }
}

for (let i = 0; i < 333; i++) {
  const actorId = faker.helpers.arrayElement(userIds) as string

  const userId = faker.helpers.arrayElement(
    userIds.filter((id) => id !== actorId),
  ) as string

  if (userId === actorId) continue

  const referenceId = faker.helpers.arrayElement(followsIds) as string

  const content = `${userMap.get(actorId)} started following you.`

  const key = `${userId}-${referenceId}-follow`
  if (!uniqueNotifications.has(key)) {
    uniqueNotifications.add(key)

    notificationsToInsert.push({
      id: createId(),
      userId,
      actorId,
      referenceId,
      type: 'follow',
      content,
    })
  }
}

await db.insert(notifications).values(notificationsToInsert)

console.log(chalk.greenBright('✔ Notifications created succesfully!'))
