import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { formatINR } from '../lib/formatters.ts';
import FavoriteButton from './FavoriteButton.tsx';

interface StayCardProps {
  listing: {
    _id: string;
    title: string;
    location: string;
    state?: string;
    price: number;
    imageUrl: string;
    category?: string;
  };
  key?: any;
}

export default function StayCard({ listing }: StayCardProps) {
  return (
    <Link to={`/listing/${listing._id}`} className="group cursor-pointer">
      <div className="flex flex-col gap-2">
        <div className="aspect-square w-full relative overflow-hidden rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="object-cover h-full w-full group-hover:scale-105 transition duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton 
              listingId={listing._id} 
              listingModel={listing.category ? 'Stay' : 'Listing'} 
              className="h-9 w-9"
            />
          </div>
        </div>
        <div className="flex justify-between items-start mt-1">
          <div className="font-bold text-gray-900 truncate pr-2 text-base">{listing.title}</div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-3.5 w-3.5 fill-current text-gray-900" />
            <span>4.9</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm -mt-1">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{listing.location}{listing.state ? `, ${listing.state}` : ''}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="font-bold text-gray-900 text-lg">{formatINR(listing.price)}</span>
          <span className="text-gray-500 text-sm">/ night</span>
        </div>
      </div>
    </Link>
  );
}
