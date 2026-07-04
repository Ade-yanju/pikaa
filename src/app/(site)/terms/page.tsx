import type { Metadata } from "next";
import Article from "@/components/Article";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = { title: "Terms of Service — Pickar" };

export default function TermsPage() {
  return (
    <Article title="Terms of Service" updated="July 4, 2026">
      <p>
        These Terms of Service (“Terms”) govern your access to and use of Pickar.
        By creating an account or using our Services, you agree to these Terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old and legally able to enter into a
        contract. You are responsible for complying with the laws that apply to
        you in your country of residence.
      </p>

      <h2>2. Your account</h2>
      <p>
        You register with a valid email and verify it with a one-time code. You
        agree to provide accurate information and to keep your account secure.
        One account is permitted per email address. You are responsible for
        activity that occurs under your account.
      </p>

      <h2>3. Our services</h2>
      <ul>
        <li><strong>Global payouts</strong> — we help you receive payments through our company receiving accounts and facilitate settlement to you.</li>
        <li><strong>Gift-card exchange</strong> — we purchase eligible gift cards at rates quoted by our support team.</li>
        <li><strong>Cryptocurrency trades</strong> — we facilitate the buying and selling of supported assets at quoted rates.</li>
        <li><strong>Escrow</strong> — we can hold funds securely between parties until agreed conditions are met.</li>
      </ul>
      <p>
        Rates, fees and eligibility are confirmed by our support team in chat
        before any transaction is completed.
      </p>

      <h2>4. Fees</h2>
      <p>
        Escrow carries a flat 5% fee on project volume. Gift-card and crypto
        rates vary with brand, asset and market conditions and are quoted before
        you confirm. You will always see the applicable payout before proceeding.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to use Pickar to:</p>
      <ul>
        <li>submit funds, cards or assets that are stolen, fraudulent, or obtained illegally;</li>
        <li>launder money or finance illegal activity;</li>
        <li>impersonate others or provide false information;</li>
        <li>abuse, harass or defraud our staff or other users.</li>
      </ul>
      <p>
        We may refuse, suspend or reverse any transaction we reasonably believe
        violates these Terms or the law.
      </p>

      <h2 id="aml">6. AML &amp; KYC</h2>
      <p>
        To comply with anti-money-laundering (AML) and know-your-customer (KYC)
        obligations, we may verify your identity and the source of funds or
        assets, and may report suspicious activity to the relevant authorities.
        Providing false verification information is grounds for termination.
      </p>

      <h2>7. Risk disclosure</h2>
      <p>
        Cryptocurrency values are volatile and transactions are generally
        irreversible. You are responsible for confirming wallet addresses and
        trade details. Quoted rates are valid only for the window communicated by
        support.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        The Services are provided “as is”. To the maximum extent permitted by
        law, Pickar is not liable for indirect or consequential losses. Nothing
        in these Terms limits liability that cannot be limited by law.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may stop using the Services at any time. We may suspend or terminate
        accounts that violate these Terms or that we are legally required to
        restrict.
      </p>

      <h2>10. Changes and contact</h2>
      <p>
        We may update these Terms; continued use after changes constitutes
        acceptance. Questions? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </Article>
  );
}
