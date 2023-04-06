import slashCommand from '../../structures/handler/slashCommands.js'
import automaticSystems from '../../functions/update/index.js'
import GiveawayManager from '../../functions/update/giveaway/manager.giveaway.js'
import PollManager from '../../functions/update/polls/poll.manager.js'
import managerReminder from '../../functions/update/reminder/manager.reminder.js'
// import Socket from './websocket.saphire.js'
import QuizManager from '../games/QuizManager.js'
import webhook from './webhooks.saphire.js'
import { Database, Discloud, SaphireClient as client, TwitchManager } from '../index.js'
import { Config } from '../../util/Constants.js'

/**
 * @param Nothing
 * Leitura dos prototypes e eventos
 * 
 * Login do Client e Database
 * 
 * Registro dos SlashCommands
 * 
 * Shard 0 - Exclusão do Cache
 * 
 * Console Log da Shard
 */
export default async () => {

    process.env.TZ = "America/Sao_Paulo"
    await import('./process.saphire.js')

    import('../../structures/handler/events.handler.js')
    import('../../functions/global/prototypes.js')

    await client.login()
    await Discloud.login()

    // console.log('4/14 - Tentiva de Websocket Connection')
    // client.socket = new Socket(client.shardId || 0).enableListeners()

    await Database.MongoConnect()
    await slashCommand(client)
    await Database.Cache.clearTables(`${client.shardId}`)

    await GiveawayManager.setGiveaways()

    await PollManager.set()

    automaticSystems()

    await client.setCantadas()
    await client.setMemes()
    await client.refreshStaff()
    await managerReminder.define()
    await QuizManager.load()
    client.fanarts = await Database.Fanart.find() || []
    client.animes = await Database.Anime.find() || []
    import('./webhooks.saphire.js').then(file => file.default()).catch(() => { })
    Config.webhookAnimeReporter = await webhook(Config.quizAnimeAttachmentChannel)
    Config.webhookQuizReporter = await webhook(Config.questionSuggestionsSave)
    console.log(`Connected at Shard ${client.shardId}`)

    if (client.shardId == 0)
        import('../../api/app.js')

    client.user.setPresence({
        activities: [
            { name: `${client.slashCommands.size} comandos incríveis\n[Shard ${client.shardId}/${client.shard.count} in Cluster ${client.clusterName}]` }
        ],
        status: 'idle',
        shardId: client.shardId
    })

    TwitchManager.load()
    return client.calculateReload()
}