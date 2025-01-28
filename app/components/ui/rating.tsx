import * as React from 'react'

import { cn } from '~/libs/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Rating = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    )
  },
)
Rating.displayName = 'Rating'

export { Rating }