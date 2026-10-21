import {Bg, Foot} from '../../lib/ui';
import {Amenities} from '../../lib/widgets';

export const metadata = {title: 'Amenities'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="overview" />
      <Amenities />
      <Foot meta="Amenities" />
    </>
  );
}
