// components/Modal.jsx
import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    // Escape billentyű kezelése
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Scroll letiltása, amikor a modal nyitva van
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Ha a modal nincs nyitva, ne rendereljünk semmit
  if (!isOpen) return null;

  // Client-side only portal
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-state={isOpen ? "open" : "closed"}
    >
      <div
        className="bg-black/60 fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        data-state={isOpen ? "open" : "closed"}
      />
      <div
        className={cn(
          "card-border w-full max-w-md relative z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 duration-200",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
      >
        <div className="card p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-light-200 hover:text-light-100"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
