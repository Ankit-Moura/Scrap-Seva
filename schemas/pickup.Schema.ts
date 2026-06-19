import { z } from "zod";

export const PickupStatusSchema = z.enum([
  "pending",
  "accepted",
  "completed",
  "cancelled",
]);

export const ScrapCategorySchema = z.enum([
  "paper",
  "plastic",
  "metal",
  "electronics",
  "furniture",
  "mixed waste",
]);

export const TimeSlotSchema = z.enum([
  "9 AM - 12 PM",
  "12 PM - 3 PM",
  "3 PM - 6 PM",
  "6 PM - 9 PM",
]);

export const PickupRequestSchema = z.object({
  customer_uid: z
    .string()
    .min(1, "Customer UID is required"),

  customer_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50),

  customer_phone: z
    .string()
    .regex(
      /^\+91\d{10}$/,
      "Invalid Indian phone number"
    ),

  categories: z
    .array(ScrapCategorySchema)
    .min(1, "Select at least one category"),

  image_urls: z
    .array(z.string().url())
    .min(0, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),

  weight: z
    .string()
    .trim()
    .min(1, "Weight is empty"),

  address: z
    .string()
    .trim()
    .min(0, "Address is too short"),

  pincode: z
    .string(),

  landmark: z
    .string()
    .trim()
    .max(100)
    .optional(),

  latitude: z
    .number()
    .min(-90)
    .max(90),

  longitude: z
    .number()
    .min(-180)
    .max(180),

  pickup_date: z
    .string()
    .min(1, "Pickup date is required"),

  time_slot: TimeSlotSchema,

  status: PickupStatusSchema,
});

export type PickupRequestInput =
  z.infer<typeof PickupRequestSchema>;