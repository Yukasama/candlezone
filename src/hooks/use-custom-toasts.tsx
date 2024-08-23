import { toast } from 'sonner'

const defaultError = () => {
  toast.error('Oops! Something went wrong.', {
    description: `Please try again later.`,
  })
}

export const useCustomToasts = () => {
  return { defaultError }
}
