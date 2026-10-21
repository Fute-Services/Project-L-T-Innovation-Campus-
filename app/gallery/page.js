import {Bg, Foot, Sheet} from '../../lib/ui';
import {Gallery} from '../../lib/widgets';

export const metadata = {title: 'Gallery'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="overview" />
      <Sheet cap="Digital renderings" title="Gallery"><Gallery /></Sheet>
      <Foot meta="Gallery" />
    </>
  );
}
