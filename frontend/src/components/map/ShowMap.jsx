import { useRef, useState } from 'react'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

export default function ShowMap() {
  const map = import.meta.env.VITE_GOOGLE_API_KEY;
  
  const mapRef = useRef(null);
  
  const [position, setPosition] = useState({
      lat: 47.5148, 
      lng: 19.0518,
  });


 function handleLoad(map) {
    mapRef.current = map;
    const newPos = mapRef.current.getCenter().toJSON();
    if (newPos.lat === position.lat && newPos.lng === position.lng) 
    return;
    map.setCenter(position)
  }

  function handleCenter() {
    if (!mapRef.current) return;

    const newPos = mapRef.current.getCenter().toJSON();
    setPosition(newPos);
  }

  return (
  <APIProvider apiKey={map}>
    <Map
      onLoad={handleLoad}
      onDragEnd={handleCenter}
      defaultCenter={position}
      style={{width: '350px', height: '220px'}}
      defaultZoom={17}
      gestureHandling='greedy'
      disableDefaultUI
    >
     <Marker position={position} />
     </Map>
  </APIProvider>
  )
}
