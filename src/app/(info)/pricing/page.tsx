import { PLANS } from '@/config/plans'
import PricingCard from '../../../components/pricing-card'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Pricing' }

export default function Pricing() {
  return (
    <div className="f-col justify-center items-center pt-16 pb-7 gap-5">
      {/* Header */}
      <Badge variant="secondary">Pricing</Badge>
      <h1 className="text-4xl font-bold font-['Helvetica'] max-w-[400px] text-center">
        Choose the plan that fits your needs
      </h1>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
        {PLANS.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  )
}
