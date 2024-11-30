import Feed from './Feed'
import { Header } from './Header'
import { Nav } from './Navbar'
import { Sidebar } from './Sidebar'
import SuggestedUsers from './SuggestedUsers'

export default function Home2() {
  return (
    <>
    
    <div className="flex gap-8 xl:pt-24 xl:space-y-0">
        <Header/>
        <Nav/>
        <div className="w-1/3 xl:block sm:hidden">
            
        </div>
      <div className="xl:w-2/3 sm:w-full pr-4 sm:pr-0 xl:ml-8 xl:mx-0 ">
        <Feed />
      </div>
      <div className="w-1/3 xl:block sm:hidden">
        <SuggestedUsers />
      </div>
    </div>
    </>
  )
}

