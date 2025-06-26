import { useState } from "react";
import FilterSidebar from "./FilterSidebar";

export default function MobileFilterDrawer({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
        onClick={onClose}
          className="fixed inset-0 z-40 bg-black bg-opacity-40"
        />
      )}

      <div
        className={`fixed z-50 bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300"
          >
            ✕
          </button>
        </div>

        <FilterSidebar />

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2 rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
