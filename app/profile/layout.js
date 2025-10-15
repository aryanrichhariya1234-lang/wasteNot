import Link from "next/link";
import { cookies } from "next/headers"; // Used to check session/user in a real app
import { redirect } from "next/navigation";

export default function ProfileLayout({ children }) {
  // In a real app, you would check the session here.
  // const session = cookies().get('session_token');
  // if (!session) { redirect('/login'); }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (Fixed Width) */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col space-y-4 border-r">
        <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-4">
          My Profile
        </h2>

        {/* Navigation Options */}
        <Link
          href="/profile/reservations"
          className="text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium py-3 px-4 rounded-lg transition duration-150"
        >
          Reservations & Pickups
        </Link>

        <Link
          href="/profile/messages"
          className="text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium py-3 px-4 rounded-lg transition duration-150"
        >
          Messages (Inbox)
        </Link>

        {/* Placeholder for Logout or Back to Dashboard */}
        <div className="mt-auto pt-4 border-t">
          <Link href="/" className="text-sm text-gray-500 hover:text-red-500">
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content Area (Renders the nested page content) */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
