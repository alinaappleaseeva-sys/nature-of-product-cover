#!/usr/bin/env python3
"""Pin static font instances from the variable source fonts.

resvg/usvg does not apply `font-weight` to variable fonts, so we bake exact
instances (optical size + weight) and give each a UNIQUE family name. The SVG
then references that family name directly — robust, no weight-resolution guessing.

Run: python3 scripts/build-fonts.py   (needs: pip install fonttools)
"""
from fontTools import ttLib
from fontTools.varLib.instancer import instantiateVariableFont
import os

FONTS = "assets/fonts"

# family name -> (source file, axis pins)
INSTANCES = {
    # Title — display optical size, high contrast, restrained weights
    "Fraunces Display Light": ("Fraunces.ttf", {"opsz": 144, "wght": 330, "SOFT": 0, "WONK": 0}),
    "Fraunces Display Book":  ("Fraunces.ttf", {"opsz": 144, "wght": 390, "SOFT": 0, "WONK": 0}),
    "Fraunces Display":       ("Fraunces.ttf", {"opsz": 144, "wght": 440, "SOFT": 0, "WONK": 0}),
    # Serif text — for all-serif subtitle/author option
    "Fraunces Text":          ("Fraunces.ttf", {"opsz": 28,  "wght": 400, "SOFT": 0, "WONK": 0}),
    "Fraunces Text Medium":   ("Fraunces.ttf", {"opsz": 28,  "wght": 560, "SOFT": 0, "WONK": 0}),
    # Grotesque — for serif+sans pairing option
    "Inter Book":             ("Inter.ttf",    {"opsz": 14,  "wght": 420}),
    "Inter Medium":           ("Inter.ttf",    {"opsz": 14,  "wght": 560}),
}


def set_name(font, name, nameID):
    nm = font["name"]
    for (pid, eid, lid) in [(3, 1, 0x409), (1, 0, 0)]:
        nm.setName(name, nameID, pid, eid, lid)


def rename(font, family):
    ps = family.replace(" ", "")
    set_name(font, family, 1)       # Family
    set_name(font, "Regular", 2)    # Subfamily
    set_name(font, family, 4)       # Full name
    set_name(font, ps, 6)           # PostScript name
    set_name(font, family, 16)      # Typographic family
    set_name(font, "Regular", 17)   # Typographic subfamily


def main():
    for family, (src, pins) in INSTANCES.items():
        font = ttLib.TTFont(os.path.join(FONTS, src))
        axes = {a.axisTag for a in font["fvar"].axes}
        use = {k: v for k, v in pins.items() if k in axes}
        instantiateVariableFont(font, use, inplace=True)
        rename(font, family)
        out = os.path.join(FONTS, family.replace(" ", "") + ".ttf")
        font.save(out)
        print(f"built {out}  <- {src} {use}")


if __name__ == "__main__":
    main()
