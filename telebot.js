'use strict'

var tg = require('telegram-node-bot')('208861476:AAFkV6kx6rjKOOyNQudcZ88YrTH6ZATCRIo')

tg.router.when(['/fh'], 'PingController')

tg.controller('PingController', ($) => {
    tg.for('/fh', () => {
        $.sendMessage('ahihi')
    })
}) 
