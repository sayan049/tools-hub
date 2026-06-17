import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t dark:border-white/10 border-surface-200 dark:bg-surface-900/50 bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row md:px-6">

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm md:text-base dark:text-surface-200/60 text-surface-700/60">
          <span>Made with</span>

          <Heart
            size={12}
            className="sm:w-[14px] sm:h-[14px] md:w-4 md:h-4 fill-red-500 text-red-500"
          />

          <span>by</span>

          <span className="font-semibold dark:text-surface-200/90 text-surface-700">
            Sayan Patra
          </span>

          <span className="mx-1">•</span>

          <a
            href="mailto:sayanpatra017@gmail.com"
            className="transition-colors dark:hover:text-primary-400 hover:text-primary-600"
          >
            sayanpatra017@gmail.com
          </a>
        </div>

        <p className="text-[11px] sm:text-xs md:text-sm dark:text-surface-200/40 text-surface-700/40 text-center">
          © {new Date().getFullYear()} Free Tools Hub — All tools free forever
        </p>
      </div>
    </footer>
  )
}
