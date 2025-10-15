import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Waste Not</title>
        <meta
          name="description"
          content="Learn about our mission to fight food waste."
        />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="flex justify-between items-center p-6 text-black bg-white shadow-md">
          <div className="text-2xl font-bold">
            <Link href="/">
              <span className="cursor-pointer">Waste Not</span>
            </Link>
          </div>
          <nav className="space-x-6">
            <Link href="/about">
              <span className="cursor-pointer hover:underline">About</span>
            </Link>
            <Link href="/contact">
              <span className="cursor-pointer hover:underline">Contact Us</span>
            </Link>
            <Link href="/login">
              <span className="cursor-pointer hover:underline">Login</span>
            </Link>
          </nav>
        </header>

        <main className="flex-grow p-6 md:p-12 lg:p-16">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-green-700">
              Our Mission
            </h1>

            <section className="mb-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                At **Waste Not**, we believe that no one should go hungry while
                good food is being thrown away. We are a volunteer-powered
                organization dedicated to bridging the gap between food surplus
                and food insecurity. Our platform connects passionate volunteers
                with local restaurants, grocery stores, and farms that have
                excess food they would otherwise discard.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By facilitating these pickups, we rescue perfectly good food and
                deliver it to community shelters, food banks, and individuals in
                need. We're not just fighting food waste; we're building
                stronger, more sustainable communities, one meal at a time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Why It Matters
              </h2>
              <div className="flex flex-col md:flex-row justify-around space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                  <span className="text-5xl mb-2 text-green-500">🌍</span>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Environmental Impact
                  </h3>
                  <p className="text-sm text-gray-600">
                    Food waste is a major contributor to greenhouse gas
                    emissions. By rescuing food, we reduce methane from
                    landfills and conserve resources like water and energy.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                  <span className="text-5xl mb-2 text-green-500">❤️</span>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Social Good
                  </h3>
                  <p className="text-sm text-gray-600">
                    Food insecurity is a pressing issue. We provide nourishing
                    meals to those in need, offering hope and support to our
                    neighbors and communities.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                  <span className="text-5xl mb-2 text-green-500">🤝</span>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Empowering Volunteers
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our volunteers are the backbone of our operation. We offer a
                    simple way for anyone to make a real, tangible difference in
                    their local community.
                  </p>
                </div>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Join Us Today
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Ready to make a difference? Join our growing network of
                volunteers.
              </p>
              <Link href="/register">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 transform hover:scale-105">
                  Register to Volunteer
                </button>
              </Link>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
