import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapView({ center = [23.0225, 72.5714], zoom = 13, markerText = "You are here" }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>{markerText}</Popup>
      </Marker>
    </MapContainer>
  );
}
export default MapView;
