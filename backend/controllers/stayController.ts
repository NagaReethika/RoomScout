import { Request, Response } from 'express';
import Stay from '../models/Stay.ts';

export const getStays = async (req: Request, res: Response) => {
  try {
    const { state, location, category, sort } = req.query;
    let query: any = {};

    if (state && state !== 'All States') {
      query.state = state;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let staysQuery = Stay.find(query);

    if (sort === 'price_asc') {
      staysQuery = staysQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      staysQuery = staysQuery.sort({ price: -1 });
    }

    const stays = await staysQuery;
    res.json(stays);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error fetching stays');
  }
};

export const seedStays = async () => {
  const sampleStays = [
    {
      title: 'The Khyber Himalayan Resort & Spa',
      description: 'Luxury resort offering breathtaking views of the Affarwat peaks in the heart of Gulmarg.',
      location: 'Srinagar',
      state: 'Jammu & Kashmir',
      category: 'Hotel',
      price: 28500,
      imageUrl: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'The Lodhi New Delhi',
      description: 'An urban oasis offering contemporary luxury and personalized service in the capital city.',
      location: 'New Delhi',
      state: 'Delhi',
      category: 'Hotel',
      price: 32000,
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'The Oberoi Udaivilas',
      description: 'A majestic palace on the banks of Lake Pichola, showcasing the heritage of Mewar.',
      location: 'Udaipur',
      state: 'Rajasthan',
      category: 'Hotel',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1615549158121-e04a933a5517?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Rambagh Palace',
      description: 'The "Jewel of Jaipur", this former royal residence offers an architectural masterpiece.',
      location: 'Jaipur',
      state: 'Rajasthan',
      category: 'Hotel',
      price: 55000,
      imageUrl: 'https://images.unsplash.com/photo-1590050752117-23a9d7fc6bbd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Taj Falaknuma Palace',
      description: 'Experience the Nizam life in this palace in the sky, perched 2000 feet above Hyderabad.',
      location: 'Hyderabad',
      state: 'Telangana',
      category: 'Hotel',
      price: 42000,
      imageUrl: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'The Taj Mahal Palace',
      description: 'An iconic landmark overlooking the Gateway of India and the Arabian Sea.',
      location: 'Mumbai',
      state: 'Maharashtra',
      category: 'Hotel',
      price: 38000,
      imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'The Ritz-Carlton, Pune',
      description: 'A gateway to the city’s cultural and business hubs, offering refined luxury.',
      location: 'Pune',
      state: 'Maharashtra',
      category: 'Hotel',
      price: 18500,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Suryalanka Beach Resort',
      description: 'A serene beachside retreat perfect for a relaxing weekend getaway.',
      location: 'Bapatla',
      state: 'Andhra Pradesh',
      category: 'Homestay',
      price: 6500,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'The Gateway Hotel Beach Road',
      description: 'Modern comfort with stunning views of the Bay of Bengal.',
      location: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      category: 'Hotel',
      price: 9500,
      imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Fortune Select Grand Ridge',
      description: 'Upscale hotel offering a spiritual and comfortable stay near the holy hills.',
      location: 'Tirupati',
      state: 'Andhra Pradesh',
      category: 'Hotel',
      price: 7500,
      imageUrl: 'https://images.unsplash.com/photo-1624571409412-1f22055ca234?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Kumarakom Lake Resort',
      description: 'Luxury backwater resort offering traditional Kerala architecture and serene views.',
      location: 'Kumarakom',
      state: 'Kerala',
      category: 'Homestay',
      price: 26000,
      imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'ITC Grand Chola',
      description: 'A tribute to the Chola dynasty, this palatial hotel offers unparalleled luxury.',
      location: 'Chennai',
      state: 'Tamil Nadu',
      category: 'Hotel',
      price: 22000,
      imageUrl: 'https://images.unsplash.com/photo-1582512353193-911c9bb41df6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'The Leela Palace Bengaluru',
      description: 'Inspired by the Royal Palace of Mysore, set amidst nine acres of lush gardens.',
      location: 'Bangalore',
      state: 'Karnataka',
      category: 'Hotel',
      price: 24500,
      imageUrl: 'https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Taj Exotica Resort & Spa',
      description: 'Mediterranean-style resort set in 56 acres of lush gardens along the Benaulim beach.',
      location: 'Benaulim',
      state: 'Goa',
      category: 'Hotel',
      price: 35000,
      imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Span Resort & Spa',
      description: 'One of the oldest and most luxurious riverside resorts in Manali.',
      location: 'Manali',
      state: 'Himachal Pradesh',
      category: 'Hotel',
      price: 16500,
      imageUrl: 'https://images.unsplash.com/photo-1617653202545-931490e8d7e7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Zostel Manali',
      description: 'A vibrant hostel experience for backpackers with stunning mountain views.',
      location: 'Manali',
      state: 'Himachal Pradesh',
      category: 'Hostel',
      price: 800,
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Cozy PG for Students',
      description: 'Affordable and safe PG accommodation with all basic amenities.',
      location: 'Hyderabad',
      state: 'Telangana',
      category: 'PG',
      price: 8000,
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Modern Apartment in Mumbai',
      description: 'Fully furnished 2BHK apartment in the heart of the city.',
      location: 'Mumbai',
      state: 'Maharashtra',
      category: 'Apartment',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Private Room in Bangalore',
      description: 'Comfortable private room in a quiet residential area.',
      location: 'Bangalore',
      state: 'Karnataka',
      category: 'Room',
      price: 12000,
      imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Luxury Villa in Goa',
      description: 'Exquisite villa with private pool and beach access.',
      location: 'Goa',
      state: 'Goa',
      category: 'Villa',
      price: 75000,
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  for (const stay of sampleStays) {
    const exists = await Stay.findOne({ title: stay.title });
    if (!exists) {
      await Stay.create(stay);
    } else {
      // Update data if it exists to ensure latest realistic info
      await Stay.updateOne({ title: stay.title }, { 
        $set: { 
          price: stay.price, 
          state: stay.state, 
          location: stay.location,
          description: stay.description,
          imageUrl: stay.imageUrl,
          category: stay.category
        } 
      });
    }
  }
  console.log('Stays seeding check completed');
};
