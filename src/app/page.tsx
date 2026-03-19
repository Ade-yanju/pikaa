"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Banknote, 
  Wallet,
  Globe,
  Star,
  ChevronDown,
  Zap,
  Landmark,
  Building,
  CreditCard,
  Calculator
} from "lucide-react";

// --- IMPORT BRAND LOGOS ---
import { 
  SiCashapp, 
  SiZelle, 
  SiWise, 
  SiPayoneer, 
  SiRevolut 
} from "react-icons/si";

// --- BACKGROUND EFFECTS ---
const SpotlightBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/20 blur-[150px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[150px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay"></div>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function PikaaLandingPage() {
  const whatsappNumber = "2340000000000"; // Replace with Pikaa's WhatsApp
  const whatsappMessage = encodeURIComponent("Hello Pikaa, I want to set up a secure escrow transaction.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans overflow-x-hidden relative">
      <SpotlightBackground />

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/20 group-hover:fill-emerald-400/40 transition-all" />
            <span className="text-white font-bold text-2xl tracking-tighter">
              Pikaa.
            </span>
          </div>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-black bg-white hover:bg-slate-200 px-5 py-2.5 rounded-full transition-colors flex items-center gap-2"
          >
            Start Escrow
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-48 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 mb-8 uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
          >
            <Lock className="w-3 h-3" />
            <span>Bank-Grade Escrow</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
          >
            Global Payments. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
              Zero Friction.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-light leading-relaxed"
          >
            Pikaa secures funds from global clients and guarantees instant payouts to talent upon completion. Work with confidence, get paid with ease.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-slate-200 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Wallet className="w-5 h-5" />
              Secure a Transaction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* SUPPORTED INFRASTRUCTURE (BRAND LOGOS) */}
        <div className="mt-32">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase">Supported Payment Infrastructure</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            <BrandBadge name="CashApp" icon={SiCashapp} hoverHex="#00D632" />
            <BrandBadge name="Zelle" icon={SiZelle} hoverHex="#7411E2" />
            <BrandBadge name="Chime" icon={CreditCard} hoverHex="#25C85B" />
            <BrandBadge name="Wise" icon={SiWise} hoverHex="#9FE870" />
            <BrandBadge name="Payoneer" icon={SiPayoneer} hoverHex="#FF4800" />
            <BrandBadge name="Revolut" icon={SiRevolut} hoverHex="#FFFFFF" />
            <BrandBadge name="US/UK Bank" icon={Landmark} hoverHex="#60A5FA" />
            <BrandBadge name="E-Transfer" icon={Building} hoverHex="#FBBF24" />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-40">
          <h2 className="text-3xl font-bold text-center text-white mb-16">How Pikaa Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Globe className="w-7 h-7 text-emerald-400" />}
              title="1. Connect & Agree"
              description="Client and talent agree on terms via our WhatsApp concierge. We set up the secure contract instantly."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-7 h-7 text-blue-400" />}
              title="2. Client Funds Pikaa"
              description="The client sends funds to our verified corporate accounts via their preferred local bank or app."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Banknote className="w-7 h-7 text-teal-400" />}
              title="3. Talent Gets Paid"
              description="Once the work is approved, Pikaa routes the funds directly to the talent's local account. Fast and secure."
              delay={0.3}
            />
          </div>
        </div>

        {/* PRICING CALCULATOR */}
        <div className="mt-40 max-w-4xl mx-auto">
          <PricingCalculator />
        </div>

        {/* TESTIMONIALS */}
        <div className="mt-40">
          <h2 className="text-3xl font-bold text-center text-white mb-16">Trusted by Top Talent & Agencies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="Pikaa solved my biggest headache. I no longer worry about clients disappearing after I deliver the code. The money is always there."
              name="Sarah J."
              role="Freelance Developer"
            />
            <TestimonialCard 
              quote="As a US agency hiring global designers, Pikaa makes payments seamless. We fund via ACH, and they handle the local payouts."
              name="David M."
              role="Creative Director"
            />
            <TestimonialCard 
              quote="The WhatsApp concierge is a gamechanger. It's fast, professional, and completely removes the awkward money conversation with clients."
              name="Tobi A."
              role="Digital Marketer"
            />
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="mt-40 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem 
              question="How long does it take for talent to receive funds?"
              answer="Once the client approves the final work, Pikaa releases the funds immediately. Depending on the payout method chosen (e.g., local bank transfer, Wise, Crypto), funds typically arrive within minutes to 24 hours."
            />
            <FAQItem 
              question="What happens if there is a dispute?"
              answer="If a client is unsatisfied, funds remain locked in the Pikaa vault. Our dedicated concierges will step in to mediate based on the original agreement provided in the WhatsApp chat to ensure a fair resolution."
            />
            <FAQItem 
              question="What is your fee structure?"
              answer="We charge a flat 5% fee on the total project volume. There are no hidden routing or withdrawal fees."
            />
            <FAQItem 
              question="Do you support cross-border payments?"
              answer="Yes. A client can pay using US Zelle or a UK Bank Transfer, and the talent can receive the payout in their local currency via direct bank transfer, Payoneer, or Wise."
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#030303] pt-16 pb-8 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-white font-bold text-xl tracking-tighter">Pikaa.</span>
            </div>
            <p className="text-slate-500 text-sm">The secure bridge for global work.</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Dispute Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PricingCalculator() {
  const [projectAmount, setProjectAmount] = useState<number>(1000);
  const feePercentage = 0.05; // 5% fee
  
  const pikaaFee = projectAmount * feePercentage;
  const talentPayout = projectAmount - pikaaFee;

  return (
    <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Calculator className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Transparent Pricing</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Slider Section */}
        <div>
          <label className="block text-slate-400 text-sm mb-4">Project Volume (USD)</label>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-white">${projectAmount.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100"
            value={projectAmount}
            onChange={(e) => setProjectAmount(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>$100</span>
            <span>$10,000+</span>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-slate-400 text-sm">Client Deposits</span>
            <span className="text-white font-medium">${projectAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-slate-400 text-sm">Pikaa Fee (5%)</span>
            <span className="text-emerald-400 font-medium">${pikaaFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-white font-semibold">Talent Receives</span>
            <span className="text-2xl font-bold text-white">${talentPayout.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Silicon Valley Standard Brand Icon Grid
function BrandBadge({ name, icon: Icon, hoverHex }: { name: string, icon: React.ElementType, hoverHex: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.01] border border-white/5 transition-all duration-300 cursor-default hover:bg-white/[0.03] hover:border-white/10 hover:-translate-y-1"
      style={{
        boxShadow: isHovered ? `0 10px 30px -10px ${hoverHex}40` : 'none'
      }}
    >
      <Icon 
        className="w-8 h-8 mb-3 transition-all duration-300" 
        style={{ color: isHovered ? hoverHex : '#64748b' }} 
      />
      <span 
        className="text-xs font-semibold transition-colors duration-300"
        style={{ color: isHovered ? '#f1f5f9' : '#64748b' }}
      >
        {name}
      </span>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:border-white/10 transition-colors group"
    >
      <div className="bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, name, role }: { quote: string, name: string, role: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
      <div>
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
          ))}
        </div>
        <p className="text-slate-300 italic mb-8 leading-relaxed">"{quote}"</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-white font-medium text-sm">{name}</h4>
          <p className="text-slate-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-medium text-white">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}