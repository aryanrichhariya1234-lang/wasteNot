"use client";

import React, { useState } from "react";
import { editCurrentForn } from "../_lib/actions";

export default function EditOrderModal({ id, isOpen, onClose }) {
  if (!isOpen || !id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-green-700">Edit Order#{id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          action={(formData) => editCurrentForn({ id, formData })}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="items"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Food Items Description
            </label>
            <textarea
              id="items"
              name="items"
              rows="4"
              required
              placeholder="e.g., 20 loaves of surplus bread, 5 boxes of mixed vegetables."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estimated Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.1"
              required
              placeholder="e.g., 15.5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition disabled:bg-green-400"
            >
              Edit Pickup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
