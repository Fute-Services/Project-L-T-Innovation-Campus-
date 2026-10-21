import {Bg, Foot} from '../../lib/ui';
import {Hud} from '../../lib/widgets';

export const metadata = {title: 'Drone View'};

export default function Page() {
  return (
    <>
      <Bg cls="kb" k="facade" />
      <Hud />
      <Foot meta="Drone View" tag />
    </>
  );
}
