import scheduler from 'adonisjs-scheduler/services/main'

scheduler.command('scrape:listings').daily().timezone('America/Sao_Paulo').at('03:00')
