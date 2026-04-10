const canvas = document.getElementById('pearls');
const ctx = canvas.getContext('2d');
const bgBlur = document.getElementById('bg-blur');
const hoverCard = document.getElementById('hover-card');
const threadPath = document.getElementById('thread-path');

const paintings = [
    { title: "Girl with a Pearl Earring",            artist: "Johannes Vermeer",       year: "c. 1665", img: "public/1.jpg", cardBg: "#50a1da", wiki: "https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring" },
    { title: "Woman with a Pearl Necklace",           artist: "Johannes Vermeer",       year: "c. 1664", img: "public/2.jpg", cardBg: "#9ae4a7", wiki: "https://en.wikipedia.org/wiki/Woman_with_a_Pearl_Necklace" },
    { title: "The Infanta Maria Theresa of Spain",    artist: "Diego Velázquez",        year: "c. 1653", img: "public/3.jpg", cardBg: "#eec924", wiki: "https://en.wikipedia.org/wiki/The_Infanta_Maria_Theresa_of_Spain" },
    { title: "Woman with a Pearl Necklace in a Loge", artist: "Mary Cassatt",          year: "c. 1879", img: "public/4.jpg", cardBg: "#efaeb0", wiki: "https://en.wikipedia.org/wiki/Woman_with_a_Pearl_Necklace_in_a_Loge" },
    { title: "Portrait of Adele Bloch-Bauer I",      artist: "Gustav Klimt",           year: "c. 1903", img: "public/5.jpg", cardBg: "#9185d4", wiki: "https://en.wikipedia.org/wiki/Portrait_of_Adele_Bloch-Bauer_I" },
    { title: "Judith with the Head of Holofernes",   artist: "Titian",                 year: "c. 1570", img: "public/6.jpg", cardBg: "#f13a3a", wiki: "https://en.wikipedia.org/wiki/Judith_with_the_Head_of_Holofernes_(Titian)" },
    { title: "Marquise of Pompadour",                artist: "Charles-André van Loo",  year: "c. 1755", img: "public/7.jpg", cardBg: "#94b9df", wiki: "https://en.wikipedia.org/wiki/Madame_de_Pompadour" },
    { title: "La Loge",                              artist: "Pierre-Auguste Renoir",  year: "c. 1874", img: "public/8.jpg", cardBg: "#f01267", wiki: "https://en.wikipedia.org/wiki/La_Loge" },
    { title: "Venus Consoling Love",                    artist: "François Boucher",       year: "c. 1751", img: "public/9.jpg", cardBg: "#0dbfb0", wiki: "https://en.wikipedia.org/wiki/Venus_Consoling_Love" },
];

const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
pathEl.setAttribute('d', `M25.0856 74.7451L35.1257 62.0113C36.7061 60.0069 38.1255 57.8807 39.3706 55.6525C44.3307 46.7766 51.9592 39.6875 61.1744 35.3906L99.7785 17.3898C123.637 6.26498 149.641 0.5 175.966 0.5H259.5L328.544 9.74438C361.928 14.2142 394.282 24.4466 424.165 39.9858L446.647 51.6765C459.795 58.5132 471.74 67.4459 482.015 78.1239L486.037 82.3029C490.001 86.4229 493.521 90.9486 496.538 95.8054L498.366 98.7478C507.485 113.427 511.033 130.89 508.365 147.964C507.789 151.649 507.5 155.373 507.5 159.103V167.39C507.5 183.72 505.264 199.973 500.854 215.696L496 233L489.198 250.686C482.112 269.11 472.124 286.282 459.614 301.552C449.579 313.8 438.015 324.71 425.204 334.015L419.38 338.245C404.516 349.041 388.386 357.976 371.349 364.85C350.566 373.236 328.647 378.47 306.317 380.379L281.5 382.5H256.128C229.277 382.5 202.662 377.501 177.641 367.759C165.24 362.93 153.311 356.967 142.006 349.946L133.038 344.376C118.711 335.479 105.257 325.248 92.854 313.821C75.6916 298.008 60.669 280.021 48.1677 260.315L47.8694 259.845C40.9652 248.962 34.8428 237.602 29.5486 225.852L17 198L7.10227 173.706C2.74219 163.004 0.5 151.557 0.5 140.001C0.5 126.83 3.41247 113.822 9.02886 101.908L11.4313 96.8123C15.1318 88.9629 19.7126 81.5596 25.0856 74.7451Z`);

