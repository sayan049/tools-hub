import {
  Receipt, Calculator, QrCode, KeyRound, FileText,
  ArrowLeftRight, CalendarDays, Palette, Braces, Split
} from 'lucide-react'

const tools = [
  { id: 'gst', name: 'GST / Invoice', icon: Receipt },
  { id: 'emi', name: 'EMI / Loan', icon: Calculator },
  { id: 'qr', name: 'QR Generator', icon: QrCode },
  { id: 'password', name: 'Password Gen', icon: KeyRound },
  { id: 'wordcount', name: 'Word Counter', icon: FileText },
  { id: 'unit', name: 'Unit Converter', icon: ArrowLeftRight },
  { id: 'age', name: 'Age Calculator', icon: CalendarDays },
  { id: 'color', name: 'Color Palette', icon: Palette },
  { id: 'json', name: 'JSON Formatter', icon: Braces },
  { id: 'bill', name: 'Bill Splitter', icon: Split },
]

export default function Sidebar({ activeTool, setActiveTool, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-[57px] z-40 h-[calc(100vh-57px)] w-64 
          border-r transition-transform duration-300 ease-out
          dark:bg-surface-900/95 bg-white/95 backdrop-blur-xl
          dark:border-white/10 border-surface-200
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col gap-1 p-3 overflow-y-auto h-full">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest dark:text-surface-200/50 text-surface-700/50">
            All Tools
          </p>
          {tools.map(({ id, name, icon: Icon }) => {
            const isActive = activeTool === id
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTool(id)
                  setSidebarOpen(false)
                }}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 w-full text-left
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/10 text-primary-400 dark:text-primary-400 shadow-sm dark:shadow-primary-500/5'
                    : 'dark:text-surface-200/70 text-surface-700 dark:hover:bg-white/5 hover:bg-surface-100 dark:hover:text-white hover:text-surface-900'
                  }
                `}
              >
                <div className={`
                  flex h-8 w-8 items-center justify-center rounded-lg transition-all
                  ${isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'dark:bg-white/5 bg-surface-100 dark:text-surface-200/60 text-surface-700/60 dark:group-hover:bg-white/10 group-hover:bg-surface-200'
                  }
                `}>
                  <Icon size={16} />
                </div>
                <span>{name}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400 shadow-sm shadow-primary-400/50" />
                )}
              </button>
            )
          })}
        </div>
      </aside>
    </>
  )
}

export { tools }
