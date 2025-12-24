/**
 * Station Markers Component
 * Renders station markers on the map
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { Marker, Popup } from 'react-leaflet';
import { StationDTO } from '../../core/dto';
import { icons, toLatLng } from '../utils';
import { MarkerPopup } from './MarkerPopup';
import { renderToStaticMarkup } from 'react-dom/server';

interface StationMarkersProps {
  stations: StationDTO[];
}

export const StationMarkers: React.FC<StationMarkersProps> = ({ stations }) => {
  return (
    <>
      {stations.map((station) => (
        <Marker
          key={`station-${station.id}`}
          position={toLatLng(station)}
          icon={icons.station}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ 
              __html: renderToStaticMarkup(
                <MarkerPopup data={station} type="station" />
              )
            }} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};
