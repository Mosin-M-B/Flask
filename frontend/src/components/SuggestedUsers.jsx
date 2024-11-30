import { Button } from "@material-tailwind/react"
export default function SuggestedUsers() {
  // This would typically come from an API
  const suggestedUsers = [
    { id: 1, username: 'user1', fullName: 'User One' },
    { id: 2, username: 'user2', fullName: 'User Two' },
    { id: 3, username: 'user3', fullName: 'User Three' },
  ]

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h2 className="font-semibold text-gray-500 mb-4">Suggested for you</h2>
      <div className="space-y-4">
        {suggestedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">{user.fullName}</p>
              </div>
            </div>
            <Button variant="link" color="white" className="hover:text-white hover:bg-black">Follow</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

