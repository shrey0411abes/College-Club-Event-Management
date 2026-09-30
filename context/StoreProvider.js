"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import * as store from "@/lib/store";

const StoreContext = createContext(null);

const emptySubscribe = () => () => {};
const EMPTY_EVENTS = [];
const EMPTY_REGS = [];
const getServerEvents = () => EMPTY_EVENTS;
const getServerRegs = () => EMPTY_REGS;

export function StoreProvider({ children }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const events = useSyncExternalStore(
    store.subscribe,
    store.getEvents,
    getServerEvents
  );

  const registrations = useSyncExternalStore(
    store.subscribe,
    store.getRegistrations,
    getServerRegs
  );

  const loading = !isClient;
  const isLoading = !isClient;

  const value = {
    loading,
    isLoading,
    events,
    registrations,
    getEvents: store.getEvents,
    getEvent: store.getEvent,
    createEvent: store.createEvent,
    updateEvent: store.updateEvent,
    deleteEvent: store.deleteEvent,
    addRegistration: store.addRegistration,
    getRegistrations: store.getRegistrations,
    resetDemoData: store.resetDemoData,
    getRegistrationsForEvent: (eventId, q) => store.getRegistrations({ eventId, q }),
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
