import { requireUser } from "@/lib/dal";
import ProfileForm from "./ProfileForm";

export const metadata = { title: "Settings — Pickar" };

export default async function SettingsPage() {
  const profile = await requireUser();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Your profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Update your name and contact details.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
