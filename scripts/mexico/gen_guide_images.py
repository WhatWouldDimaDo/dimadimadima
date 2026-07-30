#!/usr/bin/env python3
"""Generate hero and inline images for the guides.

Same recipe as gen_images.py (OpenRouter -> Gemini 2.5 Flash Image), but writes
to public/mexico/img/guides/<slug>.jpg at a wider crop, since these run
full-bleed at the top of a guide and inside its sections.

    python3 gen_guide_images.py           # only what's missing
    python3 gen_guide_images.py --all
    python3 gen_guide_images.py lucha-hero street-food-trompo
"""
import base64, io, json, os, re, sys, pathlib, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
IMG = HERE.parent.parent / "public/mexico/img/guides"
PAPERCLIP_ENV = pathlib.Path.home() / "Documents/Coding/Projects/2026-02-02_Paperclip/.env"
MODEL = "google/gemini-2.5-flash-image"

SUFFIX = (" Mexico City, Mexico. Realistic editorial travel photograph, natural lighting, "
          "wide 16:9 aspect ratio, vivid but true-to-life colour. Absolutely no text, no words, "
          "no signage lettering, no logos, no watermarks, no recognisable faces.")

JOBS = {
    # ── lucha libre ──────────────────────────────────────────────
    "lucha-hero": "The interior of a large historic Mexican wrestling arena during a show, seen from the raised seating: a brightly lit ring in the middle of a packed dark bowl of spectators, dramatic overhead lighting, haze in the beams, a sense of enormous noise.",
    "lucha-masks": "A street vendor's stall outside an arena hung with dozens of brightly coloured lucha libre wrestling masks in silver, gold, red and turquoise, evening light, close and densely packed.",
    "lucha-ring": "Two masked luchadores mid-air above the ropes of a wrestling ring, one leaping, seen from a distance in a packed arena, motion blur, spotlights.",

    # ── pyramids & excursions ────────────────────────────────────
    "pyramids-hero": "The Avenue of the Dead at Teotihuacan at early morning, the Pyramid of the Sun rising on the right, long shadows, a wide empty stone causeway, dry hills behind, no shade anywhere.",
    "pyramids-cuicuilco": "A low circular stepped pyramid of dark volcanic stone surrounded by scrubby green parkland, with modern city buildings visible in the distance behind it, bright midday.",
    "pyramids-templo": "An excavated Aztec temple site in the middle of a modern city, layered stone platforms below street level with raised metal walkways above them, a colonial cathedral looming behind.",
    "pyramids-tepoztlan": "A small Mexican mountain town seen from its main street, a wall of dramatic green cliffs rising directly behind the rooftops, market awnings in the foreground, morning light.",

    # ── sounds of the city ───────────────────────────────────────
    "sounds-hero": "A street organ grinder in a beige uniform and cap turning the crank of an ornate antique barrel organ on a busy Mexico City pavement, warm afternoon light, blurred passers-by.",
    "sounds-camote": "A steaming sweet-potato street cart at dusk with a tall metal chimney and a wood-fired oven, white steam pouring upward, glowing embers, dark street behind.",
    "sounds-danzon": "Older couples dancing danzon in pairs on an open plaza in the late afternoon, formal posture, a small band on one side, dappled light through trees.",

    # ── street food ──────────────────────────────────────────────
    "streetfood-hero": "A close view of a vertical spit of marinated pork, the trompo, glowing under a flame at a taqueria at night, a pineapple balanced on top, a taquero's hands shaving meat onto a small tortilla.",
    "streetfood-market": "The inside of a busy traditional Mexican market hall, aisles of stacked fresh produce and hanging goods, warm light falling from a high roof, vendors at work seen from behind.",
    "streetfood-tamales": "An early morning street stall selling tamales and steaming atole from large metal pots on a quiet city pavement, steam rising, first daylight.",
    "streetfood-esquites": "A street cart selling esquites and elotes, corn cups being topped with mayonnaise, cheese and chilli powder, evening, warm cart lighting.",

    # ── street art & sculpture ───────────────────────────────────
    "streetart-hero": "A huge colourful mural covering the entire side wall of a five-storey building in Mexico City, bold graphic animal and folk imagery, seen from the street below with a tree in front, bright daylight.",
    "streetart-shutters": "A row of closed metal shop shutters on a city street, each one painted with a different bright mural, early Sunday morning, empty pavement, long shadows.",
    "streetart-sculpture": "A monumental abstract sculpture of dark volcanic stone standing in open parkland, wide sky, a person small in the frame for scale, late afternoon light.",
    "streetart-reforma": "A wide tree-lined city avenue with a large modern sculpture standing on the central median, tall buildings on both sides, golden hour.",

    # ── atlas obscura ────────────────────────────────────────────
    "obscura-hero": "The soaring interior of a vast modern library with book stacks suspended in mid-air at many levels, a whale skeleton hanging in the central void, cool daylight from a glass roof.",
    "obscura-toys": "A dense, chaotic private museum interior, floor-to-ceiling shelves crammed with thousands of antique tin toys, dolls and figurines in glass cases, warm cluttered lighting.",
    "obscura-dolls": "Weathered old dolls hung from the branches of trees on a small overgrown island in a canal, misty flat water, eerie and still, overcast light.",
    "obscura-cathedral": "The interior of a large baroque cathedral with a long plumb line hanging from the ceiling to the floor, demonstrating a visible tilt in the building, dim golden light.",

    # ── playgrounds ──────────────────────────────────────────────
    "playgrounds-hero": "A well-used city playground under mature trees in a leafy Mexican neighbourhood, wooden climbing frames and slides on sand, dappled morning light, a few small children in the distance and not identifiable.",
    "playgrounds-fenced": "A fenced children's play area among tall pine trees, rope climbing structures and a zip line, a single gated entrance, soft green light through the canopy.",
    "playgrounds-fountain": "Children running through low jets of water in a shallow city fountain plaza on a hot day, seen from a distance, spray catching the sun, no identifiable faces.",

    # ── museums outdoors ─────────────────────────────────────────
    "museums-hero": "A striking modern museum building clad in thousands of shimmering silver hexagonal tiles, an asymmetric curved shape, seen from the plaza below against a blue sky.",
    "museums-sculpture": "An outdoor sculpture garden beside a modernist museum, large abstract metal and stone works on mown grass among mature trees, dappled afternoon light.",
    "museums-courtyard": "A vast modernist museum courtyard dominated by a single enormous concrete umbrella column with water pouring down from its edges into a pool, people small beneath it for scale.",
    "museums-domes": "A cluster of white geodesic dome buildings in a green park, seen from outside on a bright day, curved white panels catching the light.",
}


