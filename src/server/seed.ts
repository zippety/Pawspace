import mongoose from 'mongoose';
import Space from './models/Space';

const sampleSpaces = [
  // San Francisco Spaces
  {
    title: 'Luxury Pet Loft in SoMa',
    description: 'Modern loft with panoramic city views, dedicated pet play area, and premium pet amenities. Walking distance to several dog parks.',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    rating: 4.8,
    location: 'San Francisco, CA',
    amenities: ['Pet Play Area', 'Dog Washing Station', 'Pet Supplies', 'City Views'],
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    title: 'Marina District Pet Haven',
    description: 'Charming apartment with fenced private garden. Perfect for morning walks along the Marina Green. Pet-friendly cafes nearby.',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    rating: 4.9,
    location: 'San Francisco, CA',
    amenities: ['Private Garden', 'Near Dog Park', 'Pet-Friendly Cafes'],
    coordinates: { lat: 37.7822, lng: -122.4382 }
  },
  {
    title: 'Hayes Valley Pet Cottage',
    description: 'Cozy cottage with modern pet amenities. Close to Patricia's Green and trendy pet boutiques.',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
    rating: 4.6,
    location: 'San Francisco, CA',
    amenities: ['Pet Door', 'Yard', 'Pet Bed', 'Pet Toys'],
    coordinates: { lat: 37.7759, lng: -122.4245 }
  },

  // Los Angeles Spaces
  {
    title: 'Hollywood Hills Pet Retreat',
    description: 'Stunning villa with large yard and pool. Panoramic views of LA. Perfect for pets who love outdoor activities.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    rating: 4.9,
    location: 'Los Angeles, CA',
    amenities: ['Pool', 'Large Yard', 'Pet Spa', 'Hiking Trails'],
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    title: 'Santa Monica Beach House',
    description: 'Beachfront property perfect for water-loving pets. Fully fenced yard and direct beach access.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6',
    rating: 4.7,
    location: 'Los Angeles, CA',
    amenities: ['Beach Access', 'Fenced Yard', 'Outdoor Shower'],
    coordinates: { lat: 34.0195, lng: -118.4912 }
  },

  // Seattle Spaces
  {
    title: 'Capitol Hill Pet Paradise',
    description: 'Modern apartment near Volunteer Park. Pet-friendly building with dedicated dog run area.',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a',
    rating: 4.5,
    location: 'Seattle, WA',
    amenities: ['Dog Run', 'Pet Washing Station', 'Pet Relief Area'],
    coordinates: { lat: 47.6062, lng: -122.3321 }
  },
  {
    title: 'Ballard Dog Haven',
    description: 'Spacious townhouse with private yard. Walking distance to Golden Gardens Park and dog-friendly breweries.',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    rating: 4.8,
    location: 'Seattle, WA',
    amenities: ['Private Yard', 'Pet Door', 'Near Dog Beach'],
    coordinates: { lat: 47.6205, lng: -122.3493 }
  },

  // Portland Spaces
  {
    title: 'Pearl District Pup Pad',
    description: 'Industrial-chic loft in pet-friendly building. Close to The Fields Park and Forest Park trails.',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1560185008-a33f5c1a3d73',
    rating: 4.6,
    location: 'Portland, OR',
    amenities: ['Dog Relief Area', 'Pet Washing Station', 'Near Dog Park'],
    coordinates: { lat: 45.5155, lng: -122.6789 }
  },

  // Budget-Friendly Options
  {
    title: 'Cozy Pet Studio',
    description: 'Affordable studio perfect for a pet parent. Basic amenities and clean space.',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    rating: 4.2,
    location: 'Oakland, CA',
    amenities: ['Pet Bed', 'Basic Pet Supplies'],
    coordinates: { lat: 37.8044, lng: -122.2711 }
  },
  {
    title: 'Pet-Friendly Room',
    description: 'Private room in a shared house with yard access. Perfect for budget travelers with pets.',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be',
    rating: 4.0,
    location: 'Berkeley, CA',
    amenities: ['Shared Yard', 'Basic Pet Supplies'],
    coordinates: { lat: 37.8715, lng: -122.2730 }
  },

  // Luxury Options
  {
    title: 'Ultimate Pet Mansion',
    description: 'Luxurious estate with private dog park, pet spa, and dedicated pet chef. The ultimate pet vacation.',
    price: 250,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
    rating: 5.0,
    location: 'Beverly Hills, CA',
    amenities: ['Private Dog Park', 'Pet Spa', 'Pet Chef', 'Pet Concierge'],
    coordinates: { lat: 34.0736, lng: -118.4004 }
  },
  {
    title: 'Oceanfront Pet Resort',
    description: 'Spectacular beachfront property with infinity pool and professional pet services.',
    price: 200,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    rating: 4.9,
    location: 'Malibu, CA',
    amenities: ['Beach Access', 'Pet Spa', 'Pet Training', 'Pet Photography'],
    coordinates: { lat: 34.0259, lng: -118.7798 }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pawspace');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Space.deleteMany({});
    console.log('Cleared existing spaces');

    // Add owner IDs (in a real app, these would be actual user IDs)
    const spacesWithOwners = sampleSpaces.map(space => ({
      ...space,
      owner: new mongoose.Types.ObjectId()
    }));

    // Insert sample data
    await Space.insertMany(spacesWithOwners);
    console.log('Sample spaces inserted successfully');

    // Log summary
    console.log('\nSeeded database with:');
    console.log(`- ${spacesWithOwners.length} total spaces`);
    console.log(`- ${new Set(spacesWithOwners.map(s => s.location)).size} different locations`);
    console.log(`- Price range: $${Math.min(...spacesWithOwners.map(s => s.price))} - $${Math.max(...spacesWithOwners.map(s => s.price))}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\nDatabase seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
