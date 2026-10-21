import {Bg, Foot, Sheet} from '../../lib/ui';

export const metadata = {title: 'Project Info'};

const KV = [['Grade', 'A', 'IT / ITeS'], ['Green rating', 'LEED', 'Platinum'], ['Security', '3-tier', '24 / 7'], ['Metro', '400', 'm away'], ['International airport', '6', 'km'], ['BKC', '11', 'km']];

export default function Page() {
  return (
    <>
      <Bg cls="dim" k="facade" />
      <Sheet cap="At a glance" title="Project Info">
        <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
          <p className="lede">A premier Grade-A commercial development by L&amp;T Realty, designed for global and domestic enterprises, with world-class infrastructure, sustainability features and seamless connectivity in the heart of Powai.</p>
          <div className="kvs">{KV.map(k => <div key={k[0]}><span className="cap">{k[0]}</span><b>{k[1]}<small>{k[2]}</small></b></div>)}</div>
          <p className="cap" style={{color: '#fff'}}>Gate No. 2, L&amp;T Powai Campus, Saki Vihar Road, Powai, Mumbai</p>
        </div>
      </Sheet>
      <Foot meta="Project Info" />
    </>
  );
}
