import Head from "next/head";
import Link from "next/link";
import { supabaseClient } from "../_lib/supabase";
import ContactForm from "../../app/_components/ContactForm";
export default async function ContactUs() {
  return (
    <>
      <Head>
        <title>Contact Us - Waste Not</title>
        <meta
          name="description"
          content="Get in touch with the Waste Not team."
        />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header - Re-use from the landing page */}
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

        {/* Main Content Section */}
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
              Contact Us
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Have a question or want to get involved? We'd love to hear from
              you.
            </p>

            {/* Contact Form */}
            <ContactForm />

            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Other Ways to Connect
              </h2>
              <p className="text-gray-600">
                Email:{" "}
                <a
                  href="mailto:info@yourcompany.com"
                  className="text-green-600 hover:underline"
                >
                  info@yourcompany.com
                </a>
              </p>
              <p className="text-gray-600 mt-2">
                Phone:{" "}
                <a
                  href="tel:+15551234567"
                  className="text-green-600 hover:underline"
                >
                  (555) 123-4567
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
