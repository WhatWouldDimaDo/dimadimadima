#!/usr/bin/env python3
"""Generate a representative photograph for every place in data.js.

Same recipe as the ATL Radar event images: OpenRouter -> Gemini 2.5 Flash Image,
key read from the Paperclip .env. Writes img/<id>.jpg at 800px wide.

Usage:
    python3 gen_images.py            # only places missing an image
    python3 gen_images.py --all      # regenerate everything
    python3 gen_images.py <id> <id>  # specific places
"""
import base64, io, json, os, re, sys, pathlib, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
IMG = HERE.parent.parent / "public/mexico/img"
PAPERCLIP_ENV = pathlib.Path.home() / "Documents/Coding/Projects/2026-02-02_Paperclip/.env"
MODEL = "google/gemini-2.5-flash-image"

# Scene framing per category — keeps the set visually coherent.
FRAME = {
    "park":    "A wide editorial photograph of the place on a bright clear morning, families and children present but small in frame and not identifiable, lush green planting.",
    "market":  "A wide editorial photograph inside the market — stacked produce, hanging goods, warm interior light falling through a high roof, vendors at work seen from behind.",
    "food":    "An appetising editorial photograph of the dining room and its food, warm daylight, tables set, plates in the foreground, no people's faces.",
    "cafe":    "A warm editorial photograph of the café counter and pastries, morning light, steam from coffee, no people's faces.",
    "culture": "A wide architectural editorial photograph of the building and its setting, dramatic natural light, a sense of scale.",
    "bike":    "A wide editorial photograph of cyclists on a broad car-free city avenue in the morning, trees along the median, relaxed and unhurried.",
    "outing":  "A wide scenic editorial photograph of the location, golden morning light, a strong sense of place.",
}

SUFFIX = (" Mexico City, Mexico. Realistic editorial travel photograph, natural lighting, "
          "wide 16:9 aspect ratio, vivid but true-to-life colour. Absolutely no text, no words, "
          "no signage lettering, no logos, no watermarks, no recognisable faces.")


def api_key():
    if os.environ.get("OPENROUTER_API_KEY"):
        return os.environ["OPENROUTER_API_KEY"]
    m = re.search(r"^OPENROUTER_API_KEY=(\S+)", PAPERCLIP_ENV.read_text(), re.M)
    if m:
        return m.group(1)
    raise RuntimeError("OPENROUTER_API_KEY not found")


KEY = api_key()


def prompt_for(p):
    frame = FRAME.get(p["cat"], FRAME["culture"])
    # The blurb is already specific and visual — it makes the best prompt material.
    blurb = re.sub(r"\s+", " ", p["blurb"]).strip()
    return f'{p["name"]}, {p["colonia"]}. {blurb} {frame}{SUFFIX}'


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
        raise RuntimeError("no image returned: " + json.dumps(data)[:200])
    return base64.b64decode(imgs[0]["image_url"]["url"].split(",", 1)[1])


def one(p):
    dest = IMG / f'{p["id"]}.jpg'
    try:
        raw = generate(prompt_for(p))
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        w = 800
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(dest, "JPEG", quality=82, optimize=True)
        return f'ok   {p["id"]}'
    except Exception as e:
        return f'FAIL {p["id"]}: {str(e)[:110]}'


def main():
    IMG.mkdir(exist_ok=True)
    places = json.loads((HERE / "places.json").read_text())
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if args:
        places = [p for p in places if p["id"] in args]
    elif "--all" not in sys.argv:
        places = [p for p in places if not (IMG / f'{p["id"]}.jpg').exists()]

    print(f"generating {len(places)}")
    with ThreadPoolExecutor(max_workers=4) as ex:
        for line in ex.map(one, places):
            print(line, flush=True)


if __name__ == "__main__":
    main()
