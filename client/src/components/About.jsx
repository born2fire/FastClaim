import { ShieldCheck, UploadCloud, BellRing } from "lucide-react";

export default function About() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-10">
          Why Choose FastClaim?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <UploadCloud className="w-10 h-10 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              Easy Upload
            </h3>
            <p className="text-gray-600">
              Snap a pic or upload your receipt in seconds. We handle the rest.
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              Warranty Protection
            </h3>
            <p className="text-gray-600">
              Keep all warranties safe in one place — never lose track again.
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <BellRing className="w-10 h-10 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              Smart Reminders
            </h3>
            <p className="text-gray-600">
              Get alerts before your warranty expires. Never miss a deadline.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
