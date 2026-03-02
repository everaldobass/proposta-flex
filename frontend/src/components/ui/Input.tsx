import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-lg bg-white transition-all duration-150',
            'border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
            'placeholder:text-slate-400',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
        {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
