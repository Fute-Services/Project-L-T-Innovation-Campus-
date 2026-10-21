import {Bg, Foot} from '../../lib/ui';
import {MasterPlan} from '../../lib/widgets';

export const metadata = {title: 'Master Plan'};

export default function Page() {
  return (
    <>
      <Bg cls="fill" k="overview" />
      <div className="credit">Digital rendering</div>
      <MasterPlan />
      <Foot meta="Master Plan" />
    </>
  );
}
