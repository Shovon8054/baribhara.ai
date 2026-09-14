import AISearch from "../components/AISearch";

const AISearchPage = () => (
  <main className="min-h-screen bg-[#060b18] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden pb-20 pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8">
    {/* Ambient Background Lights */}
    <div className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[380px] bg-cyan-500/10 rounded-full blur-[140px] -z-10" />
    <div className="pointer-events-none absolute top-48 right-10 w-[500px] h-[350px] bg-purple-600/10 rounded-full blur-[150px] -z-10" />
    <div className="pointer-events-none absolute bottom-20 left-10 w-[500px] h-[350px] bg-blue-600/5 rounded-full blur-[150px] -z-10" />

    <section className="mx-auto max-w-5xl">
      
      {/* Header Container */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        
        {/* Gemini AI Powered Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 mb-5 shadow-sm shadow-cyan-500/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Powered by Google Gemini AI
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Find Your Perfect Property
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Describe the home you need in natural language. Our AI understands budgets, Dhaka neighborhoods, and amenities to find your best match.
        </p>
      </div>

      {/* Main AI Search Console Component */}
      <div className="w-full">
        <AISearch />
      </div>

    </section>
  </main>
);

export default AISearchPage;
