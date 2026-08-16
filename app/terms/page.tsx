// app/terms/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — Recycler Club",
  description: "Terms and Conditions governing use of the Recycler Club (ScrapSeva) platform.",
};

const EFFECTIVE_DATE = "9 August 2026";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-(--color-line) py-8 first:border-none first:pt-0">
      <h2 className="font-serif text-xl font-semibold text-(--color-ink)">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-(--color-ink-soft)">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-(--color-bg) px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-accent)">
          Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-(--color-ink) sm:text-4xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-(--color-ink-soft)">
          Effective date: {EFFECTIVE_DATE}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-(--color-ink-soft)">
          These Terms and Conditions ("Terms") govern access to and use of the Recycler Club
          website, mobile applications, and related services (together, the "Platform"),
          operated under the brand ScrapSeva. The Platform is provided by Recycler Club
          ("Recycler Club", "Company", "we", "us", or "our"), based in Dehradun, Uttarakhand,
          India. By creating an account, booking a pickup, or otherwise using the Platform,
          you ("you" or "User") agree to be bound by these Terms. If you do not agree, please
          do not use the Platform.
        </p>

        <div className="mt-8 rounded-2xl border border-(--color-line) bg-(--color-bg-card) p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-primary)">
            On this page
          </p>
          <nav className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {[
              ["definitions", "1. Definitions"],
              ["eligibility", "2. Eligibility & account registration"],
              ["how-it-works", "3. How the service works"],
              ["pricing", "4. Pricing, weighing & valuation"],
              ["prohibited-items", "5. Prohibited & restricted items"],
              ["wallet", "6. Wallet, payments & withdrawals"],
              ["cancellation", "7. Cancellations & no-shows"],
              ["business-accounts", "8. Business & government accounts"],
              ["conduct", "9. User conduct"],
              ["ip", "10. Intellectual property"],
              ["third-party", "11. Third-party partners"],
              ["disclaimers", "12. Disclaimers"],
              ["liability", "13. Limitation of liability"],
              ["indemnity", "14. Indemnification"],
              ["suspension", "15. Suspension & termination"],
              ["privacy", "16. Privacy"],
              ["changes", "17. Changes to these Terms"],
              ["governing-law", "18. Governing law & dispute resolution"],
              ["grievance", "19. Grievance officer"],
              ["contact", "20. Contact us"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-(--color-accent) hover:underline"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <Section id="definitions" title="1. Definitions">
          <p>
            <strong className="text-(--color-ink)">"Platform"</strong> means the Recycler Club
            website, mobile applications (iOS and Android), and any associated services offered
            under the ScrapSeva brand.
          </p>
          <p>
            <strong className="text-(--color-ink)">"Kabadiwala"</strong> or{" "}
            <strong className="text-(--color-ink)">"Partner"</strong> means an independent scrap
            collection agent or business onboarded onto the Platform to collect, weigh, and pay
            for scrap from Users.
          </p>
          <p>
            <strong className="text-(--color-ink)">"Pickup"</strong> means a scheduled visit by a
            Partner to a User's specified address to collect scrap material.
          </p>
          <p>
            <strong className="text-(--color-ink)">"Wallet"</strong> means the in-app ledger
            balance credited to a User's account following a completed Pickup, which may be
            withdrawn or used per Section 6.
          </p>
          <p>
            <strong className="text-(--color-ink)">"Scrap"</strong> means household or business
            waste material accepted by the Platform for collection, including but not limited to
            paper, cardboard, plastic, metal, and e-waste, subject to Section 5.
          </p>
        </Section>

        <Section id="eligibility" title="2. Eligibility & account registration">
          <p>
            You must be at least 18 years old and capable of entering into a legally binding
            contract under the Indian Contract Act, 1872 to register on the Platform. Accounts
            for businesses or government entities must be registered by an authorised
            representative of that entity.
          </p>
          <p>
            Registration requires a valid Indian mobile number, verified via a one-time password
            (OTP). You are responsible for maintaining the confidentiality of your account and
            for all activity that occurs under it. You must notify us immediately at{" "}
            <a href="mailto:support@recyclerclub.com" className="text-(--color-accent) hover:underline">
              support@recyclerclub.com
            </a>{" "}
            if you suspect unauthorised use of your account.
          </p>
          <p>
            You agree to provide accurate, current, and complete information during registration
            and to keep it updated, including your pickup address(es), phone number, and (where
            applicable) MSME or GST registration details.
          </p>
        </Section>

        <Section id="how-it-works" title="3. How the service works">
          <p>
            Users book a Pickup by selecting scrap categories and approximate quantities, a
            pickup address, and a preferred day and time window. A Partner is assigned to fulfil
            the request. The amount shown to the User before confirmation is an{" "}
            <strong className="text-(--color-ink)">estimate only</strong>, based on
            self-reported categories and quantities.
          </p>
          <p>
            At the time of Pickup, the Partner will weigh the scrap using a calibrated scale in
            the User's presence. The final payout is based on the actual weighed quantity and the
            applicable rate for that category on the day of Pickup, which may differ from the
            estimate shown at booking. Rates fluctuate with market conditions for recyclable
            materials and are set or updated by Recycler Club or its Partners from time to time.
          </p>
          <p>
            The User may decline to proceed with the Pickup if they do not agree with the
            weighed value or final rate, before any payment is made.
          </p>
        </Section>

        <Section id="pricing" title="4. Pricing, weighing & valuation">
          <p>
            All prices are quoted in Indian Rupees (₹). Category rates displayed on the Platform
            are indicative and subject to change without prior notice, reflecting prevailing
            market rates for recyclable materials in the Partner's operating area.
          </p>
          <p>
            Recycler Club does not guarantee that the estimated value shown at booking will match
            the final weighed value. Users are entitled to observe the weighing process and
            request a printed or digital slip recording the weighed quantity, category, rate
            applied, and total payout for each Pickup.
          </p>
        </Section>

        <Section id="prohibited-items" title="5. Prohibited & restricted items">
          <p>
            The following items may not be submitted for Pickup: hazardous or medical waste,
            biological or infectious material, explosive or flammable substances, radioactive
            material, wet or organic kitchen waste, stolen goods, and any item whose sale or
            transfer is restricted or prohibited under applicable Indian law.
          </p>
          <p>
            E-waste (electronics, batteries, CFL/tube lights) is accepted but must be presented
            separately from other categories, as it is handled and disposed of through
            authorised e-waste recycling channels in compliance with the E-Waste (Management)
            Rules, 2022. Partners reserve the right to refuse collection of any item that appears
            to violate this Section or that they reasonably believe is unsafe to handle.
          </p>
        </Section>

        <Section id="wallet" title="6. Wallet, payments & withdrawals">
          <p>
            Payouts for completed Pickups are made either as instant cash paid by the Partner at
            the time of collection, or credited to the User's in-app Wallet, at the User's
            selection during checkout where both options are available in their area.
          </p>
          <p>
            Wallet balances may be withdrawn to a linked bank account or UPI ID, subject to any
            minimum withdrawal threshold and processing timelines displayed in the app.
            Withdrawal requests are processed on a best-efforts basis and may take up to 5
            business days to reflect in the User's bank account, depending on the User's bank and
            payment rail processing times.
          </p>
          <p>
            Recycler Club maintains Wallet balances on a segregated, double-entry ledger basis.
            Wallet balances do not accrue interest and are not deposits within the meaning of any
            banking or financial regulation. Recycler Club reserves the right to withhold or
            reverse a Wallet credit that it reasonably believes resulted from fraud, error, or a
            violation of these Terms, and will notify the affected User of the reason.
          </p>
        </Section>

        <Section id="cancellation" title="7. Cancellations & no-shows">
          <p>
            Users may cancel or reschedule a Pickup at no charge up to 2 hours before the start
            of the selected time window, using the app. Cancellations made after this window, or
            repeated unavailability of the User at the scheduled address ("no-shows"), may result
            in the booking being marked incomplete and, for repeated no-shows, in temporary
            restriction of the User's ability to book further Pickups.
          </p>
          <p>
            Recycler Club or the assigned Partner may cancel or reschedule a Pickup due to
            weather, safety concerns, Partner unavailability, or other operational reasons, and
            will make reasonable efforts to notify the User promptly and offer an alternative
            slot.
          </p>
        </Section>

        <Section id="business-accounts" title="8. Business & government accounts">
          <p>
            Users registering as a business or government entity confirm that the MSME
            registration number, GST number, and any other credentials submitted are accurate
            and belong to the entity on whose behalf the account is operated. Recycler Club may
            request supporting documentation to verify these details before enabling
            business-specific features such as bulk pickup scheduling or recurring contracts.
          </p>
          <p>
            Business and government accounts remain subject to all other provisions of these
            Terms, including those governing pricing, prohibited items, and payment.
          </p>
        </Section>

        <Section id="conduct" title="9. User conduct">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Provide false information about the category, quantity, or condition of scrap offered for Pickup.</li>
            <li>Submit any prohibited or restricted item described in Section 5.</li>
            <li>Threaten, harass, or behave abusively toward a Partner or Recycler Club staff.</li>
            <li>Use the Platform for any unlawful purpose, including money laundering or the disposal of stolen property.</li>
            <li>Attempt to circumvent, disable, or otherwise interfere with the security or proper functioning of the Platform.</li>
            <li>Reverse-engineer, scrape, or extract data from the Platform except as permitted by applicable law.</li>
          </ul>
          <p>
            Violation of this Section may result in suspension or termination of your account
            under Section 15, in addition to any other remedy available to Recycler Club under
            law.
          </p>
        </Section>

        <Section id="ip" title="10. Intellectual property">
          <p>
            The Platform, including its name, logo, design, text, graphics, and underlying
            software, is owned by or licensed to Recycler Club and is protected under Indian
            copyright, trademark, and other intellectual property laws. You are granted a
            limited, non-exclusive, non-transferable, revocable licence to use the Platform for
            its intended personal or business purpose. No other rights are granted.
          </p>
        </Section>

        <Section id="third-party" title="11. Third-party partners">
          <p>
            Pickups are fulfilled by independent Kabadiwala Partners, who are not employees or
            agents of Recycler Club. Recycler Club facilitates the connection between Users and
            Partners and the associated payment flow, but the collection service itself is
            provided by the Partner. Recycler Club conducts onboarding checks on Partners but
            does not guarantee the conduct of any individual Partner beyond what is set out in
            these Terms.
          </p>
        </Section>

        <Section id="disclaimers" title="12. Disclaimers">
          <p>
            The Platform is provided on an "as is" and "as available" basis. To the maximum
            extent permitted by applicable law, Recycler Club disclaims all warranties, express
            or implied, including warranties of merchantability, fitness for a particular
            purpose, and non-infringement. We do not warrant that the Platform will be
            uninterrupted, error-free, or that Pickups will always occur exactly as scheduled.
          </p>
        </Section>

        <Section id="liability" title="13. Limitation of liability">
          <p>
            To the maximum extent permitted by applicable law, Recycler Club's total liability
            to a User arising out of or relating to these Terms or the Platform, whether in
            contract, tort, or otherwise, shall not exceed the greater of (a) the total amount
            paid or payable by Recycler Club to that User for Pickups in the 3 months preceding
            the claim, or (b) ₹5,000. Recycler Club shall not be liable for indirect,
            incidental, special, or consequential damages, including loss of profit or data,
            arising from use of the Platform.
          </p>
          <p>
            Nothing in these Terms limits liability for fraud, wilful misconduct, or death or
            personal injury caused by negligence, to the extent such limitation is not permitted
            under applicable Indian law.
          </p>
        </Section>

        <Section id="indemnity" title="14. Indemnification">
          <p>
            You agree to indemnify and hold harmless Recycler Club, its officers, employees, and
            Partners from any claim, loss, liability, or expense (including reasonable legal
            fees) arising out of your breach of these Terms, your violation of applicable law, or
            your submission of prohibited or misrepresented items for Pickup.
          </p>
        </Section>

        <Section id="suspension" title="15. Suspension & termination">
          <p>
            Recycler Club may suspend or terminate your access to the Platform, with or without
            notice, if you breach these Terms, engage in fraudulent or abusive conduct, or if
            required to do so by law. You may close your account at any time by contacting{" "}
            <a href="mailto:support@recyclerclub.com" className="text-(--color-accent) hover:underline">
              support@recyclerclub.com
            </a>
            . Any Wallet balance owed to you at the time of closure will be settled to your
            linked bank account or UPI ID, subject to Section 6, unless the account is terminated
            for fraud or violation of these Terms, in which case Recycler Club may withhold
            settlement pending investigation.
          </p>
        </Section>

        <Section id="privacy" title="16. Privacy">
          <p>
            Our collection and use of your personal information is described in our{" "}
            <Link href="/privacy" className="text-(--color-accent) hover:underline">
              Privacy Policy
            </Link>
            , which forms part of these Terms by reference.
          </p>
        </Section>

        <Section id="changes" title="17. Changes to these Terms">
          <p>
            We may update these Terms from time to time to reflect changes in our services or
            applicable law. Where a change is material, we will notify you through the app or by
            SMS/email before it takes effect. Continued use of the Platform after a change
            becomes effective constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section id="governing-law" title="18. Governing law & dispute resolution">
          <p>
            These Terms are governed by the laws of India. Subject to Section 19, any dispute
            arising out of or in connection with these Terms shall first be addressed through
            good-faith negotiation between the parties. If unresolved within 30 days, the dispute
            shall be referred to arbitration under the Arbitration and Conciliation Act, 1996,
            seated in Dehradun, Uttarakhand, conducted in English by a sole arbitrator appointed
            by mutual agreement. The courts at Dehradun, Uttarakhand shall have exclusive
            jurisdiction over matters not subject to arbitration.
          </p>
        </Section>

        <Section id="grievance" title="19. Grievance officer">
          <p>
            In accordance with the Information Technology Act, 2000 and rules made thereunder,
            the name and contact details of the Grievance Officer are published in the app under
            Settings → Support, and are also available on request at{" "}
            <a href="mailto:grievance@recyclerclub.com" className="text-(--color-accent) hover:underline">
              grievance@recyclerclub.com
            </a>
            . The Grievance Officer will acknowledge complaints within 24 hours and resolve them
            within 15 days, as required by law.
          </p>
        </Section>

        <Section id="contact" title="20. Contact us">
          <p>
            For questions about these Terms, reach us at{" "}
            <a href="mailto:support@recyclerclub.com" className="text-(--color-accent) hover:underline">
              support@recyclerclub.com
            </a>{" "}
            or through the{" "}
            <Link href="/contact-us" className="text-(--color-accent) hover:underline">
              Contact Us
            </Link>{" "}
            page in the app. Recycler Club is based in Dehradun, Uttarakhand, India.
          </p>
        </Section>
      </div>
    </main>
  );
}