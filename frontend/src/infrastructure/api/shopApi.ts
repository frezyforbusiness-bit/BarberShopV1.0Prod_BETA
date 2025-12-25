import { httpClient } from './httpClient';

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
}

export interface Barber {
  id: string;
  name: string;
  isActive: boolean;
}

export const shopApi = {
  getServices: (shopSlug: string): Promise<Service[]> => {
    return httpClient.get(`/shops/${shopSlug}/services`);
  },

  getBarbers: (shopSlug: string): Promise<Barber[]> => {
    return httpClient.get(`/shops/${shopSlug}/barbers`);
  },
};


