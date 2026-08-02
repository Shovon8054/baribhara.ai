import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">BariBhara AI</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">
          AI-powered rental and property management
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          Discover modern rental experiences with search, recommendations, and owner tools built for growth.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/demo"
            className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            View Demo
          </Link>
          <a
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomePage
