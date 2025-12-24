/**
 * Terminal Markers Component
 * Renders terminal markers on the map with hover popups
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Marker as LeafletMarker } from 'leaflet';
import { TerminalDTO } from '../../core/dto';
import { icons, toLatLng } from '../utils';
import { MarkerPopup } from './MarkerPopup';
import { renderToStaticMarkup } from 'react-dom/server';

interface TerminalMarkersProps {
  terminals: TerminalDTO[];
}

export const TerminalMarkers: React.FC<TerminalMarkersProps> = ({ terminals }) => {
  return (
    <>
      {terminals.map((terminal) => {
        const markerRef = useRef<LeafletMarker>(null);
        
        return (
          <Marker
            key={`terminal-${terminal.id}`}
            position={toLatLng(terminal)}
            icon={icons.terminal}
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
                  <MarkerPopup data={terminal} type="terminal" />
                )
              }} />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
