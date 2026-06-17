import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'

const CATEGORIES = {
  Length: {
    units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
    toBase: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  },
  Weight: {
    units: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce', 'Tonne', 'Stone'],
    toBase: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495, Tonne: 1000, Stone: 6.35029 },
  },
  Temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    special: true,
  },
  Area: {
    units: ['Sq Meter', 'Sq Kilometer', 'Sq Mile', 'Sq Foot', 'Acre', 'Hectare'],
    toBase: { 'Sq Meter': 1, 'Sq Kilometer': 1e6, 'Sq Mile': 2.59e6, 'Sq Foot': 0.092903, Acre: 4046.86, Hectare: 10000 },
  },
  Speed: {
    units: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
    toBase: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048 },
  },
}

function convertTemp(value, from, to) {
  let celsius
  if (from === 'Celsius') celsius = value
  else if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15

  if (to === 'Celsius') return celsius
  if (to === 'Fahrenheit') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

export default function UnitConverter() {
  const [category, setCategory] = useState('Length')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Kilometer')
  const [fromValue, setFromValue] = useState(1)

  const cat = CATEGORIES[category]
  const units = cat.units

  const convert = () => {
    if (cat.special) {
      return convertTemp(fromValue, fromUnit, toUnit)
    }
    const inBase = fromValue * cat.toBase[fromUnit]
    return inBase / cat.toBase[toUnit]
  }

  const result = convert()

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(result)
  }

  const handleCategoryChange = (newCat) => {
    setCategory(newCat)
    const newUnits = CATEGORIES[newCat].units
    setFromUnit(newUnits[0])
    setToUnit(newUnits[1])
    setFromValue(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">Unit Converter</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Convert between units of length, weight, temperature, area, and speed</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(CATEGORIES).map(c => (
          <button
            key={c}
            onClick={() => handleCategoryChange(c)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              category === c
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'dark:bg-white/5 bg-surface-100 dark:text-surface-200/70 text-surface-700 dark:hover:bg-white/10 hover:bg-surface-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        {/* From */}
        <div className="space-y-2">
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700">From</label>
          <select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none transition-all"
          >
            {units.map(u => <option key={u} value={u} className="dark:bg-surface-800 bg-white">{u}</option>)}
          </select>
          <input
            type="number"
            value={fromValue}
            onChange={e => setFromValue(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-lg font-semibold dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>

        {/* Swap */}
        <button onClick={swapUnits} className="flex items-center justify-center self-center rounded-full p-2 dark:bg-white/5 bg-surface-100 dark:text-surface-200/60 text-surface-700 dark:hover:bg-white/10 hover:bg-surface-200 transition-colors mt-4 sm:mt-0">
          <ArrowRightLeft size={18} />
        </button>

        {/* To */}
        <div className="space-y-2">
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700">To</label>
          <select
            value={toUnit}
            onChange={e => setToUnit(e.target.value)}
            className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none transition-all"
          >
            {units.map(u => <option key={u} value={u} className="dark:bg-surface-800 bg-white">{u}</option>)}
          </select>
          <div className="w-full rounded-lg border dark:border-primary-500/30 border-primary-200 dark:bg-primary-500/5 bg-primary-50 px-3 py-2.5">
            <p className="text-lg font-bold text-primary-400">
              {Number.isFinite(result) ? (Math.abs(result) < 0.001 && result !== 0 ? result.toExponential(4) : result.toLocaleString('en-US', { maximumFractionDigits: 6 })) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick reference */}
      <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mb-2">Quick Reference</p>
        <p className="text-sm dark:text-surface-200/80 text-surface-700">
          1 {fromUnit} = {(() => {
            if (cat.special) return convertTemp(1, fromUnit, toUnit).toLocaleString('en-US', { maximumFractionDigits: 4 })
            return (cat.toBase[fromUnit] / cat.toBase[toUnit]).toLocaleString('en-US', { maximumFractionDigits: 6 })
          })()} {toUnit}
        </p>
      </div>
    </div>
  )
}
