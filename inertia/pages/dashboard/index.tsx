import { useState } from 'react'
import { Head, usePage } from '@inertiajs/react'
import { Menu } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Sidebar, tabMap } from './sidebar'
import { ListingsSection } from './listings-section'
import { ListingForm } from './listing-form'
import { GallerySection } from './gallery-section'
import { AiPageGenerator } from './ai-page-generator'
import { DashboardHome } from './dashboard-home'
import { Profile } from './profile'

type PageProps = {
  user?: {
    id: number
    email: string
    fullName: string | null
    profilePhoto?: string | null
    whatsapp?: string | null
    profileUrl?: string | null
    logo?: string | null
  } | null
  isPremium?: boolean
  listingsCount?: number
}

export default function Dashboard() {
  const { user, isPremium = false, listingsCount = 0 } = usePage<PageProps>().props

  const [activeTab, setActiveTab] = useState(tabMap.DASHBOARD)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingListingId, setEditingListingId] = useState<number | null>(null)

  const handleEditListing = (listingId: number) => {
    setEditingListingId(listingId)
    setActiveTab(tabMap.CREATE_LISTING)
  }

  const handleCreateNew = () => {
    setEditingListingId(null)
    setActiveTab(tabMap.CREATE_LISTING)
  }

  const handleFormSuccess = () => {
    setEditingListingId(null)
    setActiveTab(tabMap.LISTINGS)
  }

  const renderContent = () => {
    const tabContentMap = {
      [tabMap.DASHBOARD]: (
        <DashboardHome
          userName={user?.fullName || 'Usuário'}
          listingsCount={listingsCount}
          plan={isPremium ? 'Premium' : 'Gratuito'}
          isPremium={isPremium}
          onCreateListing={handleCreateNew}
        />
      ),
      [tabMap.LISTINGS]: (
        <ListingsSection onEdit={handleEditListing} onCreateNew={handleCreateNew} />
      ),
      [tabMap.CREATE_LISTING]: (
        <ListingForm
          listingId={editingListingId}
          onCancel={() => setActiveTab(tabMap.DASHBOARD)}
          onSuccess={handleFormSuccess}
        />
      ),
      [tabMap.PROFILE]: <Profile user={user ?? undefined} />,
      [tabMap.GALLERY]: <GallerySection isPremium={isPremium} />,
      [tabMap.AI_PAGE_GENERATOR]: <AiPageGenerator isPremium={isPremium} />,
    }

    return tabContentMap[activeTab] ?? null
  }

  return (
    <>
      <Head title="Dashboard" />
      <div className="flex min-h-screen bg-white">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentUser={user ? { name: user.fullName || '', email: user.email } : undefined}
          isPremium={isPremium}
        />

        <div
          className={cn(
            'flex flex-1 flex-col transition-all duration-300 ease-in-out',
            sidebarOpen ? 'md:ml-64' : 'ml-0'
          )}
        >
          <header>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </header>

          <main className="flex-1 p-4 sm:p-8 bg-white">{renderContent()}</main>
        </div>
      </div>
    </>
  )
}
