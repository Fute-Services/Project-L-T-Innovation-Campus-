import {Bg, Foot, Sheet} from '../../lib/ui';
import {Walkthrough} from '../../lib/widgets';

export const metadata = {title: 'Walkthrough'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="facade" />
      <Sheet cap="Film" title="Walkthrough"><Walkthrough /></Sheet>
      <Foot meta="Walkthrough" />
    </>
  );
}
