import {Bg, Foot, Sheet} from '../../lib/ui';
import {LocationMap} from '../../lib/widgets';

export const metadata = {title: 'Location'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="facade" />
      <Sheet cap="Connectivity" title="Location">
        <LocationMap />
        <p className="note">Map is schematic and not to scale · Distances as published by L&amp;T Realty</p>
      </Sheet>
      <Foot meta="Location" />
    </>
  );
}
