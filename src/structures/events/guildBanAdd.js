import { AuditLogEvent } from 'discord.js'
import { SaphireClient as client, Database } from '../../classes/index.js'
import { Permissions } from '../../util/Constants.js'
import { Emojis as e } from '../../util/util.js'

client.on('guildBanAdd', async ban => {

    const { user, guild } = ban

    if (
        !user
        || !guild
        || !guild.available
        || user.id === client.user.id
        || !guild.clientHasPermission(Permissions.ViewAuditLog)
    ) return

    const guildData = await Database.Guild.findOne({ id: guild.id }, 'LogSystem LeaveChannel')
    if (!guildData?.LogSystem?.ban?.active) return

    const channel = await guild.channels.fetch(guildData.LogSystem?.channel).catch(() => null)
    if (!channel || !guildData.LogSystem?.channel) return

    const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 5 }).catch(() => null) // { type: 22 } - GuildBanAdd
    if (!logs) return

    const kickLog = logs?.entries.find((value) => value.targetId === ban.user.id);
    if (!kickLog || kickLog.action !== AuditLogEvent.MemberBanAdd) return

    const { executor, target, reason } = kickLog

    if (
        !executor
        || !target
        || executor.id === target.id
        || [user.id, client.user.id].includes(executor.id)
    ) return

    const embed = {
        color: client.red,
        title: "🛰️ Global System Notification | Ban",
        fields: [
            { name: '👤 Usuário', value: `${user.tag} - *\`${user.id}\`*` },
            { name: `${e.ModShield} Moderador`, value: `${executor.tag} \`${executor.id}\`` },
            { name: '📝 Razão', value: `${reason || 'Sem motivo informado'}` },
            { name: '📅 Data', value: `${Date.Timestamp()}` }
        ],
        footer: { text: guild.name, iconURL: guild.iconURL({ forceStatic: false }) }
    }

    return channel.send({ embeds: [embed] }).catch(() => { })

})