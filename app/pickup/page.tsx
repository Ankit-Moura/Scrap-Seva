

"use client";

import { useMemo, useState, ChangeEvent, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Recycle,
  Cpu,
  Sofa,
  Package,
  Layers,
  MapPin,
  Calendar,
  Upload,
  X,
  Check,
  ChevronLeft
} from "lucide-react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

type ScrapCategory =
  | "paper"
  | "plastic"
  | "metal"
  | "electronics"
  | "furniture"
  | "mixed waste";

type TimeSlot =
  | "9 AM - 12 PM"
  | "12 PM - 3 PM"
  | "3 PM - 6 PM"
  | "6 PM - 9 PM";

interface FormState {
  images: File[];
  categories: ScrapCategory[];
  weight: string;
  pincode: string;
  landmark: string;
  pickupDate: string;   
  timeSlot: TimeSlot | "";
latitude: number | null;
  longitude: number | null;
}

const CATEGORY_CONFIG = [
  { id: "paper", label: "Paper", icon: FileText },
  { id: "plastic", label: "Plastic", icon: Recycle },
  { id: "metal", label: "Metal", icon: Layers },
  { id: "electronics", label: "Electronics", icon: Cpu },
  { id: "furniture", label: "Furniture", icon: Sofa },
  { id: "mixed waste", label: "Mixed Waste", icon: Package },
] as const;

