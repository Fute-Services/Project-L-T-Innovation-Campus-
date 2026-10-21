import {Bg} from '../../lib/ui';
import {Circulation} from '../../lib/widgets';

export const metadata = {title: 'Circulation'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="overview" />
      <Circulation />
    </>
  );
}
