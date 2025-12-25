export interface CreateBookingRequest {
  shopId: string;
  barberId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string; // ISO date string YYYY-MM-DD
  startHour: number;
  startMinute: number;
}


