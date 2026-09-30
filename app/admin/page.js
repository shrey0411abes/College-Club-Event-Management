import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | CodeChef ABESEC",
  description: "Administrative control center for events and participant registrations.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-950/40">
      <AdminDashboardClient />
    </div>
  );
}
