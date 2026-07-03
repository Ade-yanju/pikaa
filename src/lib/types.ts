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

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: Role;
  body: string | null;
  image_url: string | null;
  read_at: string | null;
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
