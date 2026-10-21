import {Bg, Foot, Sheet} from '../../lib/ui';

export const metadata = {title: 'Project Details'};

const Spec = ({head, rows}) => (
  <table className="spec"><tbody>
    <tr><th colSpan="2">{head}</th></tr>
    {rows.map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>)}
  </tbody></table>
);

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="facade" />
      <Sheet cap="Specifications" title="Project Details">
        <div className="grid2">
          <Spec head="Key differentiators" rows={[
            ['Ecosystem', 'Luxury retail, F&B, luxury residences and an international school: work, live, play, learn'],
            ['Green building', 'LEED Platinum certified'],
            ['Security', '24/7 three-tier security with integrated BMS'],
            ['Infrastructure', 'Digitally advanced building systems'],
            ['Metro', '400 m from upcoming Ramabaug station; Metro Lines 1 & 3 network'],
            ['Builder', 'L&T world-class construction']]} />
          <Spec head="Key features" rows={[
            ['Category', 'Grade-A IT/ITeS campus'],
            ['Occupiers', 'IT/ITeS, BFSI and corporate'],
            ['Workspaces', 'Large, efficient floor plates with flexible layouts'],
            ['Design', 'Grand entrance, smart building management, high-speed elevators'],
            ['Access', 'Ample parking and seamless internal circulation'],
            ['Sustainability', 'Energy-efficient systems and EV-ready infrastructure']]} />
        </div>
      </Sheet>
      <Foot meta="Project Details" />
    </>
  );
}
