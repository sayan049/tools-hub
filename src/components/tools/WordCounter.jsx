import { useState, useMemo } from 'react'

export default function WordCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (text.trim().length > 0 ? 1 : 0) : 0
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
    const readingTime = Math.max(1, Math.ceil(words / 200))

    // Frequent words
    const wordList = text.toLowerCase().match(/\b[a-z']+\b/g) || []
    const freq = {}
    wordList.forEach(w => {
      if (w.length > 2) freq[w] = (freq[w] || 0) + 1
    })
    const topWords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    return { chars, charsNoSpaces, words, sentences, paragraphs, readingTime, topWords }
  }, [text])

  const statCards = [
    { label: 'Characters', value: stats.chars, color: 'text-primary-400' },
    { label: 'No Spaces', value: stats.charsNoSpaces, color: 'text-violet-400' },
    { label: 'Words', value: stats.words, color: 'text-emerald-400' },
    { label: 'Sentences', value: stats.sentences, color: 'text-amber-400' },
    { label: 'Paragraphs', value: stats.paragraphs, color: 'text-rose-400' },
    { label: 'Read Time', value: `${stats.readingTime} min`, color: 'text-cyan-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white text-surface-900">Word & Character Counter</h2>
        <p className="mt-1 text-sm dark:text-surface-200/60 text-surface-700/60">Count words, characters, sentences and estimate reading time</p>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={8}
        className="w-full rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/5 bg-surface-50 px-4 py-3 text-sm dark:text-white text-surface-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all resize-y leading-relaxed"
        placeholder="Start typing or paste your text here..."
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-3 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider dark:text-surface-200/50 text-surface-700/50 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Frequent words */}
      {stats.topWords.length > 0 && (
        <div className="rounded-xl border dark:border-white/10 border-surface-200 dark:bg-white/[0.03] bg-surface-50 p-4">
          <p className="text-sm font-medium dark:text-surface-200/80 text-surface-700 mb-3">Most Frequent Words</p>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map(([word, count]) => (
              <span key={word} className="inline-flex items-center gap-1.5 rounded-lg dark:bg-white/5 bg-surface-100 px-2.5 py-1 text-xs dark:text-surface-200/80 text-surface-700">
                <span className="font-medium">{word}</span>
                <span className="dark:text-surface-200/40 text-surface-700/40">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
