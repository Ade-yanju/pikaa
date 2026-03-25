"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Landmark,
  Building,
  CreditCard,
  Calculator,
  MessageCircle,
  X,
  Send,
  Bot,
  Activity,
  PhoneCall,
  Gift,
  MapPin,
} from "lucide-react";

// --- IMPORT BRAND LOGOS ---
import {
  SiCashapp,
  SiZelle,
  SiWise,
  SiPayoneer,
  SiRevolut,
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

// --- LIVE ESCROW TICKER ---
const LiveTicker = () => {
  const transactions = [
    "🔒 Web Dev Project: $4,500 Secured",
    "⚡ Payout: $1,200 Released to Talent",
    "🎁 Gift Card: $500 Apple Exchanged",
    "🔒 UI/UX Design: $2,800 Secured",
    "⚡ Payout: £850 Released to UK Bank",
    "🔒 Mobile App MVP: $9,000 Secured",
    "🎁 Gift Card: $200 Steam Exchanged",
  ];

  return (
    <div className="w-full bg-emerald-500/5 border-b border-white/5 py-2 overflow-hidden flex whitespace-nowrap z-50 relative mt-20">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        className="flex gap-12 text-xs font-medium text-emerald-400/80 tracking-wider uppercase items-center"
      >
        {[...transactions, ...transactions].map((text, i) => (
          <span key={i} className="flex items-center gap-2">
            <Activity className="w-3 h-3" /> {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function PickarLandingPage() {
  const escrowWhatsAppNumber = "+57 3026790484";
  const supportPhoneNumber = "+1 (448) 201-1421";

  const whatsappMessage = encodeURIComponent(
    "Hello Pickar, I want to set up a secure transaction.",
  );
  const whatsappLink = `https://wa.me/${escrowWhatsAppNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans overflow-x-hidden relative">
      <SpotlightBackground />

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <img
              src="/pickar.png"
              alt="Pickar Logo"
              className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement?.insertAdjacentHTML(
                  "beforeend",
                  '<span class="text-white font-bold text-2xl tracking-tighter">Pickar.</span>',
                );
              }}
            />
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${supportPhoneNumber}`}
              className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> Support
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-black bg-white hover:bg-slate-200 px-5 py-2.5 rounded-full transition-colors flex items-center gap-2"
            >
              Start Transaction
            </a>
          </div>
        </div>
      </nav>

      {/* LIVE TICKER */}
      <LiveTicker />

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 mb-8 uppercase tracking-widest shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]"
          >
            <Lock className="w-3 h-3" />
            <span>Escrow & Asset Liquidity</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter mb-8 leading-[1.05]"
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
            Pickar secures funds for global freelance projects, guarantees
            instant payouts, and offers seamless gift card exchange across 25+
            countries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-slate-200 transition-all overflow-hidden shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Wallet className="w-5 h-5" />
              Secure a Transaction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* GLOBAL COVERAGE & BANKING (TABBED INTERFACE) */}
        <div className="mt-40 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Global Infrastructure
            </h2>
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase">
              Supporting Payouts & Exchanges in 25+ Regions
            </p>
          </div>
          <GlobalCoverageTabs />
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-40">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 tracking-tight">
            The Pickar Ecosystem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<ShieldCheck className="w-7 h-7 text-emerald-400" />}
              title="1. Secure Escrow"
              description="Client and talent agree on terms via WhatsApp. Client funds the Pickar Vault, and we hold it safely until the work is approved."
            />
            <FeatureCard
              icon={<Globe className="w-7 h-7 text-blue-400" />}
              title="2. Borderless Payouts"
              description="Once approved, we route funds directly to the talent via local bank transfers across Europe, Americas, Asia, and Africa."
            />
            <FeatureCard
              icon={<Gift className="w-7 h-7 text-purple-400" />}
              title="3. Gift Card Exchange"
              description="Have unused gift cards? Exchange premium global cards for instant cash liquidity directly to your preferred payment method."
            />
          </div>
        </div>

        {/* PRICING CALCULATOR */}
        <div className="mt-40 max-w-4xl mx-auto">
          <PricingCalculator />
        </div>

        {/* FAQ SECTION */}
        <div className="mt-40 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="How do I exchange a Gift Card?"
              answer="Simply click on the AI Chatbot or contact our WhatsApp concierge. Tell us the brand and value of your gift card, and we will provide an instant exchange rate. Upon verification, you get paid instantly."
            />
            <FAQItem
              question="What countries do you support for Escrow payouts?"
              answer="We support payouts globally including the UK, USA, Australia, the entire EU (Germany, France, Spain, etc.), LATAM (Mexico, Brazil, Colombia), Asia (India, Indonesia, Philippines), and Africa."
            />
            <FAQItem
              question="What happens if there is an escrow dispute?"
              answer="If a client is unsatisfied, funds remain locked in the Pickar vault. Our dedicated concierges will step in to mediate based on the original agreement provided in the WhatsApp chat to ensure a fair resolution."
            />
            <FAQItem
              question="What is your fee structure?"
              answer="For Escrow, we charge a flat 5% fee on the total project volume. For Gift Card exchanges, rates vary dynamically based on the specific brand and global market demand."
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#030303] pt-16 pb-8 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <img
                src="/pickar.png"
                alt="Pickar Logo"
                className="h-6 w-auto object-contain grayscale opacity-70"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement?.insertAdjacentHTML(
                    "beforeend",
                    '<span class="text-white font-bold text-xl tracking-tighter">Pickar.</span>',
                  );
                }}
              />
            </div>
            <p className="text-slate-500 text-sm">
              The secure bridge for global work.
              <br />
              Support: {supportPhoneNumber}
            </p>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Dispute Policy
            </a>
          </div>
        </div>
      </footer>

      {/* ROBUST FLOATING AI CHATBOT ENGINE */}
      <PickarChatbotEngine
        supportNumber={supportPhoneNumber}
        whatsappLink={whatsappLink}
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---

// --- GLOBAL COVERAGE TABS (Solves the "Messy List" problem) ---
type BrandItem = { name: string; icon: React.ElementType; color: string };
type RegionDef = {
  name: string;
  countries?: string[];
  isBrands?: boolean;
  items?: BrandItem[];
};

function GlobalCoverageTabs() {
  const [activeTab, setActiveTab] = useState<string>("europe");

  // Explicitly typing this object solves the Vercel Build Error
  const regions: Record<string, RegionDef> = {
    europe: {
      name: "Europe",
      countries: [
        "UK",
        "Germany",
        "Belgium",
        "France",
        "Italy",
        "Greece",
        "Austria",
        "Croatia",
        "Cyprus",
        "Estonia",
        "Lithuania",
        "Finland",
        "Ireland",
        "Latvia",
        "Luxembourg",
        "Malta",
        "Netherlands",
        "Portugal",
        "Slovenia",
        "Slovakia",
        "Spain",
        "Ukraine",
        "Russia",
      ],
    },
    americas: {
      name: "Americas",
      countries: [
        "USA",
        "Mexico",
        "Brazil",
        "Colombia",
        "Argentina",
        "Chile",
        "Ecuador",
      ],
    },
    asiapacific: {
      name: "Asia-Pacific",
      countries: [
        "Australia",
        "Indonesia",
        "Philippines",
        "India",
        "Pakistan",
        "Vietnam",
        "Nepal",
      ],
    },
    mea: {
      name: "Middle East & Africa",
      countries: ["Morocco", "Qatar", "Turkey", "South Africa", "Egypt"],
    },
    platforms: {
      name: "Supported Platforms",
      isBrands: true,
      items: [
        { name: "CashApp", icon: SiCashapp, color: "#00D632" },
        { name: "Zelle", icon: SiZelle, color: "#7411E2" },
        { name: "Wise", icon: SiWise, color: "#9FE870" },
        { name: "Payoneer", icon: SiPayoneer, color: "#FF4800" },
        { name: "Revolut", icon: SiRevolut, color: "#FFFFFF" },
        { name: "Gift Cards", icon: Gift, color: "#A855F7" },
        { name: "Interac e-Transfer", icon: Gift, color: "#A855F7" },
      ],
    },
  };

  const currentRegion = regions[activeTab];

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden p-2 backdrop-blur-sm">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-white/5 mb-6 justify-center">
        {Object.entries(regions).map(([key, region]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-wrap justify-center gap-3"
          >
            {currentRegion.isBrands
              ? currentRegion.items?.map((brand, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <brand.icon
                      className="w-6 h-6"
                      style={{ color: brand.color }}
                    />
                    <span className="text-white font-medium">{brand.name}</span>
                  </div>
                ))
              : currentRegion.countries?.map((country, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-500/70" />
                    <span className="text-sm">{country}</span>
                  </div>
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- UPGRADED PRICING CALCULATOR ---
function PricingCalculator() {
  const [projectAmount, setProjectAmount] = useState<number>(1000);
  const [perspective, setPerspective] = useState<"client" | "talent">("client");
  const feePercentage = 0.05;

  const pikaaFee = projectAmount * feePercentage;
  const talentPayout = projectAmount - pikaaFee;

  return (
    <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 relative overflow-hidden backdrop-blur-sm shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Calculator className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Escrow Pricing
            </h2>
            <p className="text-sm text-slate-400">
              See exactly where the money goes.
            </p>
          </div>
        </div>

        <div className="flex bg-black/50 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setPerspective("client")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${perspective === "client" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
          >
            I&apos;m Paying (Client)
          </button>
          <button
            onClick={() => setPerspective("talent")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${perspective === "talent" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
          >
            {`I'm Earning (Talent)`}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <label className="block text-slate-400 text-sm mb-4 font-medium uppercase tracking-wider">
            Project Volume (USD)
          </label>
          <div className="flex items-center justify-between mb-6">
            <span className="text-5xl font-extrabold text-white tracking-tighter">
              ${projectAmount.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="20000"
            step="100"
            value={projectAmount}
            onChange={(e) => setProjectAmount(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-3 text-xs font-medium text-slate-500">
            <span>$100</span>
            <span>$20,000+</span>
          </div>
        </div>

        <div className="bg-black/60 rounded-2xl p-6 border border-white/10 shadow-inner">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-slate-400 text-sm font-medium">
              Client Deposits
            </span>
            <span className="text-white font-semibold text-lg">
              ${projectAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 py-4">
            <span className="text-slate-400 text-sm font-medium">
              Pickar Escrow Fee (5%)
            </span>
            <span className="text-emerald-400 font-semibold text-lg">
              -${pikaaFee.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-6">
            <span className="text-white font-bold text-lg">
              {perspective === "talent" ? "You Receive" : "Talent Receives"}
            </span>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              ${talentPayout.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MASSIVELY UPGRADED CHATBOT ENGINE (Pickar AI 3.0) ---
type Message = {
  sender: "bot" | "user";
  text: string;
  isLink?: boolean;
  linkUrl?: string;
};

function PickarChatbotEngine({
  supportNumber,
  whatsappLink,
}: {
  supportNumber: string;
  whatsappLink: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Chatbot State Machine
  const [chatState, setChatState] = useState<
    "greeting" | "escrow_flow" | "gift_card_flow" | "general"
  >("greeting");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Welcome to Pickar! ⚡️ How can I help you accelerate your financial goals today?",
    },
  ]);

  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Start Escrow",
    "Exchange Gift Card",
    "General Support",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const processBotLogic = (userText: string) => {
    const lower = userText.toLowerCase();

    setTimeout(() => {
      let botResponse = "";
      let newQuickReplies: string[] = [];
      let linkObj: { isLink?: boolean; linkUrl?: string; text?: string } = {};
      let nextState = chatState;

      // STATE ROUTING LOGIC
      if (chatState === "greeting") {
        if (
          lower.includes("escrow") ||
          lower.includes("project") ||
          lower.includes("freelance")
        ) {
          botResponse =
            "Great. Escrow protects both parties. Are you the Client paying, or the Talent receiving funds?";
          newQuickReplies = ["I'm the Client", "I'm the Talent"];
          nextState = "escrow_flow";
        } else if (
          lower.includes("gift") ||
          lower.includes("exchange") ||
          lower.includes("card")
        ) {
          botResponse =
            "We offer excellent rates for Gift Card exchange. What brand of Gift Card do you have? (e.g., Apple, Steam, Amazon, Razer)";
          newQuickReplies = ["Apple", "Steam", "Amazon", "Other Brand"];
          nextState = "gift_card_flow";
        } else {
          nextState = "general"; // Fallthrough to general NLP
        }
      }

      if (nextState === "escrow_flow" && chatState === "escrow_flow") {
        botResponse =
          "Understood. Our 24/7 Concierge will set up your secure vault on WhatsApp. Click below to initiate the contract.";
        linkObj = {
          isLink: true,
          linkUrl: whatsappLink,
          text: "Click here to Start Escrow",
        };
        newQuickReplies = ["Main Menu"];
        nextState = "greeting";
      }

      if (nextState === "gift_card_flow" && chatState === "gift_card_flow") {
        const brand = userText.charAt(0).toUpperCase() + userText.slice(1);
        botResponse = `To get today's highest exchange rate for your ${brand} card, please connect with our specialized trading desk on WhatsApp.`;
        linkObj = {
          isLink: true,
          linkUrl: whatsappLink,
          text: `Exchange ${brand} Card Now`,
        };
        newQuickReplies = ["Main Menu"];
        nextState = "greeting";
      }

      // GENERAL NLP FALLBACK
      if (nextState === "general") {
        if (lower.includes("fee") || lower.includes("price")) {
          botResponse =
            "Escrow carries a flat 5% fee. Gift card rates vary dynamically based on brand and market demand.";
          newQuickReplies = ["Start Escrow", "Exchange Gift Card"];
          nextState = "greeting";
        } else if (
          lower.includes("country") ||
          lower.includes("mexico") ||
          lower.includes("uk") ||
          lower.includes("brazil") ||
          lower.includes("philippines")
        ) {
          botResponse =
            "We support payouts in 25+ countries across Europe, the Americas (including Mexico, Brazil), Asia-Pacific, and Africa. Check our Global Infrastructure section for the full list!";
          newQuickReplies = ["Start Escrow", "Support"];
          nextState = "greeting";
        } else if (lower.includes("menu") || lower.includes("back")) {
          botResponse = "What would you like to do?";
          newQuickReplies = [
            "Start Escrow",
            "Exchange Gift Card",
            "General Support",
          ];
          nextState = "greeting";
        } else {
          botResponse = `I'm routing you to a human expert. Please text or call ${supportNumber}, or connect via WhatsApp.`;
          linkObj = {
            isLink: true,
            linkUrl: whatsappLink,
            text: "Connect to Live Agent",
          };
          newQuickReplies = ["Main Menu"];
          nextState = "greeting";
        }
      }

      setChatState(nextState);
      setIsTyping(false);

      if (linkObj.isLink && linkObj.text && linkObj.linkUrl) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botResponse },
          {
            sender: "bot",
            text: linkObj.text as string,
            isLink: true,
            linkUrl: linkObj.linkUrl as string,
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      }

      setQuickReplies(newQuickReplies);
    }, 1200);
  };

  const handleSend = (textInput: string) => {
    if (!textInput.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: textInput }]);
    setInput("");
    setQuickReplies([]);
    setIsTyping(true);
    processBotLogic(textInput);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900/40 to-black p-5 border-b border-white/10 flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-tight">
                    Pickar AI Core
                  </h3>
                  <p className="text-emerald-400 text-xs mt-0.5">
                    Systems Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-transparent to-white/[0.02]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-black rounded-br-sm font-medium"
                        : "bg-white/10 text-slate-200 rounded-bl-sm border border-white/5"
                    }`}
                  >
                    {msg.isLink ? (
                      <a
                        href={msg.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                      >
                        {msg.text} <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: 0.2,
                      }}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: 0.4,
                      }}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {!isTyping && quickReplies.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply)}
                    className="text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-4 bg-black border-t border-white/10 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Pickar..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 transition-transform hover:scale-105"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)] hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}

// --- STANDARD COMPONENTS ---
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:border-white/10 transition-colors group"
    >
      <div className="bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-medium text-white">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
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
