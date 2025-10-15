import Link from "next/link";

export default function RegisterOptions() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <header className="absolute top-0 left-0 p-6">
          <div className="text-2xl font-bold">
            <Link href="/">
              <span className="cursor-pointer text-gray-800">Waste Not</span>
            </Link>
          </div>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-green-700">
            Join Our Mission
          </h1>
          <p className="text-center text-lg text-gray-600 mb-10">
            Choose the best way you can help fight food waste.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-8 md:space-y-0">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full md:w-1/2 flex flex-col items-center text-center transition transform hover:scale-105">
              <span className="text-6xl mb-4">🤝</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Volunteer
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Help distribute excess food from providers to those in need.
                It's a simple act that makes a huge difference.
              </p>
              <Link href="/register/volunteer">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
                  Register as a Volunteer
                </button>
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full md:w-1/2 flex flex-col items-center text-center transition transform hover:scale-105">
              <span className="text-6xl mb-4">🍽️</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Food Provider
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Have excess food you can't use? Partner with us to ensure it
                reaches people, not landfills.
              </p>
              <Link href="/register/provider">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
                  Register as a Provider
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
