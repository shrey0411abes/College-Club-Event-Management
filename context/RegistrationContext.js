"use client";

import { createContext, useContext, useState } from "react";
import RegistrationModal from "@/components/RegistrationModal";

const RegistrationContext = createContext({
  openRegistration: () => {},
  closeRegistration: () => {},
});

export function RegistrationProvider({ children }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openRegistration = (event) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const closeRegistration = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <RegistrationContext.Provider value={{ openRegistration, closeRegistration }}>
      {children}
      {isOpen && selectedEvent && (
        <RegistrationModal
          key={`${selectedEvent._id}`}
          event={selectedEvent}
          isOpen={isOpen}
          onClose={closeRegistration}
        />
      )}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return context;
}
