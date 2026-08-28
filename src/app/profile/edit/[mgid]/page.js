import MainDashboard from '@/components/MainDashboard'
import ProfileEdit from '@/components/ProfileEdit'

export default async function Page({ params }) {
  const { mgid } = await params
  
  return (
    <MainDashboard>
      <ProfileEdit mgid={mgid} />
    </MainDashboard>
  )
}
