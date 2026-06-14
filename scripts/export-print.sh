#!/usr/bin/env bash
# Print export: outlined vector SVG → RGB PDF → CMYK PDF (+ soft-proof PNG).
# 6.25×9.25in = 6×9 trim + 0.125in bleed all sides, 300 DPI.
# Run from repo root: bash scripts/export-print.sh
set -euo pipefail

SVG=exports/print/print-outlined.svg
RGBPDF=exports/print/nature-of-product-print-rgb.pdf
CMYKPDF=exports/print/nature-of-product-print-cmyk.pdf
PROOF=exports/print/_cmyk-proof.png

# 1) vector RGB PDF (physical size taken from the SVG's in units)
rsvg-convert -f pdf -o "$RGBPDF" "$SVG"

# 2) RGB → CMYK (DeviceCMYK). Generic SWOP-like conversion; the printer can
#    re-profile to PSOcoated_v3 / their house profile at production.
gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -dProcessColorModel=/DeviceCMYK \
   -sColorConversionStrategy=CMYK \
   -dEncodeColorImages=true \
   -o "$CMYKPDF" "$RGBPDF"

# 3) soft-proof: rasterise the CMYK PDF back to RGB for visual check
gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r150 -o "$PROOF" "$CMYKPDF"

echo "wrote:"
echo "  $RGBPDF"
echo "  $CMYKPDF   (DeviceCMYK)"
echo "  $PROOF     (soft-proof)"
