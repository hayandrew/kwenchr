export function mapDbEventToClient(dbEvent) {
  if (!dbEvent) return null

  // Return directly if already in client format
  if (dbEvent.occurrence && dbEvent.venue && dbEvent.title) {
    return dbEvent
  }

  return {
    id: dbEvent._id || dbEvent.mgid,
    mgid: dbEvent.mgid || dbEvent._id,
    active: true,
    title: dbEvent.name,
    short_desc: dbEvent.short_description || dbEvent.short_desc || '',
    long_desc: dbEvent.long_description || dbEvent.long_desc || '',
    occurrence: {
      start_time: dbEvent.start_time,
      end_time: dbEvent.end_time
    },
    price: dbEvent.price || {
      additional_cost: 0,
      min: 5,
      max: 15,
      currency: 'USD',
      prefix: '$'
    },
    rating: dbEvent.rating || '85',
    tags: dbEvent.tags || [],
    type_id: dbEvent.type_id || '',
    promoter_id: dbEvent.promoter_id || '',
    image: {
      url: dbEvent.image_url || (dbEvent.image && dbEvent.image.url) || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop'
    },
    venue: {
      places_id: dbEvent.places_id,
      name: dbEvent.venue_name || (dbEvent.venue && dbEvent.venue.name) || 'Local Venue',
      address: dbEvent.venue_address || (dbEvent.venue && dbEvent.venue.address) || 'Local Address',
      city: 'Hoboken',
      state: 'NJ',
      location: dbEvent.venue_location || (dbEvent.venue && dbEvent.venue.location) || '40.7796,-74.0238'
    }
  }
}
