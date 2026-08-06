const Review = () => {
  return (
    <div className="mt-10 pt-8 border-t border-slate-700/50">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-xl">⭐</span>
        Ratings & Reviews
      </h2>
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-slate-400">Coming Soon</span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-2">Reviews</h3>
            <p className="text-sm text-slate-500">No reviews yet. Be the first to review!</p>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Write a Review</h3>
            <textarea
              rows={3}
              disabled
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="This feature will be available soon..."
            />
            <button
              disabled
              className="mt-3 px-6 py-2.5 bg-slate-700/50 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;