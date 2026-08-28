import mongoose from 'mongoose'

const Schema = mongoose.Schema

const EventsSchema = new Schema({
  name: {
    type: String,
    required: 'Missing required "name"'
  },
  start_time: {
    type: Date,
    default: Date.now,
    required: 'Missing required "start_time"'
  },
  end_time: {
    type: Date,
    default: Date.now,
    required: 'Missing required "end_time"'
  },
  places_id: {
    type: String,
    required: 'Missing required "places_id"'
  },
  short_description: {
    type: String,
    required: 'Missing required "short_description"'
  },
  long_description: {
    type: String,
    required: 'Missing required "long_description"'
  },
  venue_name: {
    type: String
  },
  venue_address: {
    type: String
  },
  venue_location: {
    type: String
  },
  image_url: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  type_id: {
    type: String
  },
  promoter_id: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Events || mongoose.model('Events', EventsSchema)
