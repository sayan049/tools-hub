import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

import GSTCalculator from './components/tools/GSTCalculator'
import EMICalculator from './components/tools/EMICalculator'
import QRGenerator from './components/tools/QRGenerator'
import PasswordGenerator from './components/tools/PasswordGenerator'
import WordCounter from './components/tools/WordCounter'
import UnitConverter from './components/tools/UnitConverter'
import AgeCalculator from './components/tools/AgeCalculator'
import ColorPalette from './components/tools/ColorPalette'
import JSONFormatter from './components/tools/JSONFormatter'
import BillSplitter from './components/tools/BillSplitter'

const TOOLS = {
  gst: GSTCalculator,
  emi: EMICalculator,
  qr: QRGenerator,
  password: PasswordGenerator,
  wordcount: WordCounter,
  unit: UnitConverter,
  age: AgeCalculator,
  color: ColorPalette,
  json: JSONFormatter,
  bill: BillSplitter,
}

export default function App() {
  const [activeTool, setActiveTool] = useState('gst')
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const ActiveComponent = TOOLS[activeTool]

  return (
    <div className="min-h-screen flex flex-col dark:bg-surface-950 bg-surface-50 transition-colors">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto md:ml-64">
          <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="rounded-2xl border dark:border-white/[0.06] border-surface-200 dark:bg-white/[0.02] bg-white p-5 md:p-7 shadow-sm dark:shadow-none">
                  <ActiveComponent />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <div className="md:ml-64">
        <Footer />
      </div>
    </div>
  )
}
