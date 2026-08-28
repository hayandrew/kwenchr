import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/kwenchr'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise

    // Auto-seed if the database is empty (important for Vercel production deployments)
    const Events = mongoose.models.Events || (await import('../models/Event')).default
    const User = mongoose.models.User || (await import('../models/User')).default

    const eventCount = await Events.countDocuments()
    if (eventCount === 0) {
      console.log('Production database is empty. Auto-seeding initial data...')
      
      const { dummyUsers, dummyEvents } = await import('./seedData')
      
      const seededUsers = await User.insertMany(dummyUsers)
      const eventsToInsert = dummyEvents.map((evt, idx) => {
        const userIndex = idx % seededUsers.length
        return {
          ...evt,
          promoter_id: seededUsers[userIndex]._id.toString()
        }
      })
      
      await Events.insertMany(eventsToInsert)
      console.log(`Auto-seeding successful: created ${seededUsers.length} users and ${eventsToInsert.length} events.`)
    }
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
