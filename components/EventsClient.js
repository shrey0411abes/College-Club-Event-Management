"use client";

import { useState, useEffect, useTransition } from "react";
import EventCard from "./EventCard";
import { useStore } from "@/context/StoreProvider";
import { isEventPast } from "@/lib/eventTime";

function EventSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-slate-800/80" />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="h-6 bg-slate-800 rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-800/60 rounded w-1/2" />
          <div className="h-4 bg-slate-800/60 rounded w-2/3" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 bg-slate-800/40 rounded w-full" />
          <div className="h-3.5 bg-slate-800/40 rounded w-4/5" />
        </div>
        <div className="pt-4 border-t border-slate-800">
          <div className="h-10 bg-slate-800 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

export default function EventsClient() {
  const { events, isLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [, startTransition] = useTransition();

  const initialEvents = events.map((e) => ({
    ...e,
    isPast: isEventPast(e.date, e.time),
  }));

  // Extract unique categories from events
  const categories = [
    "All",
    ...Array.from(new Set(initialEvents.map((e) => e.category).filter(Boolean))),
  ];

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setDebouncedSearch(searchTerm);
        setIsDebouncing(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Combined search & category filter
  const filteredEvents = initialEvents.filter((event) => {
    const matchesSearch =
      !debouncedSearch.trim() ||
      event.title.toLowerCase().includes(debouncedSearch.toLowerCase().trim()) ||
      event.description.toLowerCase().includes(debouncedSearch.toLowerCase().trim()) ||
      event.venue.toLowerCase().includes(debouncedSearch.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === "All" ||
      event.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setIsDebouncing(false);
    setSelectedCategory("All");
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Sticky Search and Category Filter Controls */}
      <div className="sticky top-16 sm:top-20 z-30 flex flex-col gap-5 bg-slate-950/90 border border-slate-800/90 p-5 sm:p-6 rounded-3xl backdrop-blur-xl shadow-2xl shadow-black/40">
        {/* Search Bar Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="event-search-input"
            aria-label="Search events by title, description or venue"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDebouncing(true);
            }}
            placeholder="Search events by name, keywords, or topics..."
            className="w-full pl-11 pr-12 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
              aria-label="Clear search input"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Filter by Category
            </label>
            {(selectedCategory !== "All" || debouncedSearch) && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1"
              >
                Reset all filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/60 scale-105"
                      : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 px-1">
        <span>
          Showing <span className="font-bold text-white">{filteredEvents.length}</span>{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
          {debouncedSearch && <span> for &ldquo;{debouncedSearch}&rdquo;</span>}
        </span>
        {selectedCategory !== "All" && (
          <span className="text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-800/60 text-xs font-medium">
            Category: {selectedCategory}
          </span>
        )}
      </div>

      {/* Grid or Skeletons or Empty State */}
      {isDebouncing || isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              isPast={Boolean(event.isPast)}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">No Events Found</h3>
          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            No events match your current search &quot;{debouncedSearch}&quot;{" "}
            {selectedCategory !== "All" && `in category "${selectedCategory}"`}.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
