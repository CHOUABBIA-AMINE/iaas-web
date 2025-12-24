/**
 * Hydrocarbon Field Markers Component
 * Renders hydrocarbon field markers on the map with hover popups
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Marker as LeafletMarker } from 'leaflet';
import { HydrocarbonFieldDTO } from '../../core/dto';
import { icons, toLatLng } from '../utils';
import { MarkerPopup } from './MarkerPopup';
import { renderToStaticMarkup } from 'react-dom/server';

interface HydrocarbonFieldMarkersProps {
  hydrocarbonFields: HydrocarbonFieldDTO[];
}

export const HydrocarbonFieldMarkers: React.FC<HydrocarbonFieldMarkersProps> = ({ 
  hydrocarbonFields 
}) => {
  return (
    <>
      {hydrocarbonFields.map((field) => {
        const markerRef = useRef<LeafletMarker>(null);
        
        return (
          <Marker
            key={`field-${field.id}`}
            position={toLatLng(field)}
            icon={icons.hydrocarbonField}
            ref={markerRef}
            eventHandlers={{
              mouseover: () => {
                markerRef.current?.openPopup();
              },
              mouseout: () => {
                markerRef.current?.closePopup();
              },
            }}
          >
            <Popup>
              <div dangerouslySetInnerHTML={{ 
                __html: renderToStaticMarkup(
                  <MarkerPopup data={field} type="hydrocarbonField" />
                )
              }} />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
