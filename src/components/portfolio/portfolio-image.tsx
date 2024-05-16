import { Portfolio } from '@prisma/client'

interface Props {
  portfolio: Pick<Portfolio, 'title' | 'color'>
  px?: number
}

export default function PortfolioImage({
  portfolio,
  px = 40,
}: Readonly<Props>) {
  return (
    <div
      className="f-box rounded-full border text-lg"
      style={{
        backgroundColor: portfolio.color ?? '#000',
        minHeight: px,
        minWidth: px,
      }}
    >
      <p className="text-white">{portfolio.title[0].toUpperCase()}</p>
    </div>
  )
}
