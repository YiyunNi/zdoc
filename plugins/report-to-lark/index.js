const fetch = require('node-fetch')
const { URL } = require('node:url')
const tokenFetcher = require('../lark-docs/larkTokenFetcher')
const { v4: uuidv4 } = require('uuid')
require('dotenv/config')

module.exports = function (context, options) {
    return {
        name: "report-to-lark",
        extendCli(cli) {
            cli.command('report-to-lark')
               .description('Send messages to lark')
               .option('-rId, --receiveId <receiveId>', 'A unique ID for the message receiver, possible types are open_id, user_id, union_id, email, chat_id', context.siteConfig.plugins.filter(plugin => plugin[0].includes('report-to-lark'))[0][1].receiveId)
               .option('-type, --type <type>', 'message type, possible types are text or interactive', 'interactive')
               .option('-cId, --cardId <cardId>', 'message card id', context.siteConfig.plugins.filter(plugin => plugin[0].includes('report-to-lark'))[0][1].cardId)
               .option('-cVer, --cardVersion <cardVersion>', 'message card version', context.siteConfig.plugins.filter(plugin => plugin[0].includes('report-to-lark'))[0][1].cardVersion)
               .option('-m, --msg <message>', 'message')
               .action(async (options) => {
                    const receiveId = options.receiveId
                    const msgType = options.type
                    const cardId = options.cardId
                    const cardVersion = options.cardVersion
                    const message = options.msg
                    const FEISHU_HOST = process.env.FEISHU_HOST

                    const fetcher = new tokenFetcher()
                    await fetcher.fetchToken()

                    const token = await fetcher.token()

                    const content = msgType === 'text'? {
                        text: message
                    }: {
                        template_id: cardId,
                        template_version_name: cardVersion,
                    }

                    const res = await fetch(`${FEISHU_HOST}/open-apis/im/v1/messages?receive_id_type=chat_id`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            receive_id: receiveId,
                            msg_type: msgType,
                            content: JSON.stringify(content),
                            uuid: uuidv4()
                        })
                    })

                    console.log((await res.json()).msg)    
               })
        }
    }
}