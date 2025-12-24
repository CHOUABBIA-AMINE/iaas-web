/**
 * Station Markers Component
 * Renders station markers on the map with hover popups and click-to-edit
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker, Popup } from 'react-leaflet';
import { Marker as LeafletMarker } from 'leaflet';
import { StationDTO } from '../../core/dto';
import { icons, toLatLng } from '../utils';
import { MarkerPopup } from './MarkerPopup';
import { renderToStaticMarkup } from 'react-dom/server';

interface StationMarkersProps {
  stations: StationDTO[];
}

export const StationMarkers: React.FC<StationMarkersProps> = ({ stations }) => {
  const navigate = useNavigate();
  
  return (
    <>
      {stations.map((station) => {
        const markerRef = useRef<LeafletMarker>(null);
        
        return (
          <Marker
            key={`station-${station.id}`}
            position={toLatLng(station)}
            icon={icons.station}
            ref={markerRef}
            eventHandlers={{
              mouseover: () => {
                markerRef.current?.openPopup();
              },
              mouseout: () => {
                markerRef.current?.closePopup();
              },
              click: () => {
                // Navigate to edit page on click
                navigate(`/network/core/stations/${station.id}/edit`);
              },
            }}
          >
            <Popup closeButton={false}>
              <div dangerouslySetInnerHTML={{ 
                __html: renderToStaticMarkup(
                  <MarkerPopup data={station} type="station" />
                )
              }} />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
