import SmeeClient from 'smee-client'

const smee = new SmeeClient({
  source: 'https://smee.io/e8nZExCpJnUXaaSB',
  target: 'http://127.0.0.1:3000/webhook',
  logger: console
})

const events = smee.start()

// Stop forwarding events
//events.close()