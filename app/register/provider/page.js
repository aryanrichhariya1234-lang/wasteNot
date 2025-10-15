import CreateProviderForm from "@/app/_components/CreateProviderForm";
import { createProviderAccount } from "@/app/_lib/actions";
import Link from "next/link";

export default function ProviderRegister() {
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

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold text-center mb-6 text-green-700">
            Provider Registration
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Partner with us to donate your excess food and reduce waste.
          </p>

          <CreateProviderForm />

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login">
              <span className="font-medium text-green-600 hover:text-green-500 cursor-pointer">
                Log in
              </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
