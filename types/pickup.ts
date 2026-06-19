export type PickupStatus =
  | "pending"
  | "accepted"
  | "completed"
  | "cancelled";

export type ScrapCategory =
  | "paper"
  | "plastic"
  | "metal"
  | "electronics"
  | "furniture"
  | "mixed waste";

export type TimeSlot =
  | "9 AM - 12 PM"
  | "12 PM - 3 PM"
  | "3 PM - 6 PM"
  | "6 PM - 9 PM";

export interface PickupRequest {
  customer_uid: string;

  customer_name: string;

  customer_phone: string;

  categories: ScrapCategory[];

  image_urls: string[];

  weight: string;

  address: string;

  pincode: string;

  landmark?: string;

  latitude: number;

  longitude: number;

  pickup_date: string;

  time_slot: TimeSlot;

  status: PickupStatus;

  created_at?: unknown;
}