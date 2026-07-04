import type { Metadata } from "next";
import Article from "@/components/Article";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = { title: "Privacy Policy — Pickar" };

export default function PrivacyPage() {
  return (
    <Article title="Privacy Policy" updated="July 4, 2026">
      <p>
        This Privacy Policy explains how Pickar (“we”, “us”, “our”) collects,
        uses, protects and shares your information when you use our website,
        dashboard and support services (the “Services”). By using Pickar, you
        agree to the practices described here.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account information</strong> — your name, email address, country and (optionally) phone number provided at registration.</li>
        <li><strong>Transaction information</strong> — payment-detail requests, gift-card sales and cryptocurrency trades you submit, including amounts, currencies and status.</li>
        <li><strong>Sensitive trade details</strong> — gift-card codes and wallet addresses, which are <strong>encrypted</strong> before storage and only decrypted by authorized support staff to process your request.</li>
        <li><strong>Communications</strong> — messages, images and attachments you exchange with our support team.</li>
        <li><strong>Technical data</strong> — device, browser, and usage information, and notification tokens if you enable push notifications.</li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To create and secure your account and authenticate you (via one-time email codes).</li>
        <li>To process your payout requests, gift-card and crypto trades.</li>
        <li>To provide live support and send you service notifications.</li>
        <li>To prevent fraud, comply with legal obligations, and improve the Services.</li>
      </ul>

      <h2>3. How we protect your data</h2>
      <p>
        Data is transmitted over encrypted connections (TLS) and stored on
        infrastructure with encryption at rest. Especially sensitive fields are
        additionally encrypted at the application level (AES-256-GCM). Access to
        your data is restricted by row-level security so that no other customer
        can view your account, chats or trades.
      </p>

      <h2>4. Sharing and third parties</h2>
      <p>
        We do not sell your personal information. We share data only with service
        providers that help us operate — for example our database/authentication
        provider, transactional email provider, and image hosting — and only as
        needed to deliver the Services, or where required by law.
      </p>

      <h2>5. Data retention</h2>
      <p>
        We retain your information for as long as your account is active or as
        needed to provide the Services and meet legal, accounting or reporting
        requirements. You may request deletion of your account at any time.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Subject to applicable law, you may access, correct, export or delete your
        personal data, and object to certain processing. To exercise these
        rights, contact us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use essential cookies to keep you signed in and to secure your
        session. These are required for the dashboard to function.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be
        reflected by updating the “Last updated” date above.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about privacy? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </Article>
  );
}
