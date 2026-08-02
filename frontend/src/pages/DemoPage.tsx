import { Link } from 'react-router-dom'

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Demo Page</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Property discovery experience preview
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          This is a simple demo route for the BariBhara AI frontend. It shows how the app can grow into a richer experience with listings, search, and AI-assisted actions.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="font-semibold text-white">AI Search</h2>
            <p className="mt-2 text-sm text-slate-400">Natural language property search for budget, location, and amenities.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="font-semibold text-white">Smart Filters</h2>
            <p className="mt-2 text-sm text-slate-400">Filter by bedrooms, area, rent, furnishing, parking, and more.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="font-semibold text-white">Owner Tools</h2>
            <p className="mt-2 text-sm text-slate-400">Manage listings, bookings, and analytics from one workspace.</p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DemoPage
