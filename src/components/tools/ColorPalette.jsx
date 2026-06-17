import { useState, useMemo } from 'react'
import { Copy, Check, Download } from 'lucide-react'

function hexToHSL(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function Swatch({ hex, label, onCopy }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(hex)
    setCopied(true)
    onCopy && onCopy()
    setTimeout(() => setCopied(false), 1500)
  }

  const isLight = hexToHSL(hex).l > 55

  return (
    <button
      onClick={copy}
      className="group relative flex flex-col items-center justify-end rounded-lg overflow-hidden h-20 min-w-[60px] flex-1 transition-transform hover:scale-105"
      style={{ background: hex }}
    >
      <div className={`w-full px-1 py-1 text-center text-[10px] font-mono font-medium ${isLight ? 'text-surface-900/80' : 'text-white/80'}`}>
        {copied ? '✓ Copied' : hex}
      </div>
      {label && (
        <div className={`absolute top-1 text-[9px] font-medium uppercase tracking-wider ${isLight ? 'text-surface-900/40' : 'text-white/40'}`}>
          {label}
        </div>
      )}
    </button>
  )
}

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState('#6366f1')
  const [copiedCSS, setCopiedCSS] = useState(false)

  const { h, s, l } = useMemo(() => hexToHSL(baseColor), [baseColor])

  const palettes = useMemo(() => {
    const shades = Array.from({ length: 9 }, (_, i) => hslToHex(h, s, Math.max(5, l - (i - 4) * -10)))
      .sort((a, b) => hexToHSL(b).l - hexToHSL(a).l)

    const tints = Array.from({ length: 5 }, (_, i) => hslToHex(h, Math.max(10, s - i * 15), Math.min(95, l + i * 12)))

    const complementary = [baseColor, hslToHex((h + 180) % 360, s, l)]
    const analogous = [hslToHex((h - 30 + 360) % 360, s, l), baseColor, hslToHex((h + 30) % 360, s, l)]
    const triadic = [baseColor, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)]

    return { shades, tints, complementary, analogous, triadic }
  }, [baseColor, h, s, l])

  const exportCSS = () => {
    let css = ':root {\n'
    palettes.shades.forEach((hex, i) => {
      css += `  --color-shade-${(i + 1) * 100}: ${hex};\n`
    })
    css += `  --color-complementary: ${palettes.complementary[1]};\n`
    palettes.analogous.forEach((hex, i) => {
      css += `  --color-analogous-${i + 1}: ${hex};\n`
    })
    palettes.triadic.forEach((hex, i) => {
      css += `  --color-triadic-${i + 1}: ${hex};\n`
    })
    css += '}\n'
    return css
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(exportCSS())
    setCopiedCSS(true)
    setTimeout(() => setCopiedCSS(false), 2000)
  }

  const downloadCSS = () => {
    const blob = new Blob([exportCSS()], { type: 'text/css' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'palette.css'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">Color Palette Generator</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Generate harmonious color palettes from any base color</p>
      </div>

      {/* Color input */}
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={baseColor}
          onChange={e => setBaseColor(e.target.value)}
          className="h-12 w-12 rounded-lg cursor-pointer border-0"
        />
        <div>
          <input
            type="text"
            value={baseColor}
            onChange={e => {
              const v = e.target.value
              if (/^#[0-9a-fA-F]{6}$/.test(v)) setBaseColor(v)
            }}
            className="rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm font-mono dark:text-white text-surface-900 outline-none focus:border-primary-500 transition-all w-28"
          />
          <p className="text-[11px] dark:text-surface-200/40 text-surface-700/40 mt-1">
            HSL({h}°, {s}%, {l}%)
          </p>
        </div>
      </div>

      {/* Shades */}
      <div>
        <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-2">Shades & Tints</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {palettes.shades.map((hex, i) => (
            <Swatch key={`shade-${i}`} hex={hex} />
          ))}
        </div>
      </div>

      {/* Complementary */}
      <div>
        <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-2">Complementary</p>
        <div className="flex gap-1.5">
          {palettes.complementary.map((hex, i) => (
            <Swatch key={`comp-${i}`} hex={hex} label={i === 0 ? 'Base' : 'Comp'} />
          ))}
        </div>
      </div>

      {/* Analogous */}
      <div>
        <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-2">Analogous</p>
        <div className="flex gap-1.5">
          {palettes.analogous.map((hex, i) => (
            <Swatch key={`ana-${i}`} hex={hex} label={['−30°', 'Base', '+30°'][i]} />
          ))}
        </div>
      </div>

      {/* Triadic */}
      <div>
        <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-2">Triadic</p>
        <div className="flex gap-1.5">
          {palettes.triadic.map((hex, i) => (
            <Swatch key={`tri-${i}`} hex={hex} label={['Base', '+120°', '+240°'][i]} />
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="flex flex-wrap gap-2">
        <button onClick={copyCSS} className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
          {copiedCSS ? <Check size={14} /> : <Copy size={14} />}
          {copiedCSS ? 'Copied!' : 'Copy as CSS Variables'}
        </button>
        <button onClick={downloadCSS} className="flex items-center gap-1.5 rounded-lg border dark:border-white/10 border-surface-200 px-4 py-2 text-sm font-medium dark:text-surface-200/80 text-surface-700 dark:hover:bg-white/5 hover:bg-surface-100 transition-colors">
          <Download size={14} /> Download CSS
        </button>
      </div>
    </div>
  )
}
