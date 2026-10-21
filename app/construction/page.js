import {Bg, Foot, Sheet} from '../../lib/ui';
import {Progress} from '../../lib/widgets';

export const metadata = {title: 'Construction'};

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="overview" />
      <Sheet cap="Site updates" title="Construction Progress">
        <Progress />
        <p className="note" style={{color: 'var(--yellow)'}}>Sample progress for layout · Replace with the latest site report</p>
      </Sheet>
      <Foot meta="Construction" />
    </>
  );
}