const TIME_SLOTS: TimeSlot[] = [
  "9 AM - 12 PM",
  "12 PM - 3 PM",
  "3 PM - 6 PM",
  "6 PM - 9 PM",
];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-2 flex-1 rounded-full ${
            s <= step ? "bg-green-400" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function PickUp() {
  const [step, setStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [form, setForm] = useState<FormState>({
    images: [],
    categories: [],
    weight: "",
    pincode: "",
    landmark: "",
    pickupDate: "",
    timeSlot: "",
    latitude: null,
    longitude: null,
  });

  const [pinLocation, setPinLocation] = useState<{
  lat: number;
  lng: number;
}>({
  lat: 28.6139,
  lng: 77.2090,
});

useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setPinLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    }
  );
}, []);

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
});



  const previews = useMemo(
    () => form.images.map((f) => URL.createObjectURL(f)),
    [form.images]
  );

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5),
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleCategory = (category: ScrapCategory) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };



  const nextStep = () => {
    if (step === 1 && form.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    if (step === 2 && form.categories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    setStep((s) => Math.min(3, s + 1));
  };

  const handleBackPress = () => {
    setStep(prev=>prev-1)
  }

  const publishRequest = () => {
    if (
      !form.weight ||
      !form.pincode ||
      !form.pickupDate ||
      !form.timeSlot
    ) {
      alert("Please fill all required fields.");
      return;
    }

    console.log(form);
    alert("Pickup request published successfully.");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm p-5"
          >

            <button disabled={step===1} className="-translate-x-1 cursor-pointer" onClick={handleBackPress}><ChevronLeft/></button>
            <p className="text-sm text-gray-500 mb-2">
              Step {step} of 3
            </p>

            <ProgressBar step={step} />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-2xl font-bold">
                    Upload Scrap Photos
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Helping us estimate the value better.
                  </p>

                  <label className="mt-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl p-8 cursor-pointer">
                    <Upload className="w-10 h-10 text-green-500" />
                    <span className="mt-2 text-sm">
                      Upload up to 5 images
                    </span>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImages}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {previews.map((src, index) => (
                      <div
                        key={index}
                        className="relative rounded-2xl overflow-hidden"
                      >
                        <img
                          src={src}
                          alt="preview"
                          className="h-32 w-full object-cover"
                        />

                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full mt-6 bg-green-400 text-white py-4 rounded-2xl font-semibold"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-2xl font-bold">
                    Select Scrap Categories
                  </h1>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {form.categories.map((cat) => (
                      <span
                        key={cat}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {CATEGORY_CONFIG.map((item) => {
                      const selected = form.categories.includes(
                        item.id as ScrapCategory
                      );

                      const Icon = item.icon;

                      return (
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          key={item.id}
                          onClick={() =>
                            toggleCategory(item.id as ScrapCategory)
                          }
                          className={`relative rounded-2xl border p-4 shadow-sm ${
                            selected
                              ? "bg-green-100 border-green-400"
                              : "bg-white"
                          }`}
                        >
                          {selected && (
                            <Check className="absolute right-3 top-3 text-green-600" />
                          )}

                          <Icon className="mx-auto mb-3" />

                          <p>{item.label}</p>
                        </motion.button>
                      );
                    })}
                  </div>

                  <p className="text-sm text-gray-500 mt-5">
                    You can select multiple categories. Final pricing will be
                    determined after physical inspection.
                  </p>

                  <button
                    onClick={nextStep}
                    className="w-full mt-6 bg-green-400 text-white py-4 rounded-2xl font-semibold"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-2xl font-bold">
                    Pickup Details
                  </h1>

                  <div className="space-y-4 mt-6">
                    <input
                      placeholder="Estimated Weight (kg)"
                      className="w-full rounded-2xl border p-4"
                      value={form.weight}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          weight: e.target.value,
                        }))
                      }
                    />

                    <div className="rounded-3xl bg-white border border-gray-200 p-4 shadow-sm mb-4">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold">
        Pickup Location
      </h3>

      <p className="text-sm text-gray-500">
        {`${form.latitude?`${form.latitude}, ${form.longitude}`:"Tap anywhere on the map to drop a pin"}`}
      </p>
    </div>
    
  </div>
</div>

{isLoaded && (
  <div className="overflow-hidden rounded-3xl border border-gray-200">
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "320px",
      }}
      center={pinLocation}
      zoom={15}
      onClick={(e) => {
        if (!e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setPinLocation({
          lat,
          lng,
        });

        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker
        draggable
        position={pinLocation}
        onDragEnd={(e) => {
          if (!e.latLng) return;

          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          setPinLocation({
            lat,
            lng,
          });

          setForm((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        }}
      />
    </GoogleMap>
  </div>
)}

                   
                    <input
                      placeholder="Pincode"
                      className="w-full rounded-2xl border p-4"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          pincode: e.target.value,
                        }))
                      }
                    />

                    <input
                      placeholder="Landmark (Optional)"
                      className="w-full rounded-2xl border p-4"
                      value={form.landmark}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          landmark: e.target.value,
                        }))
                      }
                    />

                    <div className="relative">
  <button
    type="button"
    onClick={() => setShowCalendar(!showCalendar)}
    className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
  >
    <span>
      {selectedDate
        ? selectedDate.toLocaleDateString()
        : "Select Pickup Date"}
    </span>

    <CalendarDays size={20} />
  </button>

  <AnimatePresence>
    {showCalendar && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-50 mt-3 rounded-3xl bg-white p-4 shadow-xl border border-gray-100"
      >
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);

            setForm((prev) => ({
              ...prev,
              pickupDate: date?.toISOString() ?? "",
            }));
          }}
          disabled={{
            before: new Date(),
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
</div>

                    <div>
                      <label className="block mb-3 font-medium">
                        Time Slot
                      </label>

                      <div className="grid gap-3">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            onClick={() =>
                              setForm((p) => ({
                                ...p,
                                timeSlot: slot,
                              }))
                            }
                            className={`rounded-2xl border p-4 text-left ${
                              form.timeSlot === slot
                                ? "bg-green-100 border-green-400"
                                : ""
                            }`}
                          >
                            <Calendar className="inline mr-2" size={18} />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={publishRequest}
                      className="w-full bg-green-400 text-white py-4 rounded-2xl font-semibold"
                    >
                      Publish Request
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

