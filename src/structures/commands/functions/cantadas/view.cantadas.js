import { ButtonStyle } from "discord.js"
import {
    SaphireClient as client
} from "../../../../classes/index.js"
import { Emojis as e } from "../../../../util/util.js"
import cantadaAdmin from "../../slashCommands/admin/admin/cantada.admin.js"

export default async ({ interaction, buttonInteraction, clientData, commandData }) => {

    let option = undefined
    let cId = interaction?.message?.embeds[0]?.data?.footer?.text

    if (!buttonInteraction) {
        option = interaction.options.getString('opcoes')
        cId = interaction?.message?.embeds[0]?.data?.footer?.text || interaction.options.getString('search')

        if (['analize', 'delete'].includes(option))
            return cantadaAdmin(interaction, null, clientData.CantadasIndicadas, option, cId)
    }

    if (!client.cantadas.length)
        return await interaction.reply({
            content: `${e.Deny} | Nenhuma cantada encontrada.`,
            ephemeral: true
        })

    const cantadasAvailable = option === 'mycantadas'
        ? client.cantadas.filter(c => c.userId === interaction.user.id)
        : client.cantadas.filter(c => c.id !== cId)

    let cantada = cId
        ? client.cantadas.find(c => c.id === cId)
        : cantadasAvailable?.random()

    if (!cantada || !cantadasAvailable || !cantadasAvailable.length)
        return await interaction?.update({
            content: `${e.Deny} | Nenhuma cantada foi encontrada.`,
            components: []
        }).catch(async () => await interaction.reply({
            content: `${e.Deny} | Nenhuma cantada foi encontrada.`,
            components: []
        }).catch(() => { }))

    const author = await client.users.fetch(cantada.userId || '0')
        .then(u => `${u.tag} - \`${u.id}\``)
        .catch(() => `Not Found - \`${cantada.userId}\``)

    const acceptedFor = await client.users.fetch(cantada.acceptedFor || '0')
        .then(u => `${u.tag} - \`${u.id}\``)
        .catch(() => `Not Found - \`${cantada.acceptedFor}\``)

    const embed = {
        color: client.blue,
        title: `😗 ${client.user.username}'s Cantadas - ${client.cantadas.findIndex(c => c.id === cantada.id) + 1}/${client.cantadas.length}`,
        description: cantada.phrase,
        fields: [
            {
                name: '📝 Escrita por',
                value: author
            },
            {
                name: `${e.ModShield} Autorizado por`,
                value: acceptedFor
            }
        ],
        footer: {
            text: commandData?.mc || option === 'mycantadas'
                ? `${cantadasAvailable?.length} cantadas`
                : cantada.id
        }
    }

    const components = [
        {
            type: 1,
            components: [
                {
                    type: 2,
                    label: `${cantada.likes.up.length || 0}`,
                    emoji: '❤️‍🔥',
                    custom_id: JSON.stringify({ c: 'cantada', src: 'like', id: cantada.id, mc: commandData?.mc || option === 'mycantadas' }),
                    style: ButtonStyle.Success
                },
                {
                    type: 2,
                    label: `${cantada.likes.down.length || 0}`,
                    emoji: '🖤',
                    custom_id: JSON.stringify({ c: 'cantada', src: 'unlike', id: cantada.id, mc: commandData?.mc || option === 'mycantadas' }),
                    style: ButtonStyle.Danger
                },
                {
                    type: 2,
                    emoji: '🔄',
                    custom_id: JSON.stringify({ c: 'cantada', src: 'random', userId: interaction.user.id, mc: commandData?.mc || option === 'mycantadas' }),
                    style: ButtonStyle.Primary,
                    disabled: client.cantadas.length <= 1
                }
            ]
        }
    ]

    const data = {
        embeds: [embed],
        components
    }

    return buttonInteraction
        ? await interaction.update(data)
        : await interaction.reply(data)
}