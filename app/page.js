export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-800 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">Welcome to Hotel Automation</h1>
        <p className="text-lg mt-4">Effortlessly manage your hotel with our all-in-one platform</p>
        <button className="mt-6 px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-200 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Smart Reservations", desc: "Easily manage check-ins and check-outs with real-time data." },
          { title: "Automated Billing", desc: "Generate invoices and track payments seamlessly." },
          { title: "Catering Services", desc: "Handle room service orders and track expenses." },
        ].map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="bg-indigo-50 py-16 text-center">
        <h2 className="text-3xl font-bold">What Our Clients Say</h2>
        <div className="mt-8 max-w-4xl mx-auto">
          <blockquote className="italic text-gray-700">“This software has revolutionized our hotel management. Highly recommended!”</blockquote>
          <p className="mt-4 font-semibold">— John Doe, Hotel Manager</p>
        </div>
      </section>

      
    </div>
  );
}