import Image from "next/image";

// What we pay for typical jobs, at today's card rates. Swap this for a real
// "recent pickups" feed once there are enough completed jobs to fill it.
const PICKUPS = [
  { img: "/hero/car.webp", item: "Hatchback car", amount: "₹18,000" },
  { img: "/take/cooling.webp", item: "Split AC, 1.5 ton", amount: "₹3,999" },
  { img: "/take/kitchen.webp", item: "Double-door fridge", amount: "₹1,100" },
  { img: "/take/office.webp", item: "6 monitors + 4 CPUs", amount: "₹2,320" },
  { img: "/hero/scrap.webp", item: "Copper, 40 kg", amount: "₹22,000" },
  { img: "/hero/appliances.webp", item: "Front-load washer", amount: "₹900" },
  { img: "/hero/ewaste.webp", item: "LED TV + microwave", amount: "₹600" },
];

export default function PickupTicker() {
  return (
    <div className="ticker-mask overflow-hidden bg-(--color-primary-dark) py-1.5">
      {/* Two copies back to back: the track slides one copy's width, then
          snaps back to the start, which looks seamless. */}
      <div className="ticker-track flex w-max gap-8 hover:[animation-play-state:paused]">
        {[...PICKUPS, ...PICKUPS].map((p, i) => (
          <div
            key={i}
            aria-hidden={i >= PICKUPS.length}
            className="flex shrink-0 items-center gap-2.5 text-sm"
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/20">
              <Image src={p.img} alt="" fill sizes="28px" className="object-cover" />
            </span>
            <span className="text-white/85">{p.item}</span>
            <span className="font-semibold text-(--color-accent)">{p.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
