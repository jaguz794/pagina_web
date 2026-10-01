import { getStore } from '@netlify/blobs';
import { cleanupOffers } from './lib/cleanup-offers.mjs';

export default async () => {
  const offerStore = getStore({ name: 'popular-offers', consistency: 'strong' });
  const imageStore = getStore({ name: 'popular-offer-images', consistency: 'strong' });
  const result = await cleanupOffers(offerStore, imageStore);
  console.log('Offer image cleanup:', result);
};

// Netlify schedules in UTC. 05:15 UTC is 00:15 in Bogotá year-round.
export const config = { schedule: '15 5 * * *' };
