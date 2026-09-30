import EventsClient from "@/components/EventsClient";

export const metadata = {
  title: "Events Directory | CodeChef ABESEC",
  description:
    "Explore upcoming and past hackathons, competitive programming contests, workshops, and tech sessions hosted by CodeChef ABESEC Chapter.",
};

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-700/60 text-indigo-300">
          <span>📅</span> Event Catalog
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore Club Events
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Discover hands-on workshops, 24-hour hackathons, competitive programming
          sprints, and guest speaker sessions. Filter by category or search by topic.
        </p>
      </div>

      {/* Interactive Client Component with debounced search & filter */}
      <EventsClient />
    </div>
  );
}
