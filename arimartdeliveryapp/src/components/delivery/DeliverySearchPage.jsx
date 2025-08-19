import { Search, Package, MapPin, Clock, Filter, X } from "lucide-react";
import { useState } from "react";

const sampleData = [
  {
    id: "ORD-11253",
    type: "order",
    customer: "Priya Sharma",
    address: "Bandra West, Mumbai",
    amount: "₹450",
    status: "pending",
    time: "2:30 PM",
    distance: "2.5 km"
  },
  {
    id: "ORD-11254", 
    type: "order",
    customer: "Rajesh Kumar",
    address: "Andheri East, Mumbai", 
    amount: "₹320",
    status: "ready",
    time: "3:15 PM",
    distance: "1.8 km"
  },
  {
    id: "ORD-11255",
    type: "order", 
    customer: "Sneha Patel",
    address: "Powai, Mumbai",
    amount: "₹275",
    status: "delivered",
    time: "1:45 PM", 
    distance: "4.2 km"
  },
  {
    id: "HUB-001",
    type: "location",
    name: "Andheri Distribution Hub",
    address: "Near Metro Station, Andheri East",
    status: "active",
    orders: "12 pending"
  },
  {
    id: "HUB-002", 
    type: "location",
    name: "Bandra Pickup Point",
    address: "Hill Road, Bandra West", 
    status: "active",
    orders: "8 pending"
  }
];

const statusColors = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  ready: "bg-blue-100 text-blue-700 border-blue-200", 
  delivered: "bg-green-100 text-green-700 border-green-200",
  active: "bg-green-100 text-green-700 border-green-200"
};

export const DeliverySearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    { key: "all", label: "All" },
    { key: "order", label: "Orders" },
    { key: "location", label: "Locations" },
    { key: "pending", label: "Pending" },
    { key: "ready", label: "Ready" }
  ];

  const filteredData = sampleData.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.customer && item.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === "all" || 
      item.type === selectedFilter ||
      item.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Search</h1>
          <p className="text-sm text-slate-600">Find orders, locations, and more</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Filter className="text-slate-400 w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-700">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter.key
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No results found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
                {item.type === "order" ? (
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Package className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{item.id}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">{item.customer}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{item.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-slate-800">{item.amount}</p>
                      <p className="text-sm text-slate-500">{item.distance}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800">{item.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{item.address}</p>
                      <p className="text-sm text-blue-600 font-medium">{item.orders}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {searchQuery === "" && selectedFilter === "all" && (
          <div className="mt-8 bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="font-medium text-slate-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedFilter("pending")}
                className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
              >
                <Package className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">Pending Orders</span>
              </button>
              <button
                onClick={() => setSelectedFilter("ready")}
                className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <Package className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Ready for Pickup</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}