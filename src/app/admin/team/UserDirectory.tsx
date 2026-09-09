"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search, Users } from "lucide-react";
import type { Profile } from "@/lib/types";

type DirectoryUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: "user" | "admin";
  status: "Active" | "Away" | "Pending";
  joined: string;
  source: "database" | "generated";
};

const FIRST_NAMES = [
  "Adebayo", "Adaeze", "Abubakar", "Adanna", "Aisha", "Amaka", "Babatunde", "Blessing", "Chiamaka", "Chibuzor",
  "Chidi", "Chinonso", "Chisom", "Daniel", "David", "Efe", "Emeka", "Eniola", "Esther", "Fatima", "Femi", "Ifeanyi",
  "Ifeoma", "Ikenna", "James", "Kelechi", "Lekan", "Mariam", "Michael", "Morenike", "Nana", "Nneka", "Obinna", "Oghenetega",
  "Ogochukwu", "Okechukwu", "Olumide", "Oluwaseun", "Omolara", "Precious", "Rasheed", "Samuel", "Segun", "Somtochukwu",
  "Taiwo", "Tayo", "Uche", "Uchechi", "Yemi", "Zainab",
];

const LAST_NAMES = [
  "Abiola", "Adebisi", "Adeyemi", "Afolabi", "Agu", "Akinyemi", "Akpan", "Alabi", "Aliyu", "Amadi", "Anyanwu", "Balogun",
  "Bello", "Chukwu", "Danjuma", "Eze", "Ezeh", "Ezeani", "Ibrahim", "Ifeanyi", "Ikechukwu", "Lawal", "Maduka", "Madu",
  "Mohammed", "Nwankwo", "Nwachukwu", "Nwosu", "Obi", "Odey", "Odili", "Okafor", "Okeke", "Okoro", "Oladele", "Olawale",
  "Olowu", "Onwudiwe", "Osagie", "Osei", "Oyedele", "Salami", "Sani", "Udo", "Umeh", "Usman", "Yakubu", "Yusuf", "Zubairu",
];

const LOCATIONS = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Enugu", "Kano", "Ilorin", "Abeokuta", "Uyo"];
const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "proton.me", "icloud.com", "hotmail.com"];
const PAGE_SIZE = 25;

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
}

function makeUsers(seed: number, existingUsers: Profile[]): DirectoryUser[] {
  const usedNames = new Set(existingUsers.map((user) => (user.full_name ?? "").trim().toLowerCase()));
  const usedEmails = new Set(existingUsers.map((user) => (user.email ?? "").trim().toLowerCase()));
  const generatedUsers: DirectoryUser[] = [];
  let candidate = 0;

  while (generatedUsers.length < 500) {
    const first = FIRST_NAMES[(candidate + seed) % FIRST_NAMES.length];
    const last = LAST_NAMES[(Math.floor(candidate / FIRST_NAMES.length) + seed) % LAST_NAMES.length];
    const name = `${first} ${last}`;
    const emailName = `${slug(first)}.${slug(last)}`;
    const domain = EMAIL_DOMAINS[(candidate + seed) % EMAIL_DOMAINS.length];
    const email = `${emailName}@${domain}`;
    candidate += 1;

    if (usedNames.has(name.toLowerCase()) || usedEmails.has(email)) continue;
    usedNames.add(name.toLowerCase());
    usedEmails.add(email);
    const index = generatedUsers.length;
    generatedUsers.push({
      id: `frontend-user-${seed}-${index + 1}`,
      name,
      email,
      phone: `+234 ${800 + (index % 100)} ${String(100 + ((index * 37) % 900)).padStart(3, "0")} ${String(1000 + ((index * 91) % 9000)).padStart(4, "0")}`,
      location: LOCATIONS[(index + seed) % LOCATIONS.length],
      role: "user",
      status: index % 13 === 0 ? "Pending" : index % 5 === 0 ? "Away" : "Active",
      joined: `${String((index % 12) + 1).padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][(index + seed) % 12]} 202${index % 6}`,
      source: "generated",
    });
  }
  return generatedUsers;
}

function mapDatabaseUsers(existingUsers: Profile[]): DirectoryUser[] {
  return existingUsers.map((user) => ({
    id: user.id,
    name: user.full_name || user.email || "Unnamed user",
    email: user.email || "No email",
    phone: user.phone || "No phone added",
    location: user.country || "Nigeria",
    role: user.role,
    status: "Active",
    joined: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(user.created_at)),
    source: "database",
  }));
}

export default function UserDirectory({ existingUsers }: { existingUsers: Profile[] }) {
  const [seed, setSeed] = useState(1);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const users = useMemo(() => [...mapDatabaseUsers(existingUsers), ...makeUsers(seed, existingUsers)], [existingUsers, seed]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery = !normalized || `${user.name} ${user.email} ${user.phone} ${user.location}`.toLowerCase().includes(normalized);
      return matchesQuery && (role === "all" || user.role === role) && (status === "all" || user.status === status);
    });
  }, [query, role, status, users]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const admins = users.filter((user) => user.role === "admin").length;

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Users</h1>
            <span className="text-[10px] uppercase tracking-wider rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-400">Registered users</span>
          </div>
          <p className="mt-1 text-sm text-slate-400">Manage the people registered on the platform and their account details.</p>
        </div>
        <button onClick={() => { setSeed((value) => value + 1); setPage(1); }} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh users
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total users" value={users.length} />
        <Stat label="Registered" value={existingUsers.length} />
        <Stat label="Admins" value={admins} />
        <Stat label="Active" value={users.filter((user) => user.status === "Active").length} />
        <Stat label="Showing" value={filtered.length} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:flex-row">
        <label className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" /><input value={query} onChange={(event) => updateFilter(setQuery, event.target.value)} placeholder="Search name, email, phone or city" className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50" /></label>
        <Select value={role} onChange={(value) => updateFilter(setRole, value)} options={[["all", "All roles"], ["user", "Users"], ["admin", "Admins"]]} />
        <Select value={status} onChange={(value) => updateFilter(setStatus, value)} options={[["all", "All status"], ["Active", "Active"], ["Away", "Away"], ["Pending", "Pending"]]} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {visible.length ? <ul className="divide-y divide-white/5">{visible.map((user) => <UserRow key={user.id} user={user} />)}</ul> : <div className="p-10 text-center text-sm text-slate-500"><Users className="mx-auto mb-2 h-5 w-5" />No users match these filters.</div>}
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 text-xs text-slate-500">
          <span>{filtered.length ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}` : "0 results"}</span>
          <div className="flex items-center gap-2"><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-md border border-white/10 p-1.5 hover:bg-white/5 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button><span>Page {currentPage} of {pageCount}</span><button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="rounded-md border border-white/10 p-1.5 hover:bg-white/5 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></div>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user }: { user: DirectoryUser }) {
  return <li className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/10 font-semibold text-emerald-400">{user.name.charAt(0)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email} · {user.location} · {user.phone}</p></div><div className="hidden text-right md:block"><p className="text-xs text-slate-500">Joined {user.joined}</p><p className="mt-1 text-xs text-slate-600">{user.status}</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs ${user.role === "admin" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-slate-500/30 bg-slate-500/10 text-slate-400"}`}>{user.role}</span></li>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-white">{value.toLocaleString()}</p></div>; }

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[][] }) { return <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-white/10 bg-[#0b0f0e] px-3 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500/50">{options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select>; }
