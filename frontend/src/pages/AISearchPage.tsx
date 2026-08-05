import AISearch from "../components/AISearch";

const AISearchPage = () => (
<main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 sm:px-6 sm:py-12">
  <section className="mx-auto max-w-7xl">
    
    {/* AI Search Card */}
    <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-xl p-6 sm:p-10 lg:p-12 hover:border-cyan-500/30 transition-all duration-500 group">
      
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl group-hover:bg-cyan-600/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-cyan-400">
              AI Powered Search
            </span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find Your Perfect Property
          </h1>
          
          <p className="mt-3 text-sm text-slate-400 sm:text-base lg:text-lg max-w-2xl mx-auto">
            Describe the home you need in natural language and let our AI find the perfect matches for you.
          </p>
        </div>
        
        {/* Divider */}
        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50"></div>
          </div>
          {/* <div className="relative flex justify-center">
            <span className="bg-slate-800/40 px-4 text-xs text-slate-500">✨</span>
          </div> */}
        </div>
        
        {/* Search Component - Enhanced with Highlight */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glow Ring Behind Search */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-cyan-500/20 rounded-2xl blur-xl animate-pulse"></div>
          
          {/* Search Container */}
          <div className="relative">
            <AISearch />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full blur-sm hidden lg:block"></div>
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full blur-sm hidden lg:block"></div>
        </div>
        
        {/* Quick Tips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Try:</span>
          <span className="px-3 py-1.5 rounded-full bg-slate-700/30 border border-slate-700/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
            "2 bedroom apartment in Gulshan"
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-700/30 border border-slate-700/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
            "Family house with garden under 30k"
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-700/30 border border-slate-700/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
            "Furnished studio near university"
          </span>
        </div>
        
      </div>
    </div>
    
  </section>
</main>
);

export default AISearchPage;
