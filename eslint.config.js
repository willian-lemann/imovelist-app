import { configApp } from '@adonisjs/eslint-config'

export default {
  ...configApp(),
  rules: {
    ...configApp().rules,
    'unicorn/filename-case': 'off',
  },
}
