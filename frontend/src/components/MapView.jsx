import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// rough coordinates for the demo ports
const PORT_COORDS = {
  Dublin: [53.3498, -6.2603],
  Hamburg: [53.5511, 9.9937],
  Liverpool: [53.4084, -2.9916],
  Rotterdam: [51.9244, 4.4777],
  Cork: [51.8985, -8.4756],
  Oslo: [59.9139, 10.7522],
  Brest: [48.3904, -4.4861],
  Gothenburg: [57.7089, 11.9746],
  'Le Havre': [49.4944, 0.1079],
  Stockholm: [59.3293, 18.0686],
  Bilbao: [43.263, -2.935],
  Tallinn: [59.437, 24.7535],
  Amsterdam: [52.3676, 4.9041],
  Copenhagen: [55.6761, 12.5683],
  Antwerp: [51.2194, 4.4025],
  Riga: [56.9496, 24.1052],
  London: [51.5074, -0.1278],
  'St Petersburg': [59.9311, 30.3609],
  Lisbon: [38.7223, -9.1393],
  Gdansk: [54.352, 18.6466],
};

// display shipment routes with simple weather popups
export default function MapView({ data }) {
  return (
    <MapContainer center={[52, 5]} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data.map((item) => {
        const origin = PORT_COORDS[item.policy.origin] || [0, 0];
        const dest = PORT_COORDS[item.policy.destination] || [0, 0];
        return (
          <React.Fragment key={item.ship_id}>
            {/* route polyline colored by payout status */}
            <Polyline positions={[origin, dest]} color={item.payout ? 'red' : 'green'} />
            <Marker position={origin}>
              <Popup>
                {item.ship_id} - {item.policy.origin} ({item.policy.weather.conditions})
              </Popup>
            </Marker>
            <Marker position={dest}>
              <Popup>{item.policy.destination}</Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
