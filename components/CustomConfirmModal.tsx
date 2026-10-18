"use client";

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface CustomConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CustomConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: CustomConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E1D6] transform transition-all animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-[#FAF6EC] text-[#0B3826]'
            }`}
          >
            {isDestructive ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[#D4AF55]" />
            )}
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-[#0B3826]">{title}</h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{message}</p>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-2 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-200'
                : 'bg-[#0B3826] hover:bg-[#18583A]'
            }`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
