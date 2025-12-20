import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SessionController {
  /**
   * Show signin form
   */
  async showSignin({ inertia }: HttpContext) {
    return inertia.render('auth/signin')
  }

  /**
   * Show signup form
   */
  async showSignup({ inertia }: HttpContext) {
    return inertia.render('auth/signup')
  }

  /**
   * Handle signin
   */
  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)

      return response.redirect('/')
    } catch (error) {
      session.flash('errors', { email: 'Invalid credentials' })
      return response.redirect().back()
    }
  }

  /**
   * Handle signup
   */
  async create({ request, auth, response, session }: HttpContext) {
    const { email, password, fullName } = request.only(['email', 'password', 'fullName'])

    try {
      const user = await User.create({
        email,
        password,
        fullName,
      })

      await auth.use('web').login(user)

      return response.redirect('/')
    } catch (error) {
      session.flash('errors', { email: 'Email already exists' })
      return response.redirect().back()
    }
  }

  /**
   * Handle logout
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
