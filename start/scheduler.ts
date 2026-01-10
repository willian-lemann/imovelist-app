import logger from '@adonisjs/core/services/logger'
import scheduler from 'adonisjs-scheduler/services/main'

logger.info('Scheduler for scraping service initialized.')

scheduler.command('scrape:listings').daily().timezone('America/Sao_Paulo').at('03:00')
