import type { Metadata } from "next";
import Article from "@/components/Article";

export const metadata: Metadata = { title: "About — Pickar" };

export default function AboutPage() {
  return (
    <Article
      title="About Pickar"
      subtitle="The secure bridge for global work."
    >
      <p>
        Pickar helps freelancers and businesses move money across borders without
        friction. Talented people everywhere lose time and income to slow,
        expensive, or unavailable payment rails. We fix that with company
        receiving accounts, instant payouts, gift-card exchange, and
        cryptocurrency trading — all backed by a real support team.
      </p>

      <h2>What we do</h2>
      <ul>
        <li><strong>Global payouts</strong> — receive client payments through our accounts and get settled to you, fast.</li>
        <li><strong>Gift-card exchange</strong> — turn premium gift cards into cash at competitive, transparent rates.</li>
        <li><strong>Crypto trading</strong> — buy and sell supported assets with a human on the other end.</li>
        <li><strong>Secure escrow</strong> — protect both sides of a deal until the work is done.</li>
      </ul>

      <h2>How we&apos;re different</h2>
      <p>
        Every request is handled in a private, encrypted chat with our support
        team — no bots deciding your money. Your data and sensitive details are
        isolated per account and encrypted, so what&apos;s yours stays yours.
      </p>

      <h2>Our mission</h2>
      <p>
        To make sure no border stands between skilled people and the money
        they&apos;ve earned.
      </p>
    </Article>
  );
}
