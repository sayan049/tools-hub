import { useState } from 'react'
import { Plus, Trash2, UserPlus, Users } from 'lucide-react'

export default function BillSplitter() {
  const [mode, setMode] = useState('simple') // 'simple' or 'itemized'

  // Simple mode
  const [totalBill, setTotalBill] = useState(1000)
  const [numPeople, setNumPeople] = useState(4)
  const [tipPercent, setTipPercent] = useState(10)

  // Itemized mode
  const [people, setPeople] = useState(['Alice', 'Bob', 'Charlie'])
  const [billItems, setBillItems] = useState([
    { id: 1, name: 'Pizza', amount: 500, assignedTo: [0, 1] },
    { id: 2, name: 'Drinks', amount: 300, assignedTo: [0, 1, 2] },
  ])
  const [itemTip, setItemTip] = useState(10)

  // Simple calculations
  const tipAmount = totalBill * tipPercent / 100
  const totalWithTip = totalBill + tipAmount
  const perPerson = numPeople > 0 ? totalWithTip / numPeople : 0

  // Itemized calculations
  const itemizedTotals = () => {
    const totals = people.map(() => 0)
    billItems.forEach(item => {
      if (item.assignedTo.length > 0) {
        const share = item.amount / item.assignedTo.length
        item.assignedTo.forEach(idx => {
          totals[idx] += share
        })
      }
    })
    const tipMultiplier = 1 + itemTip / 100
    return totals.map(t => t * tipMultiplier)
  }

  const addPerson = () => setPeople([...people, `Person ${people.length + 1}`])
  const removePerson = (idx) => {
    if (people.length <= 2) return
    setPeople(people.filter((_, i) => i !== idx))
    setBillItems(billItems.map(item => ({
      ...item,
      assignedTo: item.assignedTo.filter(i => i !== idx).map(i => i > idx ? i - 1 : i)
    })))
  }

  const addBillItem = () => {
    setBillItems([...billItems, {
      id: Date.now(),
      name: `Item ${billItems.length + 1}`,
      amount: 0,
      assignedTo: people.map((_, i) => i),
    }])
  }

  const removeBillItem = (id) => {
    if (billItems.length > 1) setBillItems(billItems.filter(i => i.id !== id))
  }

  const toggleAssignment = (itemId, personIdx) => {
    setBillItems(billItems.map(item => {
      if (item.id !== itemId) return item
      const assigned = item.assignedTo.includes(personIdx)
        ? item.assignedTo.filter(i => i !== personIdx)
        : [...item.assignedTo, personIdx]
      return { ...item, assignedTo: assigned }
    }))
  }

  const fmt = (n) => '₹' + n.toFixed(2)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">Bill Splitter</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Split bills equally or by items assigned to each person</p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg border dark:border-white/10 border-surface-200 overflow-hidden w-fit">
        <button
          onClick={() => setMode('simple')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${mode === 'simple' ? 'bg-primary-600 text-white' : 'dark:bg-white/5 bg-surface-50 dark:text-surface-200/70 text-surface-700'}`}
        >
          <Users size={14} /> Equal Split
        </button>
        <button
          onClick={() => setMode('itemized')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${mode === 'itemized' ? 'bg-primary-600 text-white' : 'dark:bg-white/5 bg-surface-50 dark:text-surface-200/70 text-surface-700'}`}
        >
          <UserPlus size={14} /> Itemized
        </button>
      </div>

      {mode === 'simple' ? (
        <>
          {/* Simple inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Total Bill (₹)</label>
              <input
                type="number"
                value={totalBill}
                onChange={e => setTotalBill(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Number of People</label>
              <input
                type="number"
                value={numPeople}
                onChange={e => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Tip (%)</label>
              <input
                type="number"
                value={tipPercent}
                onChange={e => setTipPercent(Math.max(0, Number(e.target.value)))}
                min="0"
                className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
              />
            </div>
          </div>

          {/* Tip presets */}
          <div className="flex flex-wrap gap-2">
            {[0, 5, 10, 15, 20].map(t => (
              <button
                key={t}
                onClick={() => setTipPercent(t)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  tipPercent === t
                    ? 'bg-primary-600 text-white'
                    : 'dark:bg-white/5 bg-surface-100 dark:text-surface-200/70 text-surface-700 dark:hover:bg-white/10 hover:bg-surface-200'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>

          {/* Simple results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mb-1">Tip Amount</p>
              <p className="text-xl font-bold text-amber-400">{fmt(tipAmount)}</p>
            </div>
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mb-1">Total with Tip</p>
              <p className="text-xl font-bold dark:text-white text-surface-900">{fmt(totalWithTip)}</p>
            </div>
            <div className="rounded-xl border dark:border-primary-500/20 border-primary-200 dark:bg-primary-500/5 bg-primary-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mb-1">Per Person</p>
              <p className="text-2xl font-bold text-primary-400">{fmt(perPerson)}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* People */}
          <div>
            <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-2">People</p>
            <div className="flex flex-wrap gap-2">
              {people.map((name, idx) => (
                <div key={idx} className="flex items-center gap-1 rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-2 py-1">
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      const newPeople = [...people]
                      newPeople[idx] = e.target.value
                      setPeople(newPeople)
                    }}
                    className="w-20 bg-transparent text-sm dark:text-white text-surface-900 outline-none"
                  />
                  <button onClick={() => removePerson(idx)} className="text-red-400 hover:text-red-300" disabled={people.length <= 2}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button onClick={addPerson} className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-primary-400 hover:bg-primary-500/10 transition-colors">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Bill items */}
          <div className="space-y-3">
            <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700">Items</p>
            {billItems.map(item => (
              <div key={item.id} className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => setBillItems(billItems.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                    className="flex-1 bg-transparent text-sm font-medium dark:text-white text-surface-900 outline-none"
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    value={item.amount || ''}
                    onChange={e => setBillItems(billItems.map(i => i.id === item.id ? { ...i, amount: parseFloat(e.target.value) || 0 } : i))}
                    className="w-24 rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-white px-2 py-1 text-sm dark:text-white text-surface-900 outline-none text-right"
                    placeholder="₹"
                  />
                  <button onClick={() => removeBillItem(item.id)} className="text-red-400 hover:text-red-300" disabled={billItems.length <= 1}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {people.map((name, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleAssignment(item.id, idx)}
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                        item.assignedTo.includes(idx)
                          ? 'bg-primary-600 text-white'
                          : 'dark:bg-white/5 bg-surface-200 dark:text-surface-200/50 text-surface-700/50'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={addBillItem} className="flex items-center gap-1.5 text-sm text-primary-400 hover:bg-primary-500/10 rounded-lg px-3 py-2 transition-colors">
              <Plus size={14} /> Add Item
            </button>
          </div>

          {/* Tip for itemized */}
          <div>
            <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Tip (%)</label>
            <input
              type="number"
              value={itemTip}
              onChange={e => setItemTip(Math.max(0, Number(e.target.value)))}
              min="0"
              className="w-24 rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none transition-all"
            />
          </div>

          {/* Itemized results */}
          <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4 space-y-2">
            <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-2">Each Person Pays (incl. {itemTip}% tip)</p>
            {people.map((name, idx) => {
              const amount = itemizedTotals()[idx]
              return (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b dark:border-white/5 border-surface-100 last:border-0">
                  <span className="text-sm dark:text-surface-200/80 text-surface-700">{name}</span>
                  <span className="text-sm font-bold text-primary-400">{fmt(amount)}</span>
                </div>
              )
            })}
            <div className="flex items-center justify-between pt-2 border-t dark:border-white/10 border-surface-200">
              <span className="text-sm font-bold dark:text-white text-surface-900">Grand Total</span>
              <span className="text-base font-bold text-primary-400">
                {fmt(itemizedTotals().reduce((s, v) => s + v, 0))}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
