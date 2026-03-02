import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-lg bg-white transition-all duration-150 resize-none',
            'border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
            'placeholder:text-slate-400',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
export default Textarea
