"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useStore } from "@/context/StoreProvider";

export default function DeleteConfirmModal({ isOpen, onClose, event, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteEvent } = useStore();

  if (!isOpen || !event) return null;

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      deleteEvent(event.id);
      toast.success(`Event "${event.title}" deleted successfully!`);
      if (onDeleteSuccess) onDeleteSuccess();
      onClose();
    } catch (err) {
      console.error("Delete event failed:", err);
      toast.error(err.message || "Could not delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          if (!isDeleting) onClose();
        }}
      />

      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 z-10 my-auto text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 id="delete-dialog-title" className="text-xl font-bold text-white">
          Delete Event?
        </h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-white">&quot;{event.title}&quot;</span>?
          This action will also remove all registrations associated with this event.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
