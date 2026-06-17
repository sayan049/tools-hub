import { useState, useCallback } from 'react'
import { Copy, Check, AlertCircle, Minimize2, Maximize2 } from 'lucide-react'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [formatted, setFormatted] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)
  const [minified, setMinified] = useState(false)

  const format = useCallback((json, mini = false) => {
    if (!json.trim()) {
      setFormatted('')
      setError('')
      return
    }
    try {
      const parsed = JSON.parse(json)
      setFormatted(mini ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent))
      setError('')
      setMinified(mini)
    } catch (e) {
      setError(e.message)
      setFormatted('')
    }
  }, [indent])

  const handleInput = (val) => {
    setInput(val)
    format(val, minified)
  }

  const copyOutput = async () => {
    const text = formatted || input
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFormat = () => format(input, false)
  const handleMinify = () => format(input, true)

  const sampleJSON = () => {
    const sample = JSON.stringify({
      name: "Free Tools Hub",
      version: "1.0.0",
      tools: ["GST Calculator", "EMI Calculator", "QR Generator"],
      author: { name: "Sayan Patra", email: "sayanpatra2@gmail.com" },
      features: { darkMode: true, responsive: true, freeForever: true }
    })
    setInput(sample)
    format(sample, false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">JSON Formatter / Validator</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Format, validate, and minify JSON data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium dark:text-surface-200/80 text-surface-700">Input</label>
            <button onClick={sampleJSON} className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors">
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            rows={12}
            className="w-full rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-4 py-3 text-sm font-mono dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all resize-y"
            placeholder='Paste your JSON here... e.g. {"key": "value"}'
            spellCheck="false"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium dark:text-surface-200/80 text-surface-700">Output</label>
            <div className="flex items-center gap-2">
              <label className="text-[11px] dark:text-surface-200/50 text-surface-700/50">Indent:</label>
              <select
                value={indent}
                onChange={e => {
                  setIndent(Number(e.target.value))
                  if (formatted && !minified) format(input, false)
                }}
                className="text-[11px] rounded border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-1.5 py-0.5 dark:text-white text-surface-900 outline-none"
              >
                <option value={2} className="dark:bg-surface-800 bg-white">2</option>
                <option value={4} className="dark:bg-surface-800 bg-white">4</option>
                <option value={8} className="dark:bg-surface-800 bg-white">8</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={formatted}
              readOnly
              rows={12}
              className="w-full rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-4 py-3 text-sm font-mono dark:text-emerald-300 text-emerald-700 outline-none resize-y"
              placeholder="Formatted output will appear here..."
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleFormat} className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
          <Maximize2 size={14} /> Format
        </button>
        <button onClick={handleMinify} className="flex items-center gap-1.5 rounded-lg border dark:border-white/10 border-surface-200 px-4 py-2 text-sm font-medium dark:text-surface-200/80 text-surface-700 dark:hover:bg-white/5 hover:bg-surface-100 transition-colors">
          <Minimize2 size={14} /> Minify
        </button>
        <button onClick={copyOutput} disabled={!formatted} className="flex items-center gap-1.5 rounded-lg border dark:border-white/10 border-surface-200 px-4 py-2 text-sm font-medium dark:text-surface-200/80 text-surface-700 dark:hover:bg-white/5 hover:bg-surface-100 transition-colors disabled:opacity-40">
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Output'}
        </button>
      </div>
    </div>
  )
}
