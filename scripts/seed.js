const mongoose = require('mongoose')
const { dummyUsers, dummyEvents } = require('../src/lib/seedData')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/kwenchr'

// Define schemas locally to keep the script self-contained and run cleanly in Node environment
const EventsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  start_time: { type: Date, default: Date.now, required: true },
  end_time: { type: Date, default: Date.now, required: true },
  places_id: { type: String, required: true },
  short_description: { type: String, required: true },
  long_description: { type: String, required: true },
  venue_name: { type: String },
  venue_address: { type: String },
  venue_location: { type: String },
  image_url: { type: String },
  tags: { type: [String], default: [] },
  type_id: { type: String },
  promoter_id: { type: String },
  Created_date: { type: Date, default: Date.now }
})

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true },
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  passwordConf: { type: String, required: true }
})

const Events = mongoose.models.Events || mongoose.model('Events', EventsSchema)
const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function seed() {
  console.log('Connecting to database:', MONGODB_URI)
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected!')

    console.log('Clearing existing records...')
    await Events.deleteMany({})
    await User.deleteMany({})
    console.log('Collections cleared.')

    console.log('Inserting dummy users...')
    const seededUsers = await User.insertMany(dummyUsers)
    console.log(`Successfully created ${seededUsers.length} users.`)

    // Connect each event dynamically to one of the 5 user accounts
    const eventsToInsert = dummyEvents.map((evt, idx) => {
      const userIndex = idx % seededUsers.length
      return {
        ...evt,
        promoter_id: seededUsers[userIndex]._id.toString()
      }
    })

    console.log('Inserting dummy drink special events...')
    await Events.insertMany(eventsToInsert)
    console.log(`Successfully created ${eventsToInsert.length} specials.`)

    console.log('Database seeded successfully! Connection closed.')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await mongoose.connection.close()
  }
}

seed()
