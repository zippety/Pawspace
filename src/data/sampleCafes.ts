import type { CatCafe } from '../types';

export const SAMPLE_CAFES: CatCafe[] = [
  {
    id: '1',
    name: 'Whiskers & Lattes',
    location: 'Toronto, ON',
    price: 15,
    description: 'A cozy cat café in downtown Toronto featuring specialty coffee and adorable rescue cats.',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Free Wi-Fi', 'Specialty Coffee', 'Cat Toys', 'Reading Corner'],
    rating: 4.8,
    reviews: [],
    maxVisitors: 15,
    latitude: '43.6532',
    longitude: '-79.3832',
    residentCats: [
      {
        id: 'cat1',
        name: 'Luna',
        age: 3,
        breed: 'British Shorthair',
        description: 'Luna is a gentle soul who loves afternoon naps and chin scratches.',
        image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800&q=80',
        personality: ['Gentle', 'Sleepy', 'Affectionate']
      },
      {
        id: 'cat2',
        name: 'Milo',
        age: 2,
        breed: 'Maine Coon',
        description: 'Milo is an energetic player who enjoys chasing toys and meeting new friends.',
        image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=800&q=80',
        personality: ['Playful', 'Social', 'Curious']
      }
    ],
    menu: [
      {
        id: 'drink1',
        name: 'Cat-puccino',
        description: 'Our signature cappuccino with cat-themed latte art',
        price: 5.50,
        category: 'drinks'
      },
      {
        id: 'food1',
        name: 'Paw-sta Salad',
        description: 'Fresh pasta salad with seasonal vegetables',
        price: 12.00,
        category: 'food'
      }
    ]
  },
  {
    id: '2',
    name: 'Purr & Pour',
    location: 'Ottawa, ON',
    price: 18,
    description: 'An elegant cat lounge offering premium tea selections and comfortable spaces for both cats and humans.',
    images: [
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Premium Teas', 'Cat Beds', 'Study Space', 'Board Games'],
    rating: 4.9,
    reviews: [],
    maxVisitors: 12,
    latitude: '45.4215',
    longitude: '-75.6972',
    residentCats: [
      {
        id: 'cat3',
        name: 'Oliver',
        age: 4,
        breed: 'Ragdoll',
        description: 'Oliver is a majestic floof who loves being the center of attention.',
        image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
        personality: ['Regal', 'Friendly', 'Attention-Loving']
      },
      {
        id: 'cat4',
        name: 'Sophie',
        age: 1,
        breed: 'Scottish Fold',
        description: 'Sophie is our youngest resident, full of energy and mischief.',
        image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
        personality: ['Energetic', 'Playful', 'Mischievous']
      }
    ],
    menu: [
      {
        id: 'drink2',
        name: 'Meow-cha Latte',
        description: 'Premium matcha latte with oat milk option',
        price: 6.00,
        category: 'drinks'
      },
      {
        id: 'food2',
        name: 'Kitty Bento Box',
        description: 'Assorted snacks arranged in a cute cat-themed bento',
        price: 15.00,
        category: 'food'
      }
    ]
  }
];
