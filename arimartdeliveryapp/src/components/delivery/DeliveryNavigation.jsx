import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Custom marker icon
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const pickup = [19.1139, 72.8518];
const delivery = [19.1197, 72.8574];

const DeliveryNavigation = () => {
  const [driverPos, setDriverPos] = useState(pickup);
  const [routeCoords, setRouteCoords] = useState([]);

  // Get route from OSRM free API
  useEffect(() => {
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${delivery[1]},${delivery[0]}?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
        setRouteCoords(coords);
      });
  }, []);

  // Simulate driver moving every 2s (you can replace with real GPS)
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < routeCoords.length) {
        setDriverPos(routeCoords[index]);
        index++;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [routeCoords]);

  return (
    <div className="w-full h-screen relative">
      <MapContainer
        center={pickup}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "60%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <Marker position={pickup} icon={icon} />
        <Marker position={delivery} icon={icon} />
        <Marker position={driverPos} icon={icon}>
          <div className="bg-blue-500 w-2 h-2 rounded-full" />
        </Marker>

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" weight={4} />
        )}
      </MapContainer>

      {/* Bottom card UI */}
      <div className="absolute bottom-40 left-0 right-0 bg-white p-4 rounded-t-2xl shadow-md">
        <p className="text-gray-600 font-semibold">Aman Sharma</p>
        <p className="text-sm text-gray-500">
          Delivery: 201/D, Ananta Apts, Near Jal Bhawan, Andheri 400069
        </p>
        <button className="bg-red-500 text-white mt-2 w-full py-2 rounded-full">
          Start
        </button>
      </div>
    </div>
  );
};

export default DeliveryNavigation;
