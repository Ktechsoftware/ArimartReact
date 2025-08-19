import { MapPin, Navigation, Clock, Package, Users, ChevronRight, Map } from "lucide-react";
import { useState } from "react";

const deliveryAreas = [
  {
    id: "AREA-001",
    name: "Andheri East Zone",
    status: "active",
    priority: "high",
    orders: 15,
    avgDeliveryTime: "25 mins",
    coverage: "95%",
    landmarks: ["Metro Station", "Phoenix Mall", "SEEPZ"],
    boundaries: "From Chakala to Marol, including MIDC area"
  },
  {
    id: "AREA-002", 
    name: "Bandra West Zone",
    status: "active",
    priority: "medium",
    orders: 8,
    avgDeliveryTime: "30 mins", 
    coverage: "88%",
    landmarks: ["Linking Road", "Hill Road", "Bandstand"],
    boundaries: "From Carter Road to SV Road, excluding Khar"
  },
  {
    id: "AREA-003",
    name: "Powai Zone", 
    status: "inactive",
    priority: "low",
    orders: 3,
    avgDeliveryTime: "35 mins",
    coverage: "72%", 
    landmarks: ["Hiranandani", "IIT Bombay", "Powai Lake"],
    boundaries: "Powai region including Chandivali and Kanjurmarg East"
  }
];

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200", 
  low: "bg-gray-100 text-gray-700 border-gray-200"
};

const statusColors = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200"
};

export const AllottedArea = () =>{
  const [selectedArea, setSelectedArea] = useState(null);
  const activeAreas = deliveryAreas.filter(area => area.status === "active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Map className="w-6 h-6 text-slate-600" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Delivery Areas</h1>
            <p className="text-sm text-slate-600">Your assigned zones and coverage areas</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-sm text-slate-600">Active Areas</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{activeAreas}</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-slate-600">Avg Time</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">28m</p>
          </div>
        </div>

        {/* Areas List */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-slate-800 mb-3">Your Assigned Areas</h2>
          
          {deliveryAreas.map((area) => (
            <div key={area.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
              
              {/* Area Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800">{area.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[area.status]}`}>
                          {area.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[area.priority]}`}>
                          {area.priority} priority
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-800">{area.orders}</p>
                          <p className="text-xs text-slate-500">Orders</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-800">{area.avgDeliveryTime}</p>
                          <p className="text-xs text-slate-500">Avg Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-800">{area.coverage}</p>
                          <p className="text-xs text-slate-500">Coverage</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      selectedArea === area.id ? "rotate-90" : ""
                    }`} 
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedArea === area.id && (
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                  <div className="space-y-4">
                    
                    {/* Boundaries */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Coverage Boundaries</h4>
                      <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                        {area.boundaries}
                      </p>
                    </div>

                    {/* Landmarks */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Key Landmarks</h4>
                      <div className="flex flex-wrap gap-2">
                        {area.landmarks.map((landmark, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-200"
                          >
                            {landmark}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        <Navigation className="w-4 h-4" />
                        Navigate
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium">
                        <Package className="w-4 h-4" />
                        View Orders
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Location Status */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Navigation className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-slate-700">Current Location</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Currently in: Andheri East Zone</p>
              <p className="text-sm text-slate-600">Near Metro Station, 0.5 km from hub</p>
            </div>
            <div className="text-right">
              <div className="w-3 h-3 bg-green-500 rounded-full mb-1"></div>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="w-1 bg-blue-500 rounded-full flex-shrink-0"></div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Area Assignment Info</h4>
              <p className="text-sm text-blue-700">
                Your delivery areas are assigned based on location, experience, and current demand. 
                Tap any area to view detailed boundaries and navigate to pickup points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}