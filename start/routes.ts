import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const HomeController = () => import('#controllers/home_controller')
const ListingsController = () => import('#controllers/listings_controller')
const SessionController = () => import('#controllers/session_controller')

router.get('/', [HomeController, 'index'])

router
  .group(() => {
    router.get('/login', [SessionController, 'showSignin'])
    router.post('/signin', [SessionController, 'store'])
    router.get('/signup', [SessionController, 'showSignup'])
    router.post('/signup', [SessionController, 'create'])
  })
  .use(middleware.guest())

router.post('/logout', [SessionController, 'destroy']).use(middleware.auth())

router.group(() => {
  router.get('/listings/create', [ListingsController, 'create'])
  router.post('/listings', [ListingsController, 'store'])
  router.get('/listings/:id', [ListingsController, 'show'])
  router.get('/listings/:id/edit', [ListingsController, 'edit'])
  router.put('/listings/:id', [ListingsController, 'update'])
  router.delete('/listings/:id', [ListingsController, 'destroy'])
})
