import { currentUser } from '@clerk/nextjs/server'
export default async function Dashboard() {
  const user = await currentUser()
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-semibold">Welcome {user?.firstName ?? 'friend'}</h2>
        <p className="text-white/80">Run a ritual, mark your Shimmer drill, or check your streaks.</p>
      </div>
    </div>
  )
}
