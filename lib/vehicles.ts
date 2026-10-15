// Vehicle-model lines on the rate card: which categories they live in, and how
// to read a brand and a body type off them. Shared by booking and the hero.

export const VEHICLE_CATEGORIES = ["Cars & SUVs", "Two-wheelers", "Commercial vehicles"];

// Manufacturer as it prefixes the item name -> the brand a customer knows.
// ponytail: duplicated from the backend's vehicle CSV because the API has no
// brand field; add one to ScrapItem and read it here if this list drifts.
export const BRAND_PREFIXES: [string, string][] = [
  ["Maruti Suzuki", "Maruti Suzuki"], ["Mahindra & Mahindra", "Mahindra"], ["Mahindra Reva", "Mahindra"],
  ["Hyundai", "Hyundai"], ["Tata Motors (Telco)", "Tata"], ["Tata Motors", "Tata"],
  ["Toyota Kirloskar", "Toyota"], ["DCM Toyota", "Toyota"],
  ["General Motors (Chevrolet)", "Chevrolet"], ["General Motors (Opel)", "Opel"],
  ["Honda Motorcycle & Scooter India", "Honda"], ["Honda", "Honda"],
  ["Hero Honda / Hero MotoCorp", "Hero"], ["Hero Honda", "Hero"], ["Hero MotoCorp", "Hero"], ["Hero Motors", "Hero"],
  ["Ford India", "Ford"], ["Renault", "Renault"], ["Skoda", "Skoda"], ["Volkswagen", "Volkswagen"],
  ["Fiat (PAL / Fiat India)", "Fiat"], ["Fiat India", "Fiat"],
  ["Hindustan Motors (Mitsubishi)", "Hindustan Motors"], ["Hindustan Motors", "Hindustan Motors"],
  ["Kia India", "Kia"], ["MG Motor India", "MG"], ["Datsun (Nissan)", "Datsun"],
  ["Allwyn Nissan", "Nissan"], ["Nissan", "Nissan"], ["Citroen", "Citroen"], ["Daewoo", "Daewoo"],
  ["Bajaj Tempo / Force Motors", "Force"], ["Bajaj Tempo", "Force"], ["Force Motors", "Force"],
  ["Isuzu", "Isuzu"], ["Jeep (FCA/Stellantis)", "Jeep"], ["Mercedes-Benz India", "Mercedes-Benz"],
  ["Premier Automobiles", "Premier"], ["Premier", "Premier"], ["Sipani Automobiles", "Sipani"],
  ["Standard Motor Products", "Standard"], ["Audi India", "Audi"], ["BMW India", "BMW"], ["BYD", "BYD"],
  ["Peugeot (PAL)", "Peugeot"], ["Tesla", "Tesla"],
  ["Bajaj Auto (Kawasaki)", "Bajaj"], ["Bajaj Auto", "Bajaj"], ["Royal Enfield", "Royal Enfield"],
  ["TVS-Suzuki", "TVS"], ["TVS Motor", "TVS"], ["Yamaha India", "Yamaha"], ["Escorts Yamaha", "Yamaha"],
  ["Escorts", "Escorts"], ["LML", "LML"], ["Ideal Jawa", "Jawa / Yezdi"], ["Classic Legends", "Jawa / Yezdi"],
  ["Kinetic Engineering", "Kinetic"], ["Kinetic Honda", "Kinetic"], ["Suzuki Motorcycle India", "Suzuki"],
  ["Ather Energy", "Ather"], ["Ola Electric", "Ola"], ["Revolt", "Revolt"], ["Scooters India", "Scooters India"],
  ["Ashok Leyland", "Ashok Leyland"], ["Eicher Motors (Mitsubishi)", "Eicher"], ["Piaggio Vehicles", "Piaggio"],
  ["Swaraj Mazda", "Swaraj Mazda"],
].sort((a, b) => b[0].length - a[0].length) as [string, string][];

/** "Maruti Suzuki Alto K10" -> { brand: "Maruti Suzuki", model: "Alto K10" } */
export function splitBrand(name: string) {
  for (const [prefix, brand] of BRAND_PREFIXES) {
    if (name.startsWith(prefix + " ")) return { brand, model: name.slice(prefix.length + 1) };
  }
  return { brand: "Other", model: name };
}


/** The body type load_vehicle_models writes first in the description:
 * "SUV (EV) · 2022-present · ..." -> "SUV". EVs fold into their body type, so
 * picking SUV shows electric SUVs too rather than a near-empty "SUV (EV)". */
export function bodyType(description: string | null | undefined) {
  const first = (description ?? "").split(" · ")[0].trim();
  return first.replace(/\s*\((EV|CNG)\)$/, "") || "Other";
}
