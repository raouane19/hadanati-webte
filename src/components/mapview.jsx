import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const daycares = [
  {
    id: 1,
    name: "Happy Kids",
    position: [35.6971, -0.6308], // Oran example
  },
  {
    id: 2,
    name: "Sunshine Daycare",
    position: [35.7050, -0.6200],
  },
];

export default function MapView() {
  return (
    <MapContainer
      center={[35.6971, -0.6308]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      {/* Map tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers */}
      {daycares.map((daycare) => (
        <Marker key={daycare.id} position={daycare.position}>
          <Popup>{daycare.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}