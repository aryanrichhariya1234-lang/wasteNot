import { signOutWithEmail } from "../_lib/actions";

export default function SignOutPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Sign Out</h1>
        <p className="text-lg text-gray-600 mb-6">
          Are you sure you want to sign out?
        </p>

        <form action={signOutWithEmail}>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md shadow-sm transition duration-300"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
