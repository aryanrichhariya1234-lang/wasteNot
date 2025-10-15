import Link from "next/link";
import { createProviderAccount } from "../_lib/actions";

function CreateProviderForm() {
  return (
    <form className="space-y-6" action={createProviderAccount}>
      <div>
        <label
          htmlFor="businessName"
          className="block text-sm font-medium text-gray-700"
        >
          Business Name
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Your Restaurant or Store Name"
        />
      </div>

      <div>
        <label
          htmlFor="contactPerson"
          className="block text-sm font-medium text-gray-700"
        >
          Contact Person
        </label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Name of Primary Contact"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="you@yourbusiness.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label
          htmlFor="businessAddress"
          className="block text-sm font-medium text-gray-700"
        >
          Business Address
        </label>
        <input
          type="text"
          id="businessAddress"
          name="businessAddress"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="123 Main St, Anytown, USA 12345"
        />
      </div>

      <div>
        <label
          htmlFor="foodDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Type of Food You Provide
        </label>
        <textarea
          id="foodDescription"
          name="foodDescription"
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="e.g., Prepared meals, baked goods, fresh produce"
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the{" "}
          <Link href="#" className="text-green-600 hover:underline">
            Terms of Service and Donation Agreement
          </Link>
          .
        </label>
      </div>

      <div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md shadow-sm transition duration-300">
          Create Provider Account
        </button>
      </div>
    </form>
  );
}

export default CreateProviderForm;
