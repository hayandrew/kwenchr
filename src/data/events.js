const data = [
  {
    id: 1,
    active: true,
    mgid: '953844a8-a150-439c-9f60-8ecd57aa4353',
    type_id: '0eefd8f0-2497-46eb-8a7b-e94c449bd207',
    promoter_id: 'c97d0d78-eea4-49fe-8212-366ae006ce13',
    tags: ['cocktails', 'tacos'],
    title: 'Margarita Madness Monday',
    short_desc: '2-for-1 Margaritas and $3 Taco specials!',
    long_desc: 'Join us for our weekly Margarita Madness! Enjoy 2-for-1 Margaritas (classic, strawberry, or spicy mango) at the bar. We also have $3 beef, chicken, and veggie tacos all evening.',
    rating: '88',
    occurrence: {
      start_time: '2018-03-03T16:00:00.000Z',
      end_time: '2018-03-03T19:00:00.000Z'
    },
    price: {
      additional_cost: 0,
      min: 3,
      max: 12,
      currency: 'USD',
      prefix: '$',
      suffix: ''
    },
    image: {
      id: '907e5bc3-5821-487f-a740-fbac566b0e4c',
      width: 1920,
      height: 1080,
      url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop'
    },
    venue: {
      places_id: 'ChIJr-p86J7ZwokR8Yn2h6eU85E',
      name: 'Madd Hatter',
      address: '221 Washington St',
      zipcode: '07030',
      state: 'NJ',
      city: 'Hoboken',
      location: '40.7414,-74.0301',
      image: {
        id: '907e5bc3-5821-487f-a740-fbac566b0e4d',
        width: 1920,
        height: 1080,
        url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop'
      },
      id: '1'
    }
  },
  {
    id: 2,
    active: true,
    mgid: '953844a8-a150-439c-9f60-8ecd57aa4354',
    type_id: '0eefd8f0-2497-46eb-8a7b-e94c449bd207',
    promoter_id: 'c97d0d78-eea4-49fe-8212-366ae006ce13',
    tags: ['wine', 'drafts'],
    title: 'Wine Down Wednesday',
    short_desc: 'Half-off all bottles of wine and select drafts.',
    long_desc: 'Unwind in our cozy lounge with 50% off all wine bottles. Select local drafts are also on tap for just $4. Bring your friends and split a bottle!',
    rating: '95',
    occurrence: {
      start_time: '2018-03-03T17:00:00.000Z',
      end_time: '2018-03-03T21:00:00.000Z'
    },
    price: {
      additional_cost: 0,
      min: 4,
      max: 25,
      currency: 'USD',
      prefix: '$',
      suffix: ''
    },
    image: {
      id: '907e5bc3-5821-487f-a740-fbac566b0e4e',
      width: 1920,
      height: 1080,
      url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop'
    },
    venue: {
      places_id: 'ChIJt0V_n1rXw4kR4uG3c-6xSyc',
      name: 'The Madison Bar & Grill',
      address: '1316 Washington St',
      zipcode: '07030',
      state: 'NJ',
      city: 'Hoboken',
      location: '40.7533,-74.0253',
      image: {
        id: '907e5bc3-5821-487f-a740-fbac566b0e4f',
        width: 1920,
        height: 1080,
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop'
      },
      id: '2'
    }
  },
  {
    id: 3,
    active: true,
    mgid: '953844a8-a150-439c-9f60-8ecd57aa4355',
    type_id: '0eefd8f0-2497-46eb-8a7b-e94c449bd207',
    promoter_id: 'c97d0d78-eea4-49fe-8212-366ae006ce13',
    tags: ['beer', 'music'],
    title: 'Friday Sunset Beer Garden',
    short_desc: '$5 IPA pints and live acoustic set.',
    long_desc: 'Celebrate the weekend with $5 IPAs, stouts, and pilsners in our outdoor beer garden. A live acoustic music set starts at 6 PM!',
    rating: '92',
    occurrence: {
      start_time: '2018-03-03T16:00:00.000Z',
      end_time: '2018-03-03T20:00:00.000Z'
    },
    price: {
      additional_cost: 0,
      min: 5,
      max: 5,
      currency: 'USD',
      prefix: '$',
      suffix: ''
    },
    image: {
      id: '907e5bc3-5821-487f-a740-fbac566b0e50',
      width: 1920,
      height: 1080,
      url: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop'
    },
    venue: {
      places_id: 'ChIJN-Z-W5bXwokR3d3b6f2Uq9M',
      name: 'Wicked Wolf Tavern',
      address: '120 Sinatra Dr',
      zipcode: '07030',
      state: 'NJ',
      city: 'Hoboken',
      location: '40.7388,-74.0267',
      image: {
        id: '907e5bc3-5821-487f-a740-fbac566b0e51',
        width: 1920,
        height: 1080,
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'
      },
      id: '3'
    }
  },
  {
    id: 4,
    active: true,
    mgid: '953844a8-a150-439c-9f60-8ecd57aa4356',
    type_id: '0eefd8f0-2497-46eb-8a7b-e94c449bd207',
    promoter_id: 'c97d0d78-eea4-49fe-8212-366ae006ce13',
    tags: ['cocktails', 'nightlife'],
    title: 'Saturday Late Night Happy Hour',
    short_desc: '$6 well drinks and $7 signature cocktails.',
    long_desc: 'Late night cravings? Get $6 premium well drinks and $7 signature cocktails starting at 10 PM. Music by resident DJ starts at 10:30 PM.',
    rating: '79',
    occurrence: {
      start_time: '2018-03-03T22:00:00.000Z',
      end_time: '2018-03-04T01:00:00.000Z'
    },
    price: {
      additional_cost: 5,
      min: 6,
      max: 15,
      currency: 'USD',
      prefix: '$',
      suffix: ''
    },
    image: {
      id: '907e5bc3-5821-487f-a740-fbac566b0e52',
      width: 1920,
      height: 1080,
      url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&auto=format&fit=crop'
    },
    venue: {
      places_id: 'ChIJf-x7qH3zwokRw0l1T38F_OQ',
      name: 'The Cuban',
      address: '333 Washington St',
      zipcode: '07030',
      state: 'NJ',
      city: 'Hoboken',
      location: '40.7401,-74.0302',
      image: {
        id: '907e5bc3-5821-487f-a740-fbac566b0e53',
        width: 1920,
        height: 1080,
        url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop'
      },
      id: '4'
    }
  },
  {
    id: 5,
    active: true,
    mgid: '953844a8-a150-439c-9f60-8ecd57aa4357',
    type_id: '0eefd8f0-2497-46eb-8a7b-e94c449bd207',
    promoter_id: 'c97d0d78-eea4-49fe-8212-366ae006ce13',
    tags: ['mimosa', 'brunch'],
    title: 'Sunday Brunch Mimosa Special',
    short_desc: '$15 bottomless Mimosas and Bloody Marys.',
    long_desc: 'Brunch is served! Get $15 bottomless Mimosas, Bloody Marys, and Bellinis with any brunch purchase. Outdoor patio seating is available.',
    rating: '84',
    occurrence: {
      start_time: '2018-03-03T11:00:00.000Z',
      end_time: '2018-03-03T14:00:00.000Z'
    },
    price: {
      additional_cost: 0,
      min: 15,
      max: 15,
      currency: 'USD',
      prefix: '$',
      suffix: ''
    },
    image: {
      id: '907e5bc3-5821-487f-a740-fbac566b0e54',
      width: 1920,
      height: 1080,
      url: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop'
    },
    venue: {
      places_id: 'ChIJr-p86J7ZwokR8Yn2h6eU85E',
      name: 'Madd Hatter',
      address: '221 Washington St',
      zipcode: '07030',
      state: 'NJ',
      city: 'Hoboken',
      location: '40.7414,-74.0301',
      image: {
        id: '907e5bc3-5821-487f-a740-fbac566b0e4d',
        width: 1920,
        height: 1080,
        url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop'
      },
      id: '1'
    }
  }
]

export default data