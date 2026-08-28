import MainDashboard from '@/components/MainDashboard'
import EventDetail from '@/components/EventDetail'

export default async function Page({ params }) {
  const { mgid } = await params
  
  return (
    <MainDashboard>
      <EventDetail mgid={mgid} />
    </MainDashboard>
  )
}
