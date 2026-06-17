import { Sun, Moon, Menu, X, Sparkles } from 'lucide-react'

export default function Header({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-900/80 backdrop-blur-xl dark:bg-surface-900/80 bg-white/80 dark:border-white/10 border-surface-200">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 transition-colors md:hidden dark:text-surface-200 text-surface-700 dark:hover:bg-white/10 hover:bg-surface-100"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2.5">

            <h1 className="text-lg font-bold tracking-tight dark:text-white text-surface-900">
              Free Tools Hub
            </h1>
          </div>
        </div>

        {/* Right: CTA + dark mode toggle + info */}
        <div className="flex items-center gap-3">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            Built for Digital Heroes
          </a>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary-500/25"
          >
            Built for Digital Heroes
          </a>
          <button
            onClick={() => {
              setDarkMode(!darkMode)
              document.documentElement.classList.toggle('dark')
            }}
            className="rounded-lg p-2 transition-all dark:text-yellow-400 text-surface-600 dark:hover:bg-white/10 hover:bg-surface-100"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
