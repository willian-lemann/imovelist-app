import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const HomeController = () => import('#controllers/home_controller')
const DetailsController = () => import('#controllers/details_controller')
const ListingsController = () => import('#controllers/listings_controller')
const SessionController = () => import('#controllers/session_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const GalleryController = () => import('#controllers/gallery_controller')
const GroupTypesController = () => import('#controllers/group_types_controller')

router.get('/', [HomeController, 'index'])
router.get('/imoveis/:id/:slug', [DetailsController, 'index'])

// Dashboard route (protected)
router.get('/dashboard', [DashboardController, 'index']).use(middleware.auth())

router.group(() => {
  router.get('/login', [SessionController, 'showSignin']).use(middleware.guest())
  router.post('/api/signin', [SessionController, 'store'])
  router.get('/signup', [SessionController, 'showSignup'])
  router.post('/api/signup', [SessionController, 'create'])
})

router.post('/logout', [SessionController, 'destroy']).use(middleware.auth())

// API routes for client-side fetching
router
  .group(() => {
    router.get('/listings', [ListingsController, 'index'])
    router.get('/listings/:id', [ListingsController, 'show'])
    router.post('/listings', [ListingsController, 'store']).use(middleware.auth())
    router.put('/listings/:id', [ListingsController, 'update']).use(middleware.auth())
    router.delete('/listings/:id', [ListingsController, 'destroy']).use(middleware.auth())

    router.get('/group-types', [GroupTypesController, 'index'])

    // Gallery routes (protected)
    router.get('/gallery/:listingId', [GalleryController, 'index'])
    router.post('/gallery/:listingId', [GalleryController, 'store']).use(middleware.auth())
    router.delete('/gallery/:id', [GalleryController, 'destroy']).use(middleware.auth())
    router.put('/gallery/:listingId/reorder', [GalleryController, 'reorder']).use(middleware.auth())
  })
  .prefix('/api')
