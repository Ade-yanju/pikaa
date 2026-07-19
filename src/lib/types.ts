// Shared domain types mirroring the Supabase schema (supabase/schema.sql).

export type Role = "user" | "admin";

// Shared return shape for form Server Actions used with useActionState.
export type ActionState = { error?: string; ok?: boolean };

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  country: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  subject: string;
  status: "open" | "closed";
  last_message_at: string;
  created_at: string;
};

export type SenderRole = "user" | "admin" | "system";

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  sender_role: SenderRole;
  body: string | null;
  image_url: string | null;
  read_at: string | null;
  reply_to: string | null;
  created_at: string;
};

export type PaymentRequestStatus =
  | "pending"
  | "in_review"
  | "details_shared"
  | "completed"
  | "cancelled";

export type PaymentRequest = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  amount: number | null;
  currency: string;
  client_name: string | null;
  purpose: string | null;
  status: PaymentRequestStatus;
  account_id: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type CompanyAccount = {
  id: string;
  label: string;
  currency: string;
  region: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  routing_number: string | null;
  extra: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
};

export const PAYMENT_STATUS_LABELS: Record<PaymentRequestStatus, string> = {
  pending: "Pending",
  in_review: "In review",
  details_shared: "Details shared",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type TradeType = "gift_card" | "crypto";

export type TradeStatus =
  | "pending"
  | "in_review"
  | "accepted"
  | "completed"
  | "rejected"
  | "cancelled";

export type Trade = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  type: TradeType;
  side: string | null;
  asset: string;
  network: string | null;
  amount: number | null;
  currency: string | null;
  rate: number | null;
  payout_amount: number | null;
  secret_encrypted: string | null;
  image_url: string | null;
  status: TradeStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export const TRADE_STATUS_LABELS: Record<TradeStatus, string> = {
  pending: "Pending",
  in_review: "In review",
  accepted: "Accepted",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

// Combined style map so StatusBadge works for payments and trades.
export type WithdrawalMethod =
  | "bank"
  | "paypal"
  | "wise"
  | "cashapp"
  | "crypto"
  | "other";

export type WithdrawalDetail = {
  id: string;
  user_id: string;
  method: WithdrawalMethod;
  label: string | null;
  account_name: string | null;
  bank_name: string | null;
  account_number_enc: string | null;
  routing_enc: string | null;
  currency: string | null;
  extra: string | null;
  created_at: string;
  updated_at: string;
};

export const WITHDRAWAL_METHOD_LABELS: Record<WithdrawalMethod, string> = {
  bank: "Bank transfer",
  paypal: "PayPal",
  wise: "Wise",
  cashapp: "Cash App",
  crypto: "Crypto wallet",
  other: "Other",
};

export const STATUS_TONES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  in_review: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  details_shared: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-emerald-600/15 text-emerald-300 border-emerald-500/40",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};