const PATH_W = 1280;
const PATH_H = 800;
const NECK_W = 3024;
const NECK_H = 1964;
const totalLength = pathEl.getTotalLength();
const PEARL_COUNT = 32;
const pearlPositions = [];
let offset = 0;
let hoveredPearl = -1;
let isHovering = false;

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function drawPearl(x, y, radius, time) {
  const r = radius * 1.4;

  ctx.shadowColor = 'rgba(137, 70, 4, 0.3)';
  ctx.shadowBlur = r * 0.6;
  ctx.shadowOffsetX = r * 0.3;
  ctx.shadowOffsetY = r * 0.4;

  const grad = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.01, x + r * 0.05, y + r * 0.005, r);
  grad.addColorStop(0,    'rgba(255,253,245,1)');
  grad.addColorStop(0.18, 'rgba(255,249,231,0.95)');
  grad.addColorStop(0.45, 'rgba(219,211,193,0.85)');
  grad.addColorStop(0.75, 'rgba(177,166,147,0.9)');
  grad.addColorStop(1,    'rgba(138,129,111,0.95)');

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const hueShift = (x * 0.5 + y * 0.3 + time * 12) % 360;
  const iridescent = ctx.createRadialGradient(x - r * 0.1, y - r * 0.1, 0, x, y, r);
  iridescent.addColorStop(0,   `hsla(${hueShift},       40%, 85%, 0.00)`);
  iridescent.addColorStop(0.4, `hsla(${hueShift +  40}, 50%, 75%, 0.15)`);
  iridescent.addColorStop(0.7, `hsla(${hueShift + 120}, 45%, 70%, 0.12)`);
  iridescent.addColorStop(1,   `hsla(${hueShift + 200}, 35%, 60%, 0.08)`);

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = iridescent;
  ctx.fill();

  const refGrad = ctx.createRadialGradient(x + r * 0.3, y + r * 0.35, 0, x + r * 0.3, y + r * 0.35, r * 0.3);
  refGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
  refGrad.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = refGrad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(160,145,120,0.3)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const W = canvas.width;
  const H = canvas.height;
  // Use the same uniform scale as neck image's object-fit:cover
  // so pearls stay on the necklace at any viewport size
  const imgScale   = Math.max(W / NECK_W, H / NECK_H);
  const imgOffsetX = (W - NECK_W * imgScale) / 2;
  const baseRadius = NECK_W * imgScale * 0.006;
  const time = Date.now() * 0.001;

  for (let i = 0; i < PEARL_COUNT; i++) {
    const t = ((i / PEARL_COUNT) + offset) % 1;
    const point = pathEl.getPointAtLength(t * totalLength);
    const x = (point.x * (NECK_W / PATH_W) + NECK_W * 0.30) * imgScale + imgOffsetX;
    const y = (point.y * (NECK_H / PATH_H) + NECK_H * 0.325) * imgScale;
    pearlPositions[i] = { x, y, r: baseRadius * 1.1 };
    drawPearl(x, y, baseRadius, time);
  }

  if (!isHovering) {
    offset += 0.0003;
  } else if (hoveredPearl >= 0 && pearlPositions[hoveredPearl]) {
    updateThread(pearlPositions[hoveredPearl]);
  }

  requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  let closest = -1;
  let closestDist = Infinity;
  pearlPositions.forEach((p, i) => {
    const d = Math.hypot(mx - p.x, my - p.y);
    if (d < p.r * 1.8 && d < closestDist) {
      closestDist = d;
      closest = i;
    }
  });

  canvas.style.cursor = closest >= 0 ? 'pointer' : 'default';

  if (closest !== hoveredPearl) {
    hoveredPearl = closest;
    if (closest >= 0) {
      isHovering = true;
      bgBlur.classList.add('active');
      showCard(closest % paintings.length);
    } else {
      isHovering = false;
      bgBlur.classList.remove('active');
      hideCard();
    }
  }
});

canvas.addEventListener('click', () => {
  if (hoveredPearl >= 0) {
    const p = paintings[hoveredPearl % paintings.length];
    window.open(p.wiki, '_blank');
  }
});

canvas.addEventListener('mouseleave', () => {
  hoveredPearl = -1;
  isHovering = false;
  bgBlur.classList.remove('active');
  hideCard();
});

function showCard(index) {
  const p = paintings[index];
  document.getElementById('hover-img').src = p.img;
  document.getElementById('hover-img').alt = p.title;
  document.getElementById('hover-title').textContent = p.title;
  document.getElementById('hover-artist').textContent = p.artist;
  document.getElementById('hover-year').textContent = p.year;
  hoverCard.style.setProperty('--card-bg', p.cardBg);
  hoverCard.classList.add('visible');
}

function hideCard() {
  hoverCard.classList.remove('visible');
  threadPath.setAttribute('d', '');
}

function updateThread(pearlPos) {
  const rect = canvas.getBoundingClientRect();
  const px = rect.left + pearlPos.x;
  const py = rect.top + pearlPos.y;

  const cardRect = hoverCard.getBoundingClientRect();
  if (cardRect.width === 0) return;

  const cx = cardRect.left;
  const cy = cardRect.top + cardRect.height / 2;
  const cp1x = px + (cx - px) * 0.45;
  const cp2x = px + (cx - px) * 0.55;

  threadPath.setAttribute('d', `M ${px} ${py} C ${cp1x} ${py}, ${cp2x} ${cy}, ${cx} ${cy}`);
}

window.addEventListener('resize', resize);
resize();
draw();
