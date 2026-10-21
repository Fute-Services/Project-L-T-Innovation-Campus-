import {Bg, Foot, Sheet} from '../../lib/ui';
import {Brochure} from '../../lib/widgets';

export const metadata = {title: 'Brochure'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="facade" />
      <Sheet cap="Digital edition" title="Brochure"><Brochure /></Sheet>
      <Foot meta="Brochure" />
    </>
  );
}
