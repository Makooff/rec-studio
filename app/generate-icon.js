#!/usr/bin/env node
// Generates assets/icon.png (256x256) — "R." on cinema black background
// Uses only Node.js built-ins, no external deps required

const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, 'assets')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// SVG source — cinema black + "R." in white Plus Jakarta Sans
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="32" fill="#0f0f0f"/>
  <text
    x="128"
    y="168"
    font-family="'Plus Jakarta Sans', 'Arial Black', sans-serif"
    font-weight="800"
    font-size="108"
    fill="#f5f5f5"
    text-anchor="middle"
    dominant-baseline="auto"
    letter-spacing="-2"
  >R<tspan fill="#FF3B3B">.</tspan></text>
</svg>`

const svgPath = path.join(outDir, 'icon.svg')
fs.writeFileSync(svgPath, svg)
console.log('✓ icon.svg generated:', svgPath)

// electron-builder can use SVG directly on some platforms.
// For Windows .ico: provide PNG 256x256 in assets/icon.png
// If sharp or canvas is available, convert. Otherwise write the SVG as fallback.
try {
  const { execSync } = require('child_process')

  // Try Inkscape (most reliable)
  try {
    execSync(`inkscape --export-type=png --export-width=256 --export-height=256 --export-filename="${path.join(outDir, 'icon.png')}" "${svgPath}"`, { stdio: 'inherit' })
    console.log('✓ icon.png generated via Inkscape')
    process.exit(0)
  } catch {}

  // Try rsvg-convert
  try {
    execSync(`rsvg-convert -w 256 -h 256 -o "${path.join(outDir, 'icon.png')}" "${svgPath}"`, { stdio: 'inherit' })
    console.log('✓ icon.png generated via rsvg-convert')
    process.exit(0)
  } catch {}

  // Try ImageMagick
  try {
    execSync(`convert -background none "${svgPath}" -resize 256x256 "${path.join(outDir, 'icon.png')}"`, { stdio: 'inherit' })
    console.log('✓ icon.png generated via ImageMagick')
    process.exit(0)
  } catch {}

  console.log('⚠ No SVG converter found. Using SVG directly (works for Electron dev).')
  console.log('  For production .ico: install Inkscape or rsvg-convert, then re-run.')
} catch (e) {
  console.error(e.message)
}
