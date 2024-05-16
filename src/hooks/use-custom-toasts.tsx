import { toast } from 'sonner'

export const useCustomToasts = () => {
  const defaultError = () => {
    toast.error('Oops! Something went wrong.', {
      description: `Please try again later.`,
    })
  }

  return { defaultError }
}
