'use client'

import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'

export default function ErrorPage({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <div className="f-col gap-3 items-center mt-[360px]">
      <div className="f-col items-center">
        <h2 className="text-lg">Oops! Something went wrong.</h2>
        <p className="text-slate-400 text-sm">There was an error on our end.</p>
      </div>
      <Button aria-label="Reload page" onClick={() => reset()}>
        <RotateCw size={18} />
        Reload page
      </Button>
    </div>
  )
}
