/* ================= PROJECT IMAGES =================
   Each image loads the local copy first (public/assets/img/photos/...) and falls back to the
   L&T Realty website. Add walkthrough stills by appending entries with a `local` path. */
export const IMG = {
  overview: {local: '/assets/img/photos/lt-innovation-campus-overview.webp',
             remote: 'https://www.lntrealty.com/wp-content/uploads/2020/10/LT-INNOVATION-CAMPUS-Overview.webp',
             c: 'Campus overview'},
  facade:   {local: '/assets/img/photos/lt-innovation-campus-facade.jpg',
             remote: 'https://www.lntrealty.com/wp-content/uploads/2020/10/lnt_comm_tower_mast_banner_03072019.jpg',
             c: 'Façade at dusk'}
};
/* Walkthrough stills: drop files in public/assets/img/photos/ and list them here, e.g.
   {local:'/assets/img/photos/wt-01-arrival.jpg',c:'Arrival'} — they appear in Gallery,
   Walkthrough and Brochure automatically. */
export const STILLS = [];
export const WALKTHROUGH_VIDEO = ''; /* e.g. '/assets/video/walkthrough.mp4' */
export const BROCHURE_PDF = '';      /* e.g. '/assets/brochure.pdf' */

export const PICS = [IMG.overview, IMG.facade, ...STILLS];

export const NAV_L = [
  ['home', 'Master Plan', '<path d="M3 17V7l7-4 7 4v10M3 17h14M7 17v-5h6v5"/>'],
  ['location', 'Location', '<path d="M10 18s-6-5.5-6-10a6 6 0 0112 0c0 4.5-6 10-6 10z"/><circle cx="10" cy="8" r="2"/>'],
  ['amenities', 'Amenities', '<path d="M4 16C4 9 9 4 16 4c0 7-5 12-12 12zM4 16l7-7"/>'],
  ['project-details', 'Project Details', '<path d="M5 2h7l4 4v12H5zM12 2v4h4M8 10h5M8 13h5"/>'],
  ['vr', 'VR', '<path d="M2 7h16v7h-5l-2-2h-2l-2 2H2z"/><circle cx="6" cy="10.5" r="1.4"/><circle cx="14" cy="10.5" r="1.4"/>'],
  ['brochure', 'Brochure', '<path d="M10 5C8 3.5 5 3 2 3.5v12c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-12C15 3 12 3.5 10 5zM10 5v12"/>']
];
export const NAV_R = [
  ['circulation', 'Circulation', '<path d="M3 6h11l-3-3M17 14H6l3 3"/>'],
  ['project-info', 'Project Info', '<circle cx="10" cy="10" r="7.5"/><path d="M10 9v5M10 6.2v.4"/>'],
  ['construction', 'Construction', '<path d="M3 17h14M5 17V9h3v8M10 17V5h3v12M15 17v-5"/>'],
  ['walkthrough', 'Walkthrough', '<rect x="2" y="4" width="16" height="12"/><path d="M8.5 7.5l4 2.5-4 2.5z"/>'],
  ['gallery', 'Gallery', '<rect x="2" y="4" width="16" height="12"/><path d="M2 13l5-4 4 3 3-2 4 3"/><circle cx="14" cy="7.5" r="1.2"/>'],
  ['droneview', 'Drone View', '<path d="M7 8h6v4H7zM7 8L4 5M13 8l3-3M7 12l-3 3M13 12l3 3"/><circle cx="4" cy="5" r="1.6"/><circle cx="16" cy="5" r="1.6"/><circle cx="4" cy="15" r="1.6"/><circle cx="16" cy="15" r="1.6"/>']
];
export const ORDER = [...NAV_L, ...NAV_R].map(n => n[0]);

export const ICON = {
  floors: '<path d="M3 17h14M5 17V4h10v13M8 7h4M8 10h4M8 13h4"/>',
  leaf: '<path d="M4 16C4 9 9 4 16 4c0 7-5 12-12 12zM4 16l7-7"/>',
  door: '<path d="M4 17V3h12v14M2 17h16M12 10v1"/>',
  car: '<path d="M3 13l2-5h10l2 5v3H3zM6 16v1M14 16v1"/><circle cx="6.5" cy="13" r=".8"/><circle cx="13.5" cy="13" r=".8"/>',
  coffee: '<path d="M4 8h10v4a4 4 0 01-4 4H8a4 4 0 01-4-4zM14 9h1.5a2 2 0 010 4H14M7 3v2M10 3v2"/>',
  bag: '<path d="M4 7h12l-1 10H5zM7 7a3 3 0 016 0"/>',
  chat: '<path d="M3 4h14v9H8l-4 3v-3H3z"/>',
  play: '<circle cx="10" cy="10" r="7"/><path d="M8.5 7.5l4 2.5-4 2.5z"/>',
  shield: '<path d="M10 2l6 3v5c0 4-3 7-6 8-3-1-6-4-6-8V5z"/><path d="M7.5 10l2 2 3.5-4"/>',
  chip: '<rect x="5" y="5" width="10" height="10"/><path d="M8 2v3M12 2v3M8 15v3M12 15v3M2 8h3M2 12h3M15 8h3M15 12h3"/>'
};

