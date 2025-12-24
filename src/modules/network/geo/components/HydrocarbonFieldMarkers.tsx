/**
 * Hydrocarbon Field Markers Component
 * Renders hydrocarbon field markers on the map
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { Marker, Popup } from 'react-leaflet';
import { HydrocarbonFieldDTO } from '../../core/dto';
import { icons, toLatLng } from '../utils';
import { MarkerPopup } from './MarkerPopup';
import { renderToStaticMarkup } from 'react-dom/server';

interface HydrocarbonFieldMarkersProps {
  hydrocarbonFields: HydrocarbonFieldDTO[];
}

export const HydrocarbonFieldMarkers: React.FC<HydrocarbonFieldMarkersProps> = ({ hydrocarbonFields }) => {
  return (
    <>
      {hydrocarbonFields.map((field) => (
        <Marker
          key={`field-${field.id}`}
          position={toLatLng(field)}
          icon={icons.hydrocarbonField}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ 
              __html: renderToStaticMarkup(
                <MarkerPopup data={field} type="hydrocarbonField" />
              )
            }} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};
