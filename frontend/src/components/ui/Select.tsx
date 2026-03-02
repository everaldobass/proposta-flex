import { cn } from '@/lib/utils'
import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-lg bg-white transition-all duration-150 appearance-none cursor-pointer',
            'border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
            error && 'border-red-400',
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
export default Select
