import Image from "next/image";

// Illustrative, and labelled as such on the page: the kind of job we take and
// what it pays at today's card rates. Swap this for a real "recent pickups"
// feed once there are enough completed jobs to fill it.
const PICKUPS = [
  { img: "/hero/car.webp", item: "Hatchback car", area: "Rajpur Road", amount: "₹18,000" },
  { img: "/take/cooling.webp", item: "Split AC, 1.5 ton", area: "Prem Nagar", amount: "₹3,999" },
  { img: "/take/kitchen.webp", item: "Double-door fridge", area: "Clement Town", amount: "₹1,100" },
  { img: "/take/office.webp", item: "6 monitors + 4 CPUs", area: "Sahastradhara Road", amount: "₹2,320" },
  { img: "/hero/scrap.webp", item: "Copper, 40 kg", area: "Selaqui", amount: "₹22,000" },
  { img: "/hero/appliances.webp", item: "Front-load washer", area: "Ballupur", amount: "₹900" },
  { img: "/hero/ewaste.webp", item: "LED TV + microwave", area: "Kaulagarh", amount: "₹600" },
];

export default function PickupTicker() {
  return (
    <section
      aria-label="Example pickups"
      className="relative border-y border-(--color-line) bg-white py-4"
    >
      <div className="flex items-center gap-4">
        <span className="z-10 ml-5 shrink-0 rounded-full bg-(--color-bg-deep) px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-(--color-primary-dark) sm:ml-8 lg:ml-10">
          Example pickups
        </span>

        <div className="ticker-mask relative flex-1 overflow-hidden">
          {/* Two copies back to back: the track slides one copy's width, then
              snaps back to the start, which looks seamless. */}
          <div className="ticker-track flex w-max gap-3 hover:[animation-play-state:paused]">
            {[...PICKUPS, ...PICKUPS].map((p, i) => (
              <div
                key={i}
                aria-hidden={i >= PICKUPS.length}
                className="flex shrink-0 items-center gap-3 rounded-full border border-(--color-line) bg-(--color-bg) py-1.5 pl-1.5 pr-5"
              >
                <span className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={p.img} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-(--color-ink)">{p.item}</span>
                  <span className="block text-xs text-(--color-ink-soft)">{p.area}</span>
                </span>
                <span className="ml-1 text-sm font-semibold text-(--color-primary)">{p.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
