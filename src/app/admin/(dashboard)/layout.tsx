import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
