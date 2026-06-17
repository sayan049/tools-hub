import { useState, useMemo } from 'react'
import { Cake, CalendarDays as CalIcon } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AgeCalculator() {
  const [dob, setDob] = useState('')

  const result = useMemo(() => {
    if (!dob) return null

    const birth = new Date(dob)
    const now = new Date()

    if (birth > now) return null

    // Age calculation
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    // Total days lived
    const totalDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24

    // Next birthday
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= now) {
      nextBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate())
    }
    const daysUntilBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24))
    const isBirthdayToday = daysUntilBirthday === 0 || (now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate())

    // Day of the week born
    const bornDay = DAYS[birth.getDay()]

    return {
      years, months, days,
      totalDays, totalWeeks, totalMonths, totalHours,
      daysUntilBirthday, isBirthdayToday, bornDay,
      nextAge: years + 1,
    }
  }, [dob])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">Age Calculator</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Find your exact age and fun birthday stats</p>
      </div>

      <div>
        <label className="block text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-1.5">
          <CalIcon size={14} className="inline mr-1.5" />Date of Birth
        </label>
        <input
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full max-w-xs rounded-lg border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-3 py-2.5 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all dark:[color-scheme:dark]"
        />
      </div>

      {result && (
        <>
          {/* Main age display */}
          <div className="rounded-xl border dark:border-primary-500/20 border-primary-200 dark:bg-primary-500/5 bg-primary-50 p-6 text-center">
            <p className="text-sm font-medium dark:text-surface-200/60 text-surface-700/60 mb-2">Your Age</p>
            <div className="flex items-baseline justify-center gap-4">
              <div>
                <span className="text-4xl font-bold text-primary-400">{result.years}</span>
                <span className="text-sm dark:text-surface-200/60 text-surface-700/60 ml-1">years</span>
              </div>
              <div>
                <span className="text-2xl font-bold dark:text-white text-surface-900">{result.months}</span>
                <span className="text-sm dark:text-surface-200/60 text-surface-700/60 ml-1">months</span>
              </div>
              <div>
                <span className="text-2xl font-bold dark:text-white text-surface-900">{result.days}</span>
                <span className="text-sm dark:text-surface-200/60 text-surface-700/60 ml-1">days</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-3 text-center">
              <p className="text-xl font-bold text-emerald-400">{result.totalDays.toLocaleString()}</p>
              <p className="text-[11px] dark:text-surface-200/50 text-surface-700/50 mt-0.5">Days Lived</p>
            </div>
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-3 text-center">
              <p className="text-xl font-bold text-amber-400">{result.totalWeeks.toLocaleString()}</p>
              <p className="text-[11px] dark:text-surface-200/50 text-surface-700/50 mt-0.5">Weeks Lived</p>
            </div>
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-3 text-center">
              <p className="text-xl font-bold text-rose-400">{result.totalMonths.toLocaleString()}</p>
              <p className="text-[11px] dark:text-surface-200/50 text-surface-700/50 mt-0.5">Months Lived</p>
            </div>
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-3 text-center">
              <p className="text-xl font-bold text-cyan-400">{result.totalHours.toLocaleString()}</p>
              <p className="text-[11px] dark:text-surface-200/50 text-surface-700/50 mt-0.5">Hours Lived</p>
            </div>
          </div>

          {/* Birthday info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cake size={16} className="text-pink-400" />
                <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700">Next Birthday</p>
              </div>
              {result.isBirthdayToday ? (
                <p className="text-lg font-bold text-pink-400">🎉 Happy Birthday!</p>
              ) : (
                <p className="text-sm dark:text-surface-200/70 text-surface-700">
                  <span className="text-xl font-bold text-pink-400">{result.daysUntilBirthday}</span> days until you turn <span className="font-semibold">{result.nextAge}</span>
                </p>
              )}
            </div>
            <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4">
              <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-2">Born On</p>
              <p className="text-xl font-bold text-violet-400">{result.bornDay}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
