import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(60)
  const [showTable, setShowTable] = useState(false)
  const [chartType, setChartType] = useState('pie')

  const { emi, totalInterest, totalPayment, schedule } = useMemo(() => {
    const monthlyRate = rate / 12 / 100
    const n = tenure
    if (monthlyRate === 0) {
      const emi = principal / n
      return {
        emi,
        totalInterest: 0,
        totalPayment: principal,
        schedule: Array.from({ length: n }, (_, i) => ({
          month: i + 1,
          emi: emi,
          principal: emi,
          interest: 0,
          balance: principal - emi * (i + 1),
        })),
      }
    }
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - principal

    let balance = principal
    const schedule = []
    for (let i = 1; i <= n; i++) {
      const interest = balance * monthlyRate
      const principalPaid = emi - interest
      balance -= principalPaid
      schedule.push({
        month: i,
        emi: emi,
        principal: principalPaid,
        interest: interest,
        balance: Math.max(0, balance),
      })
    }

    return { emi, totalInterest, totalPayment, schedule }
  }, [principal, rate, tenure])

  const pieData = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ]
  const COLORS = ['#6366f1', '#f59e0b']

  const yearlyData = useMemo(() => {
    const years = []
    for (let y = 0; y < Math.ceil(tenure / 12); y++) {
      const monthStart = y * 12
      const monthEnd = Math.min((y + 1) * 12, tenure)
      const yearSlice = schedule.slice(monthStart, monthEnd)
      years.push({
        year: `Year ${y + 1}`,
        principal: yearSlice.reduce((s, m) => s + m.principal, 0),
        interest: yearSlice.reduce((s, m) => s + m.interest, 0),
      })
    }
    return years
  }, [schedule, tenure])

  const fmt = (n) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">EMI / Loan Calculator</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Calculate monthly EMI and view full amortization schedule</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Loan Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={e => setPrincipal(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Interest Rate (% p.a.)</label>
          <input
            type="number"
            value={rate}
            onChange={e => setRate(Math.max(0, Number(e.target.value)))}
            step="0.1"
            className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">Tenure (months)</label>
          <input
            type="number"
            value={tenure}
            onChange={e => setTenure(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-primary-400">{fmt(emi)}</p>
        </div>
        <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-amber-400">{fmt(totalInterest)}</p>
        </div>
        <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mb-1">Total Payment</p>
          <p className="text-2xl font-bold dark:text-white text-surface-900">{fmt(totalPayment)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700">Payment Breakdown</p>
          <div className="flex rounded-lg border dark:border-white/10 border-surface-200 overflow-hidden">
            <button onClick={() => setChartType('pie')} className={`px-3 py-1 text-xs font-medium transition-all ${chartType === 'pie' ? 'bg-primary-600 text-white' : 'dark:bg-white/5 bg-white dark:text-surface-200/70 text-surface-700'}`}>Pie</button>
            <button onClick={() => setChartType('bar')} className={`px-3 py-1 text-xs font-medium transition-all ${chartType === 'bar' ? 'bg-primary-600 text-white' : 'dark:bg-white/5 bg-white dark:text-surface-200/70 text-surface-700'}`}>Bar</button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
              </PieChart>
            ) : (
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar dataKey="principal" name="Principal" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interest" name="Interest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Amortization table */}
      <div>
        <button
          onClick={() => setShowTable(!showTable)}
          className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          {showTable ? 'Hide' : 'Show'} Amortization Table ({tenure} months)
        </button>

        {showTable && (
          <div className="mt-3 max-h-80 overflow-auto rounded-xl border dark:border-white/10 border-surface-200">
            <table className="w-full text-sm">
              <thead className="sticky top-0 dark:bg-surface-800 bg-surface-100">
                <tr className="dark:text-surface-200/60 text-surface-700/60">
                  <th className="px-3 py-2 text-left font-medium">Month</th>
                  <th className="px-3 py-2 text-right font-medium">EMI</th>
                  <th className="px-3 py-2 text-right font-medium">Principal</th>
                  <th className="px-3 py-2 text-right font-medium">Interest</th>
                  <th className="px-3 py-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(row => (
                  <tr key={row.month} className="border-t dark:border-white/5 border-surface-100 dark:text-surface-200/80 text-surface-700">
                    <td className="px-3 py-2">{row.month}</td>
                    <td className="px-3 py-2 text-right">{fmt(row.emi)}</td>
                    <td className="px-3 py-2 text-right">{fmt(row.principal)}</td>
                    <td className="px-3 py-2 text-right">{fmt(row.interest)}</td>
                    <td className="px-3 py-2 text-right">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
