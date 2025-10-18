import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { getServerSupabaseClient } from "./_lib/supabase";
import { getUser } from "./_lib/actions";

// Set revalidate to 0 to ensure the user's login status is always fresh
export const revalidate = 0;

export default async function Home() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  // Safely get the user's details only if they are authenticated.
  let user = null;
  if (supabaseUser) {
    user = await getUser(supabaseUser.email);
  }

  // Determine the display name and user role/type
  const displayName = user
    ? user.fullName || user.businessName || "Friend"
    : null;

  // Logic to determine the main call-to-action message and link
  const isLoggedIn = !!user;
  let mainActionMessage = "Register Yourself";
  let mainActionLink = "/register";
  let mainActionText = "Register Now";
  let mainActionDescription =
    "Join our mission to end food waste and feed our communities.";
  let centerLink = null;
  let centerLinkText = null;

  if (isLoggedIn) {
    if (user.fullName) {
      // Volunteer
      mainActionMessage = `Welcome back, ${displayName}!`;
      mainActionDescription =
        "You have people relying on you. See what orders need a lift today.";
      mainActionLink = "/app/volunteer";
      mainActionText = "View Available Pickups";
      centerLink = "/profile/messages";
      centerLinkText = "Messages";
    } else if (user.businessName) {
      // Provider
      mainActionMessage = `Hello, ${displayName}!`;
      mainActionDescription =
        "Your excess food can fill stomachs. Schedule your next pickup now.";
      mainActionLink = "/app/provider";
      mainActionText = "Go to Dashboard";
      centerLink = "/profile/messages";
      centerLinkText = "Messages";
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            backgroundColor: "white",
            textAlign: "center",
            padding: "16px 24px",
            fontSize: "16px",
          },
        }}
        gutter={12}
        containerStyle={{ margin: "8px" }}
      />
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        {/* --- HEADER --- */}
        <header className="relative z-10 flex justify-between items-center p-6 text-white">
          <div className="text-2xl font-bold">
            <Link href="/" className="cursor-pointer">
              Waste Not
            </Link>
          </div>
          <nav className="space-x-6">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
            {isLoggedIn ? (
              <Link href="/profile" className="hover:underline">
                {displayName}
              </Link>
            ) : (
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            )}
          </nav>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-white text-center p-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 animate-fadeIn">
            {mainActionMessage}
          </h1>
          <p className="text-lg md:text-xl font-medium mb-8 max-w-2xl">
            {mainActionDescription}
          </p>

          <Link href={mainActionLink}>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition duration-300 hover:scale-105">
              {mainActionText}
            </button>
          </Link>
        </main>

        {/* --- MESSAGES LINK (Bottom Right/Overlay) --- */}
        {centerLink && (
          <Link href={centerLink} className="fixed bottom-8 right-8 z-30">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-xl transition-transform transform hover:scale-105">
              {centerLinkText}
            </button>
          </Link>
        )}

        {/* --- FOOTER --- */}
        <footer className="relative z-10 bg-black bg-opacity-70 p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Hard Facts on Food Waste</h2>
          <div className="flex flex-col md:flex-row justify-around space-y-4 md:space-y-0">
            <div className="p-4 rounded-lg">
              <p className="text-3xl font-extrabold text-green-400">1.3B+</p>
              <p className="text-sm md:text-base">
                Tons of food wasted globally each year.
              </p>
            </div>
            <div className="p-4 rounded-lg">
              <p className="text-3xl font-extrabold text-green-400">24K</p>
              <p className="text-sm md:text-base">
                People die of hunger every day.
              </p>
            </div>
            <div className="p-4 rounded-lg">
              <p className="text-3xl font-extrabold text-green-400">10%</p>
              <p className="text-sm md:text-base">
                Of global greenhouse gas emissions are from food waste.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
