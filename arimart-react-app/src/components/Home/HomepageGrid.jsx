import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomepageGrid() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-200 min-h-screen px-4 py-6 hidden sm:block">
      {/* Top Banner Carousel */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6">
        <img
          src="https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/af_pc_2x._CB792409181_.jpg"
          alt="Top Banner"
          className="w-full object-cover object-center"
        />
        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
          <ChevronLeft />
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
          <ChevronRight />
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Card 1: Pick up where you left off */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-sm mb-3">Pick up where you left off</h3>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://via.placeholder.com/150x90?text=Item+${i}`}
                className="rounded"
                alt=""
              />
            ))}
          </div>
          <a href="#" className="text-blue-500 text-sm mt-2 inline-block">See more</a>
        </div>

        {/* Card 2: Categories to explore */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-sm mb-3">Categories to explore</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Ironing spray bottles",
              "PC game controllers",
              "Cat shampoos",
              "Electric kettles"
            ].map((label, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <img
                  src="https://via.placeholder.com/80"
                  alt={label}
                  className="rounded mb-1"
                />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Deals related to items saved */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-sm mb-3">Deals related to items you’ve saved</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://via.placeholder.com/150x120?text=Deal+${i}`}
                className="rounded w-full"
                alt=""
              />
            ))}
          </div>
          <a href="#" className="text-blue-500 text-sm mt-2 inline-block">See all deals</a>
        </div>

        {/* Card 4: Side Banners */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <img
              src="https://m.media-amazon.com/images/G/31/img24/Business/January24GW/PC_CC-379x304.jpg"
              className="w-full"
              alt="Business Banner"
            />
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <img
              src="https://m.media-amazon.com/images/G/31/img24/Events/Gateway/Anime-Store-PC_CC-1x._SY304_CB561933370_.jpg"
              className="w-full"
              alt="Anime Banner"
            />
          </div>
        </div>
      </div>

      {/* Optional Lower Grid Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Other promotional cards */}
        {["Revamp home", "Under ₹499", "Top accessories"].map((title, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-sm mb-3">{title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://via.placeholder.com/100x100?text=Item+${i}`}
                  className="rounded"
                  alt=""
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
