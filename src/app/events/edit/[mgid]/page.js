import MainDashboard from '@/components/MainDashboard'
import EventEdit from '@/components/EventEdit'

export default async function Page({ params }) {
  const { mgid } = await params
  
  return (
    <MainDashboard>
      <EventEdit mgid={mgid} />
    </MainDashboard>
  )
}
