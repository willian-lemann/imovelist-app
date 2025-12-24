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

type PageProps = {
  user?: {
    id: number
    email: string
    fullName: string | null
  } | null
  isPremium?: boolean
}

export default function Dashboard() {
  const { user, isPremium = false } = usePage<PageProps>().props

  const [activeTab, setActiveTab] = useState(tabMap.LISTINGS)
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
    switch (activeTab) {
      case tabMap.LISTINGS:
        return <ListingsSection onEdit={handleEditListing} onCreateNew={handleCreateNew} />
      case tabMap.CREATE_LISTING:
        return (
          <ListingForm
            listingId={editingListingId}
            onCancel={() => setActiveTab(tabMap.LISTINGS)}
            onSuccess={handleFormSuccess}
          />
        )
      case tabMap.GALLERY:
        return <GallerySection isPremium={isPremium} />
      case tabMap.AI_PAGE_GENERATOR:
        return <AiPageGenerator isPremium={isPremium} />
      default:
        return null
    }
  }

  return (
    <>
      <Head title="Dashboard" />
      <div className="flex min-h-screen bg-gray-50">
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
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            {!isPremium && (
              <div className="flex items-center gap-4">
                <Button size="sm" variant="default">
                  Fazer upgrade
                </Button>
              </div>
            )}
          </header>

          <main className="flex-1 p-4 sm:p-6">{renderContent()}</main>
        </div>
      </div>
    </>
  )
}
