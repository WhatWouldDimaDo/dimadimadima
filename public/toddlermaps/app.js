function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

// hero: overview map preview + PDF link
const heroMap = document.getElementById("hero-map");
if (DATA.overview.sheet) {
  const img = new Image();
  img.src = DATA.overview.sheet;
  img.alt = "Overview map of every place we go";
  heroMap.appendChild(img);
  const link = document.getElementById("overview-pdf");
  link.href = DATA.overview.pdf;
} else {
  heroMap.remove();
  document.getElementById("overview-pdf").remove();
}

// places grid
const grid = document.getElementById("places-grid");
DATA.places.forEach((p, i) => {
  const card = el("article", "card sticker");
  card.style.animationDelay = `${i * 70}ms`;
  if (p.icon) {
    const img = new Image();
    img.src = p.icon;
    img.alt = `${p.kidName} coloring sticker`;
    img.className = "card-icon";
    img.loading = "lazy";
    card.appendChild(img);
  }
  card.appendChild(el("div", "kid-name", p.kidName));
  card.appendChild(el("div", "real-name", p.name === p.kidName ? "" : p.name));
  const btns = el("div", "card-btns");
  if (p.pdf) {
    const a = el("a", "map-btn", "Map 🗺");
    a.href = p.pdf;
    a.setAttribute("download", `toddlermaps-${p.key}.pdf`);
    btns.appendChild(a);
  }
  if (p.icon) {
    const a = el("a", "sticker-btn", "Sticker ✂️");
    a.href = p.icon.replace("/icons/", "/icons/");
    a.setAttribute("download", `sticker-${p.key}.png`);
    btns.appendChild(a);
  }
  card.appendChild(btns);
  grid.appendChild(card);
});

// printables: real trip strips, car kits, calendar
const plist = document.getElementById("printables-list");
if (plist && DATA.printables && DATA.printables.length) {
  DATA.printables.forEach((p) => {
    const row = el("div", "printable sticker");
    if (p.preview) {
      const img = new Image();
      img.src = p.file;
      img.alt = `${p.kind}: ${p.name}`;
      img.loading = "lazy";
      const scroller = el("div", "printable-img");
      scroller.appendChild(img);
      row.appendChild(scroller);
    }
    const meta = el("div", "printable-meta",
      `<span class="printable-kind">${p.kind}</span><b>${p.name}</b>`);
    const a = el("a", "btn", "Print ⤓");
    a.href = p.file;
    a.setAttribute("download", "");
    meta.appendChild(a);
    row.appendChild(meta);
    plist.appendChild(row);
  });
} else if (plist) {
  plist.closest("section").remove();
}

// beach trip strip
const strip = document.getElementById("trip-strip");
DATA.trip.stops.forEach((s, i) => {
  if (i > 0) {
    const arrow = el("div", "trip-arrow",
      `<span class="n">${i}</span><span class="a">→</span>`);
    strip.appendChild(arrow);
  }
  const stop = el("div", "trip-stop sticker");
  stop.style.transform = `rotate(${i % 2 ? 1 : -1}deg)`;
  if (s.icon) {
    const img = new Image();
    img.src = s.icon;
    img.alt = s.label;
    img.loading = "lazy";
    stop.appendChild(img);
  }
  stop.appendChild(el("div", "trip-label", s.label));
  strip.appendChild(stop);
});
