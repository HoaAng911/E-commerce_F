export default function PromoBanner() {
  return (
    <section className="relative h-[350px] sm:h-[400px] rounded-[2.5rem] overflow-hidden group shadow-2xl cursor-pointer">

      <div className="absolute inset-0 z-10 transition-opacity duration-700 bg-gradient-to-r from-slate-900/90 via-blue-900/60 to-transparent group-hover:opacity-80" />
      <img
        src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070"
        className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-1"
        alt="Summer Collection Promo"
      />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30 transition-all duration-700 group-hover:opacity-60 group-hover:scale-125 z-10"></div>
      <div className="absolute inset-0 z-20 flex flex-col justify-center w-full px-8 sm:px-14 md:w-3/4 lg:w-2/3">
        <div className="flex items-center gap-3 mb-4 transition-all duration-500 delay-100 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="w-10 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          <span className="text-blue-400 font-bold tracking-[0.3em] uppercase text-xs sm:text-sm drop-shadow-md">
            New Season
          </span>
        </div>
        <h3 className="text-5xl sm:text-6xl md:text-7xl italic font-black tracking-tighter text-white uppercase leading-[1.05] drop-shadow-2xl transform translate-y-4 transition-all duration-500 delay-150 group-hover:translate-y-0">
          Summer <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400">
            Collection
          </span>
        </h3>
        <button className="flex items-center gap-3 px-8 py-3.5 mt-8 text-sm font-bold text-black uppercase transition-all duration-300 bg-white rounded-full w-fit hover:bg-blue-600 hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transform translate-y-4 opacity-0 transition-all duration-500 delay-200 group-hover:translate-y-0 group-hover:opacity-100">
          <span>Mua ngay</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  )
}