/* x / y are fractions of the overview image */
export const HOT = [
  {x: .53, y: .36, t: 'Office Floors', k: 'Grade-A workspace', d: 'Large, efficient floor plates with flexible layouts for IT/ITeS, BFSI and corporate occupiers.'},
  {x: .74, y: .52, t: 'Green Building', k: 'LEED Platinum', d: 'Certified green building with energy-efficient systems and EV-ready infrastructure.'},
  {x: .73, y: .86, t: 'Grand Entrance', k: 'Arrival', d: 'An iconic entrance with smart building management and high-speed elevators.'},
  {x: .34, y: .89, t: 'Drop-off & Parking', k: 'Access', d: 'Ample parking with well-planned transit facilities and seamless internal circulation.'}
];

export const PLACES = [['L&T Business Park', 'Across the road', 'Adjacent', 392, 350], ['Upcoming metro station', 'Ramabaug · 400 m', '0.5 km', 300, 378], ['Eastern & Western Express Hwy', 'Arterial', '6 km', 497, 410], ['International Airport', 'Mumbai T2', '6 km', 150, 440], ['Bandra-Kurla Complex', 'Via Kurla', '11 km', 72, 486], ['Domestic Airport', 'Mumbai T1', '11 km', 110, 470], ['Airoli', 'Navi Mumbai', '15 km', 548, 110]];

export const AMENITIES = [['work', 'door', 'Grand Entrance', 'Iconic arrival with smart building management and high-speed elevators.'], ['work', 'coffee', 'Dining & F&B', 'Restaurants and cafés within the campus ecosystem.'], ['work', 'bag', 'Luxury Retail', 'Retail for everyday needs and premium brands.'], ['well', 'chat', 'Breakout Zones', 'Informal spaces for teams to meet, pause and reset.'], ['well', 'play', 'Recreation', 'Recreational spaces for life beyond the desk.'], ['green', 'leaf', 'LEED Platinum', 'Certified green building with energy-efficient systems.'], ['green', 'car', 'EV-ready Parking', 'Ample parking with planned internal circulation.'], ['well', 'shield', '3-tier Security', 'Round-the-clock security with integrated BMS.'], ['work', 'chip', 'Digital Infrastructure', 'Digitally advanced building systems.']];

/* sample data, replace with the latest site report */
export const PROGRESS = [['Substructure', 100, 'Complete'], ['Superstructure', 100, 'Complete'], ['Façade', 92, 'In progress'], ['MEP services', 80, 'In progress'], ['Interiors & fit-out', 64, 'In progress'], ['Landscape & external works', 45, 'In progress']];

export const PAGES = [
  {cover: 1, img: 'overview', t: 'L&T Innovation Campus', s: 'Powai (W), Mumbai'},
  {n: '01 · Overview', t: 'A premier Grade-A campus', p: 'Designed for global enterprises, with world-class infrastructure, sustainability features and seamless connectivity.', img: 'facade'},
  {n: '02 · Ecosystem', t: 'Work, live, play, learn', p: 'Luxury retail, F&B, luxury residences and an international school sit within the same Powai neighbourhood.'},
  {n: '03 · Workplace', t: 'Floors built for enterprise', p: 'Large, efficient floor plates with flexible layouts for IT/ITeS, BFSI and corporate occupiers.', img: 'overview'},
  {n: '04 · Sustainability', t: 'LEED Platinum', p: 'Energy-efficient systems, EV-ready infrastructure and green building principles throughout.'},
  {n: '05 · Visit', t: 'Plan your visit', p: 'Gate No. 2, L&T Powai Campus, Saki Vihar Road, Powai, Mumbai.'}
];

export const CHAPTERS = STILLS.length
  ? STILLS.map(s => [s.c, '', s])
  : [['Approach', '0:00', IMG.facade], ['Façade', '0:40', IMG.facade], ['Arrival & entrance', '1:20', IMG.overview], ['Campus overview', '2:00', IMG.overview]];
