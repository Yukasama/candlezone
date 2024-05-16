import { CompanyLogo } from '@/components/shared/company-logo'
import { SITE } from '@/config/site'

export const metadata = { title: 'About' }

export default function About() {
  return (
    <div className="f-col justify-center items-center mt-20 gap-1">
      <CompanyLogo px={100} className="mb-2" />
      <h1 className="text-3xl font-bold">About Zenathra</h1>
      <p className="text-zinc-500">Exploring stocks the fun way.</p>
      <p className="text-zinc-500 mt-12">Built by {SITE.creator}.</p>
    </div>
  )
}
