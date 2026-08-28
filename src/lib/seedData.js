// Shared seed data configuration for manual and automatic seeding

const today = new Date()
today.setHours(0, 0, 0, 0)

const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

const dummyUsers = [
  {
    email: 'andy@andyhay.com',
    username: 'andyhay',
    password: 'securepassword123',
    passwordConf: 'securepassword123'
  },
  {
    email: 'bar_manager@kwenchr.com',
    username: 'bar_manager',
    password: 'managerpassword',
    passwordConf: 'managerpassword'
  },
  {
    email: 'cocktail_queen@kwenchr.com',
    username: 'cocktail_queen',
    password: 'queenpassword',
    passwordConf: 'queenpassword'
  },
  {
    email: 'happyhour_hero@kwenchr.com',
    username: 'happyhour_hero',
    password: 'heropassword',
    passwordConf: 'heropassword'
  },
  {
    email: 'comedy_captain@kwenchr.com',
    username: 'comedy_captain',
    password: 'captainpassword',
    passwordConf: 'captainpassword'
  }
]

const dummyEvents = [
  {
    name: 'Margarita Madness Monday',
    start_time: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM today
    end_time: new Date(today.getTime() + 19 * 60 * 60 * 1000), // 7:00 PM today
    places_id: 'ChIJr-p86J7ZwokR8Yn2h6eU85E', // Madd Hatter Place ID
    short_description: '2-for-1 Margaritas and $3 Taco specials!',
    long_description: 'Join us for our weekly Margarita Madness! Enjoy 2-for-1 Margaritas (classic, strawberry, or spicy mango) at the bar. We also have $3 beef, chicken, and veggie tacos all evening.',
    venue_name: 'Madd Hatter',
    venue_address: '221 Washington St, Hoboken, NJ 07030',
    venue_location: '40.7414,-74.0301',
    image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Wine Down Wednesday',
    start_time: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM today
    end_time: new Date(today.getTime() + 21 * 60 * 60 * 1000), // 9:00 PM today
    places_id: 'ChIJt0V_n1rXw4kR4uG3c-6xSyc', // The Madison Bar & Grill Place ID
    short_description: 'Half-off all bottles of wine and select drafts.',
    long_description: 'Unwind in our cozy lounge with 50% off all wine bottles. Select local drafts are also on tap for just $4. Bring your friends and split a bottle!',
    venue_name: 'The Madison Bar & Grill',
    venue_address: '1316 Washington St, Hoboken, NJ 07030',
    venue_location: '40.7533,-74.0253',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Friday Sunset Beer Garden',
    start_time: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 20 * 60 * 60 * 1000), // 8:00 PM tomorrow
    places_id: 'ChIJN-Z-W5bXwokR3d3b6f2Uq9M', // Wicked Wolf Tavern Place ID
    short_description: '$5 IPA pints and live acoustic set.',
    long_description: 'Celebrate the weekend with $5 IPAs, stouts, and pilsners in our outdoor beer garden. A live acoustic music set starts at 6 PM!',
    venue_name: 'Wicked Wolf Tavern',
    venue_address: '120 Sinatra Dr, Hoboken, NJ 07030',
    venue_location: '40.7388,-74.0267',
    image_url: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop',
    tags: ['event'],
    type_id: 'event'
  },
  {
    name: 'Saturday Late Night Happy Hour',
    start_time: new Date(tomorrow.getTime() + 22 * 60 * 60 * 1000), // 10:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 25 * 60 * 60 * 1000), // 1:00 AM tomorrow night (2 AM day after)
    places_id: 'ChIJf-x7qH3zwokRw0l1T38F_OQ', // The Cuban Place ID
    short_description: '$6 well drinks and $7 signature cocktails.',
    long_description: 'Late night cravings? Get $6 premium well drinks and $7 signature cocktails starting at 10 PM. Music by resident DJ starts at 10:30 PM.',
    venue_name: 'The Cuban',
    venue_address: '333 Washington St, Hoboken, NJ 07030',
    venue_location: '40.7401,-74.0302',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Sunday Brunch Mimosa Special',
    start_time: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11:00 AM today
    end_time: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2:00 PM today
    places_id: 'custom_shepherd_knucklehead',
    short_description: '$15 bottomless Mimosas and Bloody Marys.',
    long_description: 'Brunch is served! Get $15 bottomless Mimosas, Bloody Marys, and Bellinis with any brunch purchase. Outdoor patio seating is available.',
    venue_name: 'The Shepherd & the Knucklehead',
    venue_address: '1313 Willow Ave, Hoboken, NJ 07030',
    venue_location: '40.7529,-74.0315',
    image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Saturday Stand-Up Comedy Live',
    start_time: new Date(today.getTime() + 20 * 60 * 60 * 1000), // 8:00 PM today
    end_time: new Date(today.getTime() + 23 * 60 * 60 * 1000), // 11:00 PM today
    places_id: 'custom_carpe_diem',
    short_description: 'Live stand-up comedy and $5 craft drafts.',
    long_description: 'Join us for stand-up comedy starring local NJ comedians. Enjoy $5 craft drafts and half-off appetizers all night!',
    venue_name: 'Carpe Diem Pub & Restaurant',
    venue_address: '1405 Grand St, Hoboken, NJ 07030',
    venue_location: '40.7552,-74.0308',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
    tags: ['comedy'],
    type_id: 'comedy'
  },
  {
    name: 'LGBTQ+ Pride Night Out',
    start_time: new Date(today.getTime() + 21 * 60 * 60 * 1000), // 9:00 PM today
    end_time: new Date(today.getTime() + 24 * 60 * 60 * 1000), // 12:00 AM today
    places_id: 'custom_the_shannon',
    short_description: 'Celebrate Pride with $6 rainbow cosmos and live DJ.',
    long_description: 'Get your drink on at our weekly Pride Night! Featuring $6 rainbow cosmos, drag hosts, and a live DJ playing house remixes until late.',
    venue_name: 'The Shannon',
    venue_address: '106 1st St, Hoboken, NJ 07030',
    venue_location: '40.7374,-74.0306',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    tags: ['lgbt'],
    type_id: 'lgbt'
  },
  {
    name: 'Monday Night Football Kickoff',
    start_time: new Date(today.getTime() + 19 * 60 * 60 * 1000), // 7:00 PM today
    end_time: new Date(today.getTime() + 23 * 60 * 60 * 1000), // 11:00 PM today
    places_id: 'custom_green_rock',
    short_description: '$12 Coors Light pitchers and 75-cent wings.',
    long_description: 'Catch the big game on our HD projector screens! We have $12 light draft pitchers and 75-cent Buffalo or BBQ wings all night.',
    venue_name: 'Green Rock Tap & Grill',
    venue_address: '70 Hudson St, Hoboken, NJ 07030',
    venue_location: '40.7359,-74.0298',
    image_url: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Tuesday Trivia Championship',
    start_time: new Date(today.getTime() + 19 * 60 * 60 * 1000),
    end_time: new Date(today.getTime() + 22 * 60 * 60 * 1000),
    places_id: 'custom_finnegans_pub',
    short_description: 'Pub trivia contest with $5 craft drafts and prizes.',
    long_description: 'Assemble your team and win $100 bar cash! trivia contest starts at 7:30 PM sharp. Discounted local draft beers all evening.',
    venue_name: 'Finnegan\'s Pub',
    venue_address: '734 Willow Ave, Hoboken, NJ 07030',
    venue_location: '40.7454,-74.0326',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
    tags: ['event'],
    type_id: 'event'
  },
  {
    name: 'Thirsty Thursday Draft Mania',
    start_time: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000), // 6:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 22 * 60 * 60 * 1000),
    places_id: 'custom_wilton_house',
    short_description: 'Select local IPAs and stouts are half off.',
    long_description: 'Kickstart the weekend early with half-price local IPAs, craft pilsners, and premium stouts. Live acoustic guitar set starting at 7 PM.',
    venue_name: 'Wilton House',
    venue_address: '58 Newark St, Hoboken, NJ 07030',
    venue_location: '40.7363,-74.0302',
    image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Friday Night Jazz & Gin',
    start_time: new Date(tomorrow.getTime() + 21 * 60 * 60 * 1000), // 9:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
    places_id: 'custom_mcswiggans',
    short_description: 'Live jazz duo and $8 botanical gin specials.',
    long_description: 'Join us for a classy night of live jazz and botanical gin combinations. Featured mixes are just $8 all night.',
    venue_name: 'McSwiggans Pub',
    venue_address: '110 1st St, Hoboken, NJ 07030',
    venue_location: '40.7375,-74.0308',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    tags: ['event'],
    type_id: 'event'
  },
  {
    name: 'Saturday Mimosa Brunch Bash',
    start_time: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00 AM today
    end_time: new Date(today.getTime() + 14 * 60 * 60 * 1000),
    places_id: 'custom_east_la',
    short_description: '$18 bottomless Mimosas with brunch entree.',
    long_description: 'Enjoy a luxurious brunch on our patio. Get bottomless classic, peach, or pineapple mimosas for just $18 when you purchase any brunch item.',
    venue_name: 'East LA',
    venue_address: '508 Washington St, Hoboken, NJ 07030',
    venue_location: '40.7431,-74.0300',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Comedy Showcase Tuesday Night',
    start_time: new Date(today.getTime() + 20 * 60 * 60 * 1000 + 30 * 60 * 1000), // 8:30 PM today
    end_time: new Date(today.getTime() + 23 * 60 * 60 * 1000),
    places_id: 'custom_black_bear',
    short_description: 'Hilarious local stand-up and half-off martinis.',
    long_description: 'Catch top-tier comedians from NYC and NJ while enjoying half-off classic, espresso, and dirty martinis at our weekly showcase.',
    venue_name: 'Black Bear Bar & Grill',
    venue_address: '205 Washington St, Hoboken, NJ 07030',
    venue_location: '40.7410,-74.0301',
    image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop',
    tags: ['comedy'],
    type_id: 'comedy'
  },
  {
    name: 'LGBTQ+ Sunday Karaoke Social',
    start_time: new Date(tomorrow.getTime() + 20 * 60 * 60 * 1000), // 8:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 23 * 60 * 60 * 1000 + 30 * 60 * 1000),
    places_id: 'custom_northern_soul',
    short_description: 'Sing your heart out with $5 shots and drag hosts.',
    long_description: 'Get on stage and show your talent! Hostesses lead a fun night of pride anthems, with $5 house tequila and whiskey shots.',
    venue_name: 'Northern Soul',
    venue_address: '700 1st St, Hoboken, NJ 07030',
    venue_location: '40.7381,-74.0396',
    image_url: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop',
    tags: ['lgbt'],
    type_id: 'lgbt'
  },
  {
    name: 'Rooftop Craft Cocktail Social',
    start_time: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM today
    end_time: new Date(today.getTime() + 20 * 60 * 60 * 1000),
    places_id: 'custom_pilsener_haus',
    short_description: '$9 custom botanical cocktails and bites.',
    long_description: 'Mingle on the rooftop with craft cocktails featuring house-infused spirits. Custom mixes are $9, alongside gourmet slider specials.',
    venue_name: 'Pilsener Haus & Biergarten',
    venue_address: '1422 Grand St, Hoboken, NJ 07030',
    venue_location: '40.7554,-74.0302',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    tags: ['event'],
    type_id: 'event'
  },
  {
    name: 'Late Night Tacos & Tequila',
    start_time: new Date(today.getTime() + 23 * 60 * 60 * 1000), // 11:00 PM today
    end_time: new Date(today.getTime() + 26 * 60 * 60 * 1000), // 2:00 AM next day
    places_id: 'custom_farside_tavern',
    short_description: '$7 margaritas and half-off street tacos.',
    long_description: 'Satisfy those late-night cravings with $7 margaritas and half-off carnitas, al pastor, and fish street tacos starting at 11 PM.',
    venue_name: 'Farside Tavern',
    venue_address: '531 Washington St, Hoboken, NJ 07030',
    venue_location: '40.7434,-74.0294',
    image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Whiskey Tasting Experience',
    start_time: new Date(tomorrow.getTime() + 19 * 60 * 60 * 1000), // 7:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 22 * 60 * 60 * 1000),
    places_id: 'custom_onieals',
    short_description: 'Flight of 4 premium whiskeys for $20.',
    long_description: 'Explore flavor profiles with a curated flight of four small-batch bourbon and rye whiskeys. Light appetizers included in the flight fee.',
    venue_name: 'Onieals Hoboken',
    venue_address: '343 Park Ave, Hoboken, NJ 07030',
    venue_location: '40.7412,-74.0321',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
    tags: ['event'],
    type_id: 'event'
  },
  {
    name: 'Zeppelin Hall Beer Garden Bash',
    start_time: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2:00 PM today (approx 4.5 miles from Hoboken)
    end_time: new Date(today.getTime() + 18 * 60 * 60 * 1000),
    places_id: 'custom_zeppelin_hall',
    short_description: '$10 double-sized drafts and German pretzels.',
    long_description: 'Join us at Jersey Citys premier beer garden! Get giant liters of import drafts for just $10 and freshly baked Bavarian giant pretzels.',
    venue_name: 'Zeppelin Hall Beer Garden',
    venue_address: '88 Liberty View Dr, Jersey City, NJ 07302',
    venue_location: '40.7168,-74.0439',
    image_url: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop',
    tags: ['event'],
    type_id: 'event'
  },
  {
    name: 'Dullboy Craft Cocktail Hour',
    start_time: new Date(tomorrow.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM tomorrow (approx 4.0 miles from Hoboken)
    end_time: new Date(tomorrow.getTime() + 19 * 60 * 60 * 1000),
    places_id: 'custom_dullboy',
    short_description: '$10 bespoke creations in a library lounge.',
    long_description: 'Indulge in award-winning mixology. Choose from our featured menu of craft cocktails for just $10 in our intimate literary lounge.',
    venue_name: 'Dullboy',
    venue_address: '364 Grove St, Jersey City, NJ 07302',
    venue_location: '40.7208,-74.0416',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Weehawken Skyline Soiree',
    start_time: new Date(today.getTime() + 18 * 60 * 60 * 1000 + 30 * 60 * 1000), // 6:30 PM today (approx 1.5 miles from Hoboken)
    end_time: new Date(today.getTime() + 21 * 60 * 60 * 1000),
    places_id: 'custom_chart_house',
    short_description: '$8 martinis with breathtaking NYC views.',
    long_description: 'Sit back and enjoy the Manhattan skyline view. We feature $8 select cosmopolitans, lemon drops, and dirty martinis.',
    venue_name: 'Chart House Weehawken',
    venue_address: '1700 Harbor Blvd, Weehawken, NJ 07086',
    venue_location: '40.7681,-74.0112',
    image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop',
    tags: ['event'],
    type_id: 'event'
  },
  {
    name: 'Stand-Up Comedy Night at Madison',
    start_time: new Date(tomorrow.getTime() + 21 * 60 * 60 * 1000), // 9:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 23 * 60 * 60 * 1000 + 30 * 60 * 1000),
    places_id: 'custom_the_archer',
    short_description: 'Laughs, drinks, and half-off select pitchers.',
    long_description: 'Our weekly comedy showcase features top comedians from Comedy Central and local clubs. Enjoy half-price sangria or margarita pitchers.',
    venue_name: 'The Archer',
    venue_address: '176 Newark Ave, Jersey City, NJ 07302',
    venue_location: '40.7214,-74.0450',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
    tags: ['comedy'],
    type_id: 'comedy'
  },
  {
    name: 'LGBTQ+ Sunday Recovery Brunch',
    start_time: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12:00 PM today
    end_time: new Date(today.getTime() + 15 * 60 * 60 * 1000),
    places_id: 'custom_cellar_335',
    short_description: '$6 bellinis and drag musical bingo.',
    long_description: 'Recovery begins here! Recover with $6 bellinis, drag bingo games, show tunes, and prizes. Outdoor patio is open.',
    venue_name: 'Cellar 335',
    venue_address: '335 Newark Ave, Jersey City, NJ 07302',
    venue_location: '40.7230,-74.0494',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    tags: ['lgbt'],
    type_id: 'lgbt'
  },
  {
    name: 'Titos & Taps Thursday Night',
    start_time: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM today
    end_time: new Date(today.getTime() + 20 * 60 * 60 * 1000),
    places_id: 'custom_porta_jc',
    short_description: '$5 Titos mixers and $4 domestic craft taps.',
    long_description: 'Sip on $5 Titos Vodka mixers (cranberry, tonic, or club soda) and grab $4 domestic draft beers at the bar during our Thursday social hour.',
    venue_name: 'Porta Jersey City',
    venue_address: '135 Newark Ave, Jersey City, NJ 07302',
    venue_location: '40.7208,-74.0441',
    image_url: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Saturday Comedy Club at Pilsener',
    start_time: new Date(tomorrow.getTime() + 20 * 60 * 60 * 1000), // 8:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 23 * 60 * 60 * 1000),
    places_id: 'custom_the_standard_nyc',
    short_description: 'Live comedy showcase and $6 draft imports.',
    long_description: 'Enjoy giant steins of imports for just $6 while watching a lineup of New Yorks funniest comedians. Pre-registration recommended.',
    venue_name: 'The Standard NYC',
    venue_address: '848 Washington St, New York, NY 10014',
    venue_location: '40.7409,-74.0084',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    tags: ['comedy'],
    type_id: 'comedy'
  },
  {
    name: 'Madd Hatter Wings & Pitchers',
    start_time: new Date(tomorrow.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM tomorrow
    end_time: new Date(tomorrow.getTime() + 20 * 60 * 60 * 1000),
    places_id: 'custom_stonewall_inn',
    short_description: '$12 Miller Lite pitchers and 75-cent wings.',
    long_description: 'Score big with $12 Miller Lite draft pitchers and 75-cent wings (bone-in or boneless, choice of 6 sauces) available during game broadcasts.',
    venue_name: 'The Stonewall Inn',
    venue_address: '53 Christopher St, New York, NY 10014',
    venue_location: '40.7338,-74.0021',
    image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  },
  {
    name: 'Pride Remix Dance Night',
    start_time: new Date(tomorrow.getTime() + 22 * 60 * 60 * 1000), // 10:00 PM tomorrow (approx 4.5 miles from Hoboken)
    end_time: new Date(tomorrow.getTime() + 25 * 60 * 60 * 1000),
    places_id: 'custom_white_eagle_hall',
    short_description: '$6 color cosmopolitans and resident pride DJ.',
    long_description: 'Party with the community! Dance to house remixes with our resident DJ. Cosmopolitans are on special for just $6 starting at 10 PM.',
    venue_name: 'White Eagle Hall',
    venue_address: '337 Newark Ave, Jersey City, NJ 07302',
    venue_location: '40.7232,-74.0496',
    image_url: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&auto=format&fit=crop',
    tags: ['lgbt'],
    type_id: 'lgbt'
  },
  {
    name: 'West Village Crossing Special Hour',
    start_time: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM today (approx 2.5 miles from Hoboken)
    end_time: new Date(today.getTime() + 20 * 60 * 60 * 1000),
    places_id: 'custom_brass_monkey',
    short_description: '$5 drafts and $6 well options in the Meatpacking.',
    long_description: 'Pop across the river to the West Village! We feature $5 draft drafts and $6 well mixers during our popular daily happy hour.',
    venue_name: 'Brass Monkey NYC',
    venue_address: '55 Little W 12th St, New York, NY 10014',
    venue_location: '40.7397,-74.0090',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
    tags: ['happy-hour'],
    type_id: 'happy-hour'
  }
]

module.exports = {
  dummyUsers,
  dummyEvents
}
