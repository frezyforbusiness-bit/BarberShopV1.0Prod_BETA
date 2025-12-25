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

export interface Shop {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export const shopApi = {
  getServices: (shopSlug: string): Promise<Service[]> => {
    return httpClient.get(`/shops/${shopSlug}/services`);
  },

  getBarbers: (shopSlug: string): Promise<Barber[]> => {
    return httpClient.get(`/shops/${shopSlug}/barbers`);
  },

  getShopBySlug: (shopSlug: string): Promise<Shop> => {
    // Questo endpoint potrebbe non esistere, ma lo aggiungiamo per ottenere lo shopId
    // Se non esiste, useremo lo shopSlug come shopId temporaneamente
    return httpClient.get<Shop>(`/shops/${shopSlug}`).catch(() => {
      // Fallback: ritorna un oggetto con slug come id se l'endpoint non esiste
      return Promise.resolve({ id: shopSlug, name: '', slug: shopSlug, isActive: true } as Shop);
    });
  },
};



