import { Copy01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export function TextCopyButton({
  text,
  tooltip,
  className,
}: {
  text: string
  tooltip?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      type="button"
      title={tooltip ?? text}
      aria-label={tooltip ?? 'Copy to clipboard'}
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => setCopied(true))
      }}
      className={cn(
        'hover:bg-muted hover:text-foreground flex size-[1em] items-center justify-center rounded-md text-current transition-colors',
        className
      )}
    >
      <HugeiconsIcon
        icon={copied ? Tick01Icon : Copy01Icon}
        className="size-[0.8em]"
      />
    </button>
  )
}
