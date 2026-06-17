import { useState, useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Link as LinkIcon } from 'lucide-react'

export default function QRGenerator() {
  const [text, setText] = useState('https://digitalheroesco.com')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#6366f1')
  const [bgColor, setBgColor] = useState('#ffffff')
  const qrRef = useRef(null)

  const downloadQR = useCallback(() => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
      const a = document.createElement('a')
      a.download = 'qr-code.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }, [size])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">QR Code Generator</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Generate QR codes for any URL or text instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input side */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">
              <LinkIcon size={14} className="inline mr-1.5" />URL or Text
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all resize-none"
              placeholder="Enter URL or any text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Size: {size}px</label>
            <input
              type="range"
              min={128}
              max={512}
              step={16}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-8 w-8 rounded border-0 cursor-pointer" />
                <span className="text-xs font-mono dark:text-surface-200/60 text-surface-700/60">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-8 w-8 rounded border-0 cursor-pointer" />
                <span className="text-xs font-mono dark:text-surface-200/60 text-surface-700/60">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Preview */}
        <div className="flex flex-col items-center gap-4">
          <div
            ref={qrRef}
            className="flex items-center justify-center rounded-2xl border dark:border-white/10 border-surface-200 p-6"
            style={{ background: bgColor }}
          >
            {text ? (
              <QRCodeSVG
                value={text}
                size={Math.min(size, 280)}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
              />
            ) : (
              <p className="text-sm text-surface-700/40">Enter text to generate QR</p>
            )}
          </div>
          <button
            onClick={downloadQR}
            disabled={!text}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors disabled:opacity-40"
          >
            <Download size={14} /> Download as PNG
          </button>
        </div>
      </div>
    </div>
  )
}