def api_key():
    if os.environ.get("OPENROUTER_API_KEY"):
        return os.environ["OPENROUTER_API_KEY"]
    m = re.search(r"^OPENROUTER_API_KEY=(\S+)", PAPERCLIP_ENV.read_text(), re.M)
    if m:
        return m.group(1)
    raise RuntimeError("OPENROUTER_API_KEY not found")


KEY = api_key()


def generate(prompt):
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps({"model": MODEL,
                         "messages": [{"role": "user", "content": prompt}]}).encode(),
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=240) as resp:
        data = json.loads(resp.read())
    imgs = data["choices"][0]["message"].get("images") or []
    if not imgs:
        raise RuntimeError("no image returned")
    return base64.b64decode(imgs[0]["image_url"]["url"].split(",", 1)[1])


def one(item):
    slug, scene = item
    dest = IMG / f"{slug}.jpg"
    try:
        raw = generate(scene + SUFFIX)
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        w = 1000
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(dest, "JPEG", quality=82, optimize=True)
        return f"ok   {slug}"
    except Exception as e:
        return f"FAIL {slug}: {str(e)[:100]}"


def main():
    IMG.mkdir(parents=True, exist_ok=True)
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    items = list(JOBS.items())
    if args:
        items = [(k, v) for k, v in items if k in args]
    elif "--all" not in sys.argv:
        items = [(k, v) for k, v in items if not (IMG / f"{k}.jpg").exists()]

    print(f"generating {len(items)}")
    with ThreadPoolExecutor(max_workers=4) as ex:
        for line in ex.map(one, items):
            print(line, flush=True)


if __name__ == "__main__":
    main()
