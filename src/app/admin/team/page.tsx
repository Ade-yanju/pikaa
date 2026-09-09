import { requireAdmin } from "@/lib/dal";
import UserDirectory from "./UserDirectory";

export const metadata = { title: "Team & Admins — Pickar Support" };

export default async function TeamPage() {
  await requireAdmin();

  return <UserDirectory />;
}
