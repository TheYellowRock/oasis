export default function BookTourPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-50">
      <h1 className="font-serif text-4xl tracking-tight text-gray-900">Book a Tour</h1>
      <p className="mt-4 text-gray-600">
        Share your preferred date, unit type, and contact details. Our leasing team will confirm
        your tour shortly.
      </p>
      <form className="mt-8 space-y-4 border p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="border px-3 py-2 text-sm" placeholder="Full Name" />
          <input className="border px-3 py-2 text-sm" placeholder="Email Address" type="email" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="border px-3 py-2 text-sm" placeholder="Phone Number" />
          <input className="border px-3 py-2 text-sm" placeholder="Preferred Date" type="date" />
        </div>
        <textarea
          className="w-full border px-3 py-2 text-sm"
          rows={5}
          placeholder="Tell us what type of space you're looking for."
        />
        <button
          type="submit"
          className="border bg-black px-5 py-2 text-sm font-semibold tracking-wide text-white hover:bg-black/90"
        >
          Submit Request
        </button>
      </form>
    </section>
  )
}
