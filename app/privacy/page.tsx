// app/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Recycler Club",
  description: "How Recycler Club (ScrapSeva) collects, uses, and protects your personal information.",
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-(--color-bg) px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-accent)">
          Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-(--color-ink) sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-(--color-ink-soft)">
          Effective date: {EFFECTIVE_DATE}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-(--color-ink-soft)">
          Recycler Club ("Recycler Club", "Company", "we", "us", or "our") operates the ScrapSeva
          platform, based in Dehradun, Uttarakhand, India. This Privacy Policy explains what
          personal information we collect through our website and mobile applications (the
          "Platform"), how we use and share it, and the choices available to you. This Policy is
          consistent with the Digital Personal Data Protection Act, 2023 and related Indian law.
          By using the Platform, you consent to the practices described here.
        </p>

        <div className="mt-8 rounded-2xl border border-(--color-line) bg-(--color-bg-card) p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-primary)">
            On this page
          </p>
          <nav className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {[
              ["information-we-collect", "1. Information we collect"],
              ["how-we-collect", "2. How we collect information"],
              ["how-we-use", "3. How we use your information"],
              ["legal-basis", "4. Legal basis for processing"],
              ["sharing", "5. Who we share information with"],
              ["location", "6. Location data"],
              ["payments", "7. Payments & wallet data"],
              ["retention", "8. Data retention"],
              ["security", "9. Data security"],
              ["rights", "10. Your rights"],
              ["cookies", "11. Cookies & similar technologies"],
              ["children", "12. Children's privacy"],
              ["transfers", "13. Cross-border data transfer"],
              ["third-party-links", "14. Third-party links"],
              ["changes", "15. Changes to this Policy"],
              ["grievance", "16. Grievance officer"],
              ["contact", "17. Contact us"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-(--color-accent) hover:underline">
                {label}
              </a>
            ))}
          </nav>
        </div>

        <Section id="information-we-collect" title="1. Information we collect">
          <p>
            <strong className="text-(--color-ink)">Account information:</strong> mobile number,
            username, email address (optional), and account type (individual, business, or
            government entity).
          </p>
          <p>
            <strong className="text-(--color-ink)">Business details (where applicable):</strong>{" "}
            MSME registration number and GST number.
          </p>
          <p>
            <strong className="text-(--color-ink)">Address & location:</strong> pickup addresses
            you save, including labelled address (home/office/other), full address text,
            pincode, city, and precise latitude/longitude captured via your device's location
            services when you add or confirm a pickup address.
          </p>
          <p>
            <strong className="text-(--color-ink)">Transaction information:</strong> pickup
            history, scrap categories and weighed quantities, rates applied, payout amounts,
            Wallet balance, Wallet transaction history, and withdrawal requests including linked
            bank account or UPI details.
          </p>
          <p>
            <strong className="text-(--color-ink)">Communications:</strong> messages you send us
            through Contact Us, support chat, or customer service calls, and records of those
            interactions.
          </p>
          <p>
            <strong className="text-(--color-ink)">Device & usage information:</strong> IP
            address, device identifiers, operating system and app version, and general usage
            data such as pages viewed and features used, collected automatically when you use the
            Platform.
          </p>
        </Section>

        <Section id="how-we-collect" title="2. How we collect information">
          <p>
            We collect information you provide directly (during registration, booking a Pickup,
            adding an address, or contacting support), information generated automatically as you
            use the Platform, and information from our Kabadiwala Partners about completed
            Pickups (such as the weighed quantity and category of scrap collected).
          </p>
        </Section>

        <Section id="how-we-use" title="3. How we use your information">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>To create and maintain your account, and verify your identity via OTP.</li>
            <li>To schedule, assign, and fulfil Pickups, including sharing your pickup address and time window with the assigned Partner.</li>
            <li>To calculate, credit, and process payouts and Wallet withdrawals.</li>
            <li>To provide customer support and respond to your enquiries or complaints.</li>
            <li>To detect, investigate, and prevent fraud, abuse, or violations of our Terms & Conditions.</li>
            <li>To send service-related communications, such as booking confirmations, OTPs, and pickup status updates via SMS, email, or push notification.</li>
            <li>To improve the Platform, including analysing usage patterns and troubleshooting technical issues.</li>
            <li>To comply with applicable legal and regulatory obligations, including tax and accounting requirements.</li>
          </ul>
          <p>
            We do not sell your personal information to third parties for their own marketing
            purposes.
          </p>
        </Section>

        <Section id="legal-basis" title="4. Legal basis for processing">
          <p>
            We process your personal information on the basis of your consent (given when you
            register and use the Platform), the necessity of processing to perform our contract
            with you (fulfilling Pickups and payments), and, in limited circumstances, our
            legitimate interest in operating and securing the Platform or our compliance with
            legal obligations. You may withdraw consent at any time as described in Section 10,
            though this may limit your ability to use certain features.
          </p>
        </Section>

        <Section id="sharing" title="5. Who we share information with">
          <p>
            <strong className="text-(--color-ink)">Kabadiwala Partners:</strong> your name/label,
            pickup address, and contact number are shared with the Partner assigned to your
            Pickup, solely to enable them to reach you and complete the collection.
          </p>
          <p>
            <strong className="text-(--color-ink)">Payment processors:</strong> Wallet withdrawal
            requests involve sharing relevant bank account or UPI details with our payment
            processing partners to complete the transfer.
          </p>
          <p>
            <strong className="text-(--color-ink)">Service providers:</strong> we engage
            third-party providers for cloud hosting, SMS/OTP delivery, analytics, and customer
            support tooling, who process data on our behalf under contractual confidentiality and
            security obligations.
          </p>
          <p>
            <strong className="text-(--color-ink)">Legal & regulatory disclosures:</strong> we may
            disclose information where required by law, court order, or governmental request, or
            to protect the rights, property, or safety of Recycler Club, our Users, or the
            public.
          </p>
          <p>
            <strong className="text-(--color-ink)">Business transfers:</strong> if Recycler Club
            is involved in a merger, acquisition, or sale of assets, User information may be
            transferred as part of that transaction, subject to this Policy continuing to apply.
          </p>
        </Section>

        <Section id="location" title="6. Location data">
          <p>
            We collect precise location data only when you actively add or confirm a pickup
            address, using your device's "share current location" feature. This location is used
            solely to help Partners find your address accurately and is stored as part of that
            saved address. We do not track your location in the background or outside of this
            address-capture flow.
          </p>
        </Section>

        <Section id="payments" title="7. Payments & wallet data">
          <p>
            Wallet balances are recorded on an internal ledger. We retain transaction and
            withdrawal records as required for accounting, tax, and audit purposes under Indian
            law, even after an account is closed, for the period described in Section 8. Bank
            account and UPI details you provide for withdrawal are used only to process that
            withdrawal and are handled in accordance with applicable payment industry security
            standards.
          </p>
        </Section>

        <Section id="retention" title="8. Data retention">
          <p>
            We retain account and transaction information for as long as your account is active,
            and for up to 8 years after account closure or your last transaction, to meet
            statutory recordkeeping obligations under Indian tax, accounting, and consumer
            protection law. Location data tied to a saved address is retained until you delete
            that address or close your account. We may retain limited information beyond these
            periods where necessary to resolve disputes, enforce our agreements, or comply with
            legal obligations.
          </p>
        </Section>

        <Section id="security" title="9. Data security">
          <p>
            We use industry-standard technical and organisational measures to protect your
            personal information, including encryption of data in transit, access controls
            limiting internal access to personal data on a need-to-know basis, and secure storage
            of authentication tokens. No method of transmission or storage is completely secure;
            while we work to protect your information, we cannot guarantee absolute security.
          </p>
        </Section>

        <Section id="rights" title="10. Your rights">
          <p>Subject to applicable law, you have the right to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Access the personal information we hold about you.</li>
            <li>Correct inaccurate or incomplete information, including through the Edit Profile screen.</li>
            <li>Request deletion of your account and associated personal information, subject to our retention obligations under Section 8.</li>
            <li>Withdraw consent to processing that is based on consent, which may limit your ability to use the Platform.</li>
            <li>Register a complaint regarding our handling of your personal information with our Grievance Officer (Section 16), and thereafter with the Data Protection Board of India where applicable.</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@recyclerclub.com" className="text-(--color-accent) hover:underline">
              privacy@recyclerclub.com
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        <Section id="cookies" title="11. Cookies & similar technologies">
          <p>
            Our website uses cookies and similar technologies to keep you signed in, remember
            your preferences, and understand how the Platform is used, through analytics tools.
            You can control cookies through your browser settings; disabling cookies may affect
            some website functionality. Our mobile apps use comparable device-level identifiers
            for the same purposes rather than browser cookies.
          </p>
        </Section>

        <Section id="children" title="12. Children's privacy">
          <p>
            The Platform is not directed to individuals under 18 years of age, and we do not
            knowingly collect personal information from children. If we become aware that we have
            collected personal information from a child without appropriate consent, we will take
            steps to delete it.
          </p>
        </Section>

        <Section id="transfers" title="13. Cross-border data transfer">
          <p>
            Your information is primarily stored and processed on servers located in India.
            Where we engage service providers located outside India (for example, certain cloud
            infrastructure or analytics providers), we take steps to ensure they provide an
            adequate level of protection for your personal information, consistent with the
            Digital Personal Data Protection Act, 2023.
          </p>
        </Section>

        <Section id="third-party-links" title="14. Third-party links">
          <p>
            The Platform may contain links to third-party websites or services that are not
            operated by us. This Policy does not apply to those third parties, and we encourage
            you to review their privacy policies separately.
          </p>
        </Section>

        <Section id="changes" title="15. Changes to this Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices or applicable law. Where a change is material, we will notify you through
            the app or by SMS/email before it takes effect. The "Effective date" at the top of
            this page indicates when it was last revised.
          </p>
        </Section>

        <Section id="grievance" title="16. Grievance officer">
          <p>
            In accordance with the Information Technology Act, 2000, the Digital Personal Data
            Protection Act, 2023, and rules made thereunder, the name and contact details of our
            Grievance Officer are published in the app under Settings → Support, and are also
            available on request at{" "}
            <a href="mailto:grievance@recyclerclub.com" className="text-(--color-accent) hover:underline">
              grievance@recyclerclub.com
            </a>
            . The Grievance Officer will acknowledge complaints within 24 hours and resolve them
            within 15 days, as required by law.
          </p>
        </Section>

        <Section id="contact" title="17. Contact us">
          <p>
            For questions about this Privacy Policy or to exercise your rights, reach us at{" "}
            <a href="mailto:privacy@recyclerclub.com" className="text-(--color-accent) hover:underline">
              privacy@recyclerclub.com
            </a>{" "}
            or through the{" "}
            <Link href="/contact-us" className="text-(--color-accent) hover:underline">
              Contact Us
            </Link>{" "}
            page in the app. Recycler Club is based in Dehradun, Uttarakhand, India. Our{" "}
            <Link href="/terms" className="text-(--color-accent) hover:underline">
              Terms & Conditions
            </Link>{" "}
            apply alongside this Policy.
          </p>
        </Section>
      </div>
    </main>
  );
}