import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ExternalLink, Phone, Navigation, MapPin, Clock } from "lucide-react";

// Icons
const pickupIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4870/4870529.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Animate map center
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
};

const DeliveryNavigation = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  const pickup = location.state?.pickup
    ? [location.state.pickup.lat, location.state.pickup.lng]
    : [19.1139, 72.8518];

  const delivery = location.state?.delivery
    ? [location.state.delivery.lat, location.state.delivery.lng]
    : [19.1197, 72.8574];

  const [driverPos, setDriverPos] = useState(pickup);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [routeInfo, setRouteInfo] = useState({
    distance: 0,
    duration: 0,
    instructions: []
  });
  const [loading, setLoading] = useState(false);

  // Method 1: Enhanced OSRM (Open Source Routing Machine) - FREE
  const fetchRouteOSRM = async (start, end) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true&annotations=true`
      );
      
      if (!response.ok) throw new Error('OSRM API failed');
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
        
        setRouteCoords(coords);
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1), // km
          duration: Math.round(route.duration / 60), // minutes
          instructions: route.legs[0]?.steps?.slice(0, 5).map(step => ({
            instruction: step.maneuver.type,
            distance: (step.distance / 1000).toFixed(1)
          })) || []
        });
      }
    } catch (error) {
      console.error("OSRM Route error:", error);
      // Fallback to MapBox if OSRM fails
      fetchRouteMapBox(start, end);
    } finally {
      setLoading(false);
    }
  };

  // Method 2: MapBox Directions API (FREE tier available)
  const fetchRouteMapBox = async (start, end) => {
    try {
      // You'll need to get a free MapBox API key from https://www.mapbox.com/
      const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE'; // Replace with your token
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}`
      );
      
      if (!response.ok) throw new Error('MapBox API failed');
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
        
        setRouteCoords(coords);
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1),
          duration: Math.round(route.duration / 60),
          instructions: route.legs[0]?.steps?.slice(0, 5).map(step => ({
            instruction: step.maneuver.instruction,
            distance: (step.distance / 1000).toFixed(1)
          })) || []
        });
      }
    } catch (error) {
      console.error("MapBox Route error:", error);
      // Fallback to simple straight line
      setRouteCoords([start, end]);
    }
  };

  // Method 3: GraphHopper API (FREE tier available)
  const fetchRouteGraphHopper = async (start, end) => {
    try {
      // Get free API key from https://www.graphhopper.com/
      const GRAPHHOPPER_KEY = 'YOUR_GRAPHHOPPER_KEY_HERE';
      
      const response = await fetch(
        `https://graphhopper.com/api/1/route?point=${start[0]},${start[1]}&point=${end[0]},${end[1]}&vehicle=car&instructions=true&calc_points=true&key=${GRAPHHOPPER_KEY}`
      );
      
      if (!response.ok) throw new Error('GraphHopper API failed');
      
      const data = await response.json();
      
      if (data.paths && data.paths.length > 0) {
        const path = data.paths[0];
        // Decode polyline (you'd need a polyline decoder library)
        // For now, using simple coordinates
        setRouteCoords([start, end]);
        setRouteInfo({
          distance: (path.distance / 1000).toFixed(1),
          duration: Math.round(path.time / 60000),
          instructions: []
        });
      }
    } catch (error) {
      console.error("GraphHopper Route error:", error);
    }
  };

  // Start tracking
  const startTracking = () => {
    setIsTracking(true);
  };

  // Watch driver live location
  useEffect(() => {
    if (isTracking && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPos = [position.coords.latitude, position.coords.longitude];
          setDriverPos(newPos);
          
          // Fetch updated route from current driver position to delivery
          fetchRouteOSRM(newPos, delivery);
        },
        (error) => console.error("Location error:", error),
        { 
          enableHighAccuracy: true, 
          maximumAge: 5000, 
          timeout: 10000 
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isTracking, delivery]);

  // Initial route (pickup -> delivery)
  useEffect(() => {
    fetchRouteOSRM(pickup, delivery);
  }, [pickup, delivery]);

  // Format distance for display
  const formatDistance = (km) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km}km`;
  };

  return (
    <div className="w-full relative">
      <MapContainer
        center={pickup}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "510px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Pickup Marker */}
        <Marker position={pickup} icon={pickupIcon} />

        {/* Delivery Marker */}
        <Marker position={delivery} icon={deliveryIcon} />

        {/* Driver Marker */}
        <Marker position={driverPos} icon={driverIcon} />

        {/* Keep map centered on driver when tracking */}
        {isTracking && <RecenterMap position={driverPos} />}

        {/* Route Polyline with better styling */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="#2563eb"
            weight={5}
            opacity={0.8}
            dashArray="0"
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapContainer>

      {/* Enhanced Bottom Card with Route Info */}
      <div className="absolute left-0 right-0 bg-white rounded-t-3xl">
        {/* Route Info Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-t-3xl border-b">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {formatDistance(routeInfo.distance)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {routeInfo.duration}min
              </span>
            </div>
          </div>
          {loading && (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <div className="p-4">
          {/* Customer Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-blue-700">
                {orderData?.customer?.name?.charAt(0) || "C"}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {orderData?.customer?.name || "Customer"}
              </p>
              <p className="text-sm text-gray-600">
                {orderData?.customer?.phone || "+91 9876543210"}
              </p>
            </div>
            <a
              href={`tel:${orderData?.customer?.phone || "+919876543210"}`}
              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Phone className="w-5 h-5 text-white" />
            </a>
          </div>

          {/* Delivery Address */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">
              Delivery Address
            </p>
            <p className="text-sm text-gray-700">
              {location.state?.delivery?.address || "123 Sample Street, Mumbai, Maharashtra"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={startTracking}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                isTracking
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span>{isTracking ? "Tracking Active" : "Start Navigation"}</span>
              </div>
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${delivery[0]},${delivery[1]}&travelmode=driving`,
                  "_blank"
                )
              }
              className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryNavigation;