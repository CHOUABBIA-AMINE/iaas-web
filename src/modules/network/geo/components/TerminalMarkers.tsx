/**
 * Terminal Markers Component
 * Renders terminal markers on the map
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { Marker, Popup } from 'react-leaflet';
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
      {terminals.map((terminal) => (
        <Marker
          key={`terminal-${terminal.id}`}
          position={toLatLng(terminal)}
          icon={icons.terminal}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ 
              __html: renderToStaticMarkup(
                <MarkerPopup data={terminal} type="terminal" />
              )
            }} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};
