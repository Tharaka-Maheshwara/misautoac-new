import React from "react";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Confirm Logout
        </h2>
        <p className="text-slate-600 mb-8">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg px-6 py-2.5 text-base font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-base font-semibold text-white shadow-sm shadow-red-200 transition-all duration-200 hover:bg-red-700 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
