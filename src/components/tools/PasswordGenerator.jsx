import { useState, useCallback } from 'react'
import { RefreshCw, Copy, Check, Eye, EyeOff } from 'lucide-react'

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generatePassword(length, options) {
  let chars = ''
  if (options.uppercase) chars += CHAR_SETS.uppercase
  if (options.lowercase) chars += CHAR_SETS.lowercase
  if (options.numbers) chars += CHAR_SETS.numbers
  if (options.symbols) chars += CHAR_SETS.symbols
  if (!chars) chars = CHAR_SETS.lowercase

  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, (v) => chars[v % chars.length]).join('')
}

function getStrength(password) {
  let score = 0
  if (password.length >= 12) score++
  if (password.length >= 20) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400', percent: 33 }
  if (score <= 4) return { label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-400', percent: 66 }
  return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400', percent: 100 }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState(() => generatePassword(16, { uppercase: true, lowercase: true, numbers: true, symbols: true }))
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(true)

  const regenerate = useCallback(() => {
    setPassword(generatePassword(length, options))
    setCopied(false)
  }, [length, options])

  const copyPassword = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleOption = (key) => {
    const newOptions = { ...options, [key]: !options[key] }
    const activeCount = Object.values(newOptions).filter(Boolean).length
    if (activeCount === 0) return
    setOptions(newOptions)
    setPassword(generatePassword(length, newOptions))
  }

  const strength = getStrength(password)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">Password Generator</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Generate secure, random passwords instantly</p>
      </div>

      {/* Password display */}
      <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4">
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-lg tracking-wider break-all dark:text-white text-surface-900">
            {showPassword ? password : '•'.repeat(password.length)}
          </code>
          <button onClick={() => setShowPassword(!showPassword)} className="rounded-lg p-2 dark:text-surface-200/60 text-surface-700/60 dark:hover:bg-white/10 hover:bg-surface-200 transition-colors">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button onClick={copyPassword} className="rounded-lg p-2 dark:text-surface-200/60 text-surface-700/60 dark:hover:bg-white/10 hover:bg-surface-200 transition-colors">
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
          <button onClick={regenerate} className="rounded-lg p-2 dark:text-surface-200/60 text-surface-700/60 dark:hover:bg-white/10 hover:bg-surface-200 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Strength bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full dark:bg-white/10 bg-surface-200 overflow-hidden">
            <div
              className={`h-full rounded-full ${strength.color} transition-all duration-500`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${strength.textColor}`}>{strength.label}</span>
        </div>
      </div>

      {/* Length slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium dark:text-surface-200/80 text-surface-700">Length</label>
          <span className="text-sm font-mono font-bold text-primary-400">{length}</span>
        </div>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={e => {
            const newLen = Number(e.target.value)
            setLength(newLen)
            setPassword(generatePassword(newLen, options))
          }}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between mt-1 text-[11px] dark:text-surface-200/40 text-surface-700/40">
          <span>8</span><span>64</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => toggleOption(key)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              value
                ? 'dark:border-primary-500/30 border-primary-300 dark:bg-primary-500/10 bg-primary-50 dark:text-primary-400 text-primary-600'
                : 'dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 dark:text-surface-200/50 text-surface-700/50'
            }`}
          >
            <p className="text-sm font-medium capitalize">{key}</p>
            <p className="text-[11px] mt-0.5 opacity-60 font-mono">
              {CHAR_SETS[key].slice(0, 10)}...
            </p>
          </button>
        ))}
      </div>

      {/* Quick copy */}
      <button
        onClick={copyPassword}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        {copied ? <><Check size={14} /> Copied to Clipboard!</> : <><Copy size={14} /> Copy Password</>}
      </button>
    </div>
  )
}
