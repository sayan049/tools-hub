import { useState, useRef } from 'react'
import { Plus, Trash2, Copy, Printer, Check } from 'lucide-react'

const GST_RATES = [0, 5, 12, 18, 28]

export default function GSTCalculator() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', qty: 1, price: 0 },
  ])
  const [gstRate, setGstRate] = useState(18)
  const [isIGST, setIsIGST] = useState(false)
  const [discountType, setDiscountType] = useState('percent')
  const [discountValue, setDiscountValue] = useState(0)
  const [copied, setCopied] = useState(false)
  const summaryRef = useRef(null)

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: `Item ${items.length + 1}`, qty: 1, price: 0 }])
  }

  const removeItem = (id) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const subtotal = items.reduce((sum, i) => sum + (i.qty * i.price), 0)
  const discount = discountType === 'percent'
    ? (subtotal * discountValue / 100)
    : Math.min(discountValue, subtotal)
  const taxableAmount = subtotal - discount
  const totalTax = taxableAmount * gstRate / 100
  const grandTotal = taxableAmount + totalTax

  const getSummaryText = () => {
    let text = '--- GST INVOICE SUMMARY ---\n\n'
    text += 'ITEMS:\n'
    items.forEach((item, i) => {
      text += `${i + 1}. ${item.name} — Qty: ${item.qty} × ₹${item.price.toFixed(2)} = ₹${(item.qty * item.price).toFixed(2)}\n`
    })
    text += `\nSubtotal: ₹${subtotal.toFixed(2)}\n`
    text += `Discount: ₹${discount.toFixed(2)} (${discountType === 'percent' ? `${discountValue}%` : 'flat'})\n`
    text += `Taxable Amount: ₹${taxableAmount.toFixed(2)}\n`
    if (isIGST) {
      text += `IGST (${gstRate}%): ₹${totalTax.toFixed(2)}\n`
    } else {
      text += `CGST (${gstRate / 2}%): ₹${(totalTax / 2).toFixed(2)}\n`
      text += `SGST (${gstRate / 2}%): ₹${(totalTax / 2).toFixed(2)}\n`
    }
    text += `\nGRAND TOTAL: ₹${grandTotal.toFixed(2)}\n`
    return text
  }

  const copySummary = async () => {
    await navigator.clipboard.writeText(getSummaryText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const printSummary = () => {
    const w = window.open('', '_blank')
    w.document.write(`<html><head><title>GST Invoice</title><style>
      body{font-family:Inter,sans-serif;padding:40px;color:#1e293b}
      h1{font-size:20px;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{border:1px solid #e2e8f0;padding:8px 12px;text-align:left;font-size:14px}
      th{background:#f1f5f9;font-weight:600}
      .total{font-size:18px;font-weight:700;margin-top:16px}
    </style></head><body>`)
    w.document.write('<h1>GST Invoice Summary</h1>')
    w.document.write('<table><tr><th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr>')
    items.forEach((item, i) => {
      w.document.write(`<tr><td>${i + 1}</td><td>${item.name}</td><td>${item.qty}</td><td>₹${item.price.toFixed(2)}</td><td>₹${(item.qty * item.price).toFixed(2)}</td></tr>`)
    })
    w.document.write('</table>')
    w.document.write(`<p>Subtotal: ₹${subtotal.toFixed(2)}</p>`)
    w.document.write(`<p>Discount: ₹${discount.toFixed(2)}</p>`)
    w.document.write(`<p>Taxable Amount: ₹${taxableAmount.toFixed(2)}</p>`)
    if (isIGST) {
      w.document.write(`<p>IGST (${gstRate}%): ₹${totalTax.toFixed(2)}</p>`)
    } else {
      w.document.write(`<p>CGST (${gstRate / 2}%): ₹${(totalTax / 2).toFixed(2)}</p>`)
      w.document.write(`<p>SGST (${gstRate / 2}%): ₹${(totalTax / 2).toFixed(2)}</p>`)
    }
    w.document.write(`<p class="total">Grand Total: ₹${grandTotal.toFixed(2)}</p>`)
    w.document.write('</body></html>')
    w.document.close()
    w.print()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">GST / Invoice Calculator</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Calculate GST with CGST/SGST or IGST breakdown</p>
      </div>

      {/* Line Items */}
      <div className="space-y-3">
        <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700">Line Items</p>
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-wrap items-center gap-2">
            <span className="w-6 text-center text-xs dark:text-surface-200/40 text-surface-700/40">{index + 1}</span>
            <input
              type="text"
              value={item.name}
              onChange={e => updateItem(item.id, 'name', e.target.value)}
              placeholder="Item name"
              className="flex-1 min-w-[120px] rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
            />
            <input
              type="number"
              value={item.qty}
              onChange={e => updateItem(item.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-20 rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
              placeholder="Qty"
            />
            <input
              type="number"
              value={item.price || ''}
              onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-28 rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
              placeholder="Price"
            />
            <span className="w-24 text-right text-sm dark:text-surface-200/70 text-surface-700">
              ₹{(item.qty * item.price).toFixed(2)}
            </span>
            <button onClick={() => removeItem(item.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 transition-colors" disabled={items.length === 1}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={addItem} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary-400 hover:bg-primary-500/10 transition-colors">
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* GST Rate */}
        <div>
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">GST Rate</label>
          <select
            value={gstRate}
            onChange={e => setGstRate(Number(e.target.value))}
            className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 transition-all"
          >
            {GST_RATES.map(r => (
              <option key={r} value={r} className="dark:bg-surface-800 bg-white">{r}%</option>
            ))}
          </select>
        </div>

        {/* Tax Type */}
        <div>
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Tax Type</label>
          <div className="flex rounded-lg border dark:border-white/10 border-surface-200 overflow-hidden">
            <button
              onClick={() => setIsIGST(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${!isIGST ? 'bg-primary-600 text-white' : 'dark:bg-white/5 bg-surface-50 dark:text-surface-200/70 text-surface-700'}`}
            >
              CGST + SGST
            </button>
            <button
              onClick={() => setIsIGST(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${isIGST ? 'bg-primary-600 text-white' : 'dark:bg-white/5 bg-surface-50 dark:text-surface-200/70 text-surface-700'}`}
            >
              IGST
            </button>
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Discount</label>
          <div className="flex gap-2">
            <select
              value={discountType}
              onChange={e => setDiscountType(e.target.value)}
              className="w-20 rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-2 py-2 text-sm dark:text-white text-surface-900 outline-none transition-all"
            >
              <option value="percent" className="dark:bg-surface-800 bg-white">%</option>
              <option value="flat" className="dark:bg-surface-800 bg-white">₹</option>
            </select>
            <input
              type="number"
              value={discountValue || ''}
              onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
              min="0"
              className="flex-1 rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 transition-all"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div ref={summaryRef} className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-5 space-y-3">
        <div className="flex justify-between text-sm dark:text-surface-200/70 text-surface-700">
          <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-red-400">
            <span>Discount</span><span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm dark:text-surface-200/70 text-surface-700">
          <span>Taxable Amount</span><span>₹{taxableAmount.toFixed(2)}</span>
        </div>
        <div className="border-t dark:border-white/10 border-surface-200 pt-3 space-y-1">
          {isIGST ? (
            <div className="flex justify-between text-sm dark:text-surface-200/70 text-surface-700">
              <span>IGST ({gstRate}%)</span><span>₹{totalTax.toFixed(2)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm dark:text-surface-200/70 text-surface-700">
                <span>CGST ({gstRate / 2}%)</span><span>₹{(totalTax / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm dark:text-surface-200/70 text-surface-700">
                <span>SGST ({gstRate / 2}%)</span><span>₹{(totalTax / 2).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
        <div className="border-t dark:border-white/10 border-surface-200 pt-3 flex justify-between items-center">
          <span className="text-base font-bold dark:text-white text-surface-900">Grand Total</span>
          <span className="text-xl font-bold text-primary-400">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copySummary}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Summary'}
        </button>
        <button
          onClick={printSummary}
          className="flex items-center gap-1.5 rounded-lg border dark:border-white/10 border-surface-200 px-4 py-2 text-sm font-medium dark:text-surface-200/80 text-surface-700 dark:hover:bg-white/5 hover:bg-surface-100 transition-colors"
        >
          <Printer size={14} /> Print / PDF
        </button>
      </div>
    </div>
  )
}
