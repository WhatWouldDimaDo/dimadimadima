# Condesa Days — build scripts

Kept out of `public/` because everything under it is served.

| Script | What it does |
|---|---|
| `gen_images.py` | Generates a photo per place via OpenRouter → Gemini 2.5 Flash Image, into `public/mexico/img/<id>.jpg`. Same recipe as the ATL Radar event images; key read from the Paperclip `.env`. |
| `make_directory.cjs` | Regenerates the Brain vault's `Place-Directory.md` from `data.js`, so the guide and the site can't drift. |
| `places.json` | Extract of `data.js` used as input to the image generator. Rebuild with the node one-liner below. |

```bash
# refresh places.json after editing data.js
cd public/mexico && node -e 'global.window={};require("./data.js");console.log(JSON.stringify(window.CDMX.places.map(p=>({id:p.id,name:p.name,cat:p.cat,colonia:p.colonia,blurb:p.blurb}))))' > ../../scripts/mexico/places.json

# only generates images that are missing
python3 scripts/mexico/gen_images.py

# rebuild the vault directory
node scripts/mexico/make_directory.cjs ~/Documents/Brain/01_Projects/2026-07-29_CDMX-Family-Trip/Place-Directory.md
```

`data.js` is the single source of truth. Parse it with **node, not python** — the
python exporter pattern has bitten this repo before.
