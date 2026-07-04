// Generates the PWA icons in public/icons/ from an inline SVG.
// Run with: node scripts/generate-icons.mjs (requires Node 20+, uses the
// `sharp` devDependency to rasterize the SVG at each target size).
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

// Dark rounded square with a green timer ring/arc motif (matches the app's
// dark-950 background #0a0e1a and accent-green #10b981).
//
// `maskable` renders the artwork smaller on a full-bleed background so it
// survives the ~20% crop that Android applies to maskable icons.
const iconSvg = (maskable) => {
  const scale = maskable ? 0.72 : 1
  const t = (512 - 512 * scale) / 2 // translate to keep artwork centered
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${maskable ? 0 : 96}" fill="#0a0e1a"/>
  <g transform="translate(${t} ${t}) scale(${scale})">
    <!-- faint full ring -->
    <circle cx="256" cy="256" r="150" fill="none" stroke="#10b981" stroke-opacity="0.25" stroke-width="36"/>
    <!-- active timer arc (~270 degrees, starting at 12 o'clock) -->
    <path d="M 256 106 A 150 150 0 1 1 106 256"
          fill="none" stroke="#10b981" stroke-width="36" stroke-linecap="round"/>
    <!-- clock hand pointing to 12 -->
    <line x1="256" y1="256" x2="256" y2="150" stroke="#10b981" stroke-width="30" stroke-linecap="round"/>
    <circle cx="256" cy="256" r="26" fill="#10b981"/>
  </g>
</svg>`
}

const targets = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-512-maskable.png', size: 512, maskable: true },
]

await mkdir(outDir, { recursive: true })
for (const { file, size, maskable } of targets) {
  await sharp(Buffer.from(iconSvg(maskable)))
    .resize(size, size)
    .png()
    .toFile(join(outDir, file))
  console.log(`generated public/icons/${file} (${size}x${size}${maskable ? ', maskable' : ''})`)
}
