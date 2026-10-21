import {Bg, Foot, Sheet} from '../../lib/ui';
import {VR} from '../../lib/widgets';

export const metadata = {title: 'VR'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="overview" />
      <Sheet label="Virtual Reality" cap="360° experience" title="Virtual Reality">
        <VR />
        <p className="note">Preview from the façade rendering · 360° views to be added</p>
      </Sheet>
      <Foot meta="VR" />
    </>
  );
}
