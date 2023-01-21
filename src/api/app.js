import express from 'express'
import topggReward from '../functions/topgg/reward.js'
import axios from 'axios'
import { SaphireClient as client } from '../classes/index.js'
import { Emojis as e } from '../util/util.js'
import os from 'os'
const hostName = os.hostname()
let system = {
  name: hostName === 'RodrigoPC' ? 'RodrigoPC' : 'Discloud',
  port: hostName === 'RodrigoPC' ? 1000 : 8080
}
import('dotenv/config');

const app = express()

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Max-Age", 3600)
  next();
})

app.use(express.json())

app.post(`${process.env.ROUTE_TOP_GG}`, async (req, res) => {

  if (req.headers?.authorization !== process.env.TOP_GG_ACCESS)
    return res
      .send({ status: 401, response: "Authorization is not defined correctly." });

  const userId = req.body?.user

  if (!userId)
    return res.status(206).send('A partial content was given.')

  topggReward(userId || null).catch(() => null)

  return res.status(200).send()
})

app.get(`${process.env.ROUTE_COMMANDS}`, async (req, res) => {

  if (req.headers?.authorization !== process.env.COMMAND_ACCESS)
    return res
      .send({
        status: 401,
        response: "Authorization is not defined correctly."
      });

  return res
    .send(client?.slashCommandsData || [])

})

app.get(`${process.env.ROUTE_ALL_GUILDS}`, async (req, res) => {

  if (req.headers?.authorization !== process.env.ALL_GUILDS_ACCESS)
    return res
      .send({
        status: 401,
        response: "Authorization is not defined correctly."
      });

  const allGuilds = await client.shard.fetchClientValues('guilds.cache').catch(() => [])
  const ids = allGuilds?.flat()?.map(guild => guild?.id) || []

  return res
    .status(200)
    .send(ids || [])

})

app.get(`${process.env.ROUTE_ALL_USERS}`, async (req, res) => {

  if (req.headers?.authorization !== process.env.ALL_USERS_ACCESS)
    return res
      .send({
        status: 401,
        response: "Authorization is not defined correctly."
      });

  const allUsers = await client.shard.fetchClientValues('users.cache').catch(() => [])
  const ids = allUsers?.flat()?.map(user => user?.id) || []

  return res
    .status(200)
    .send(ids || [])

})

app.get("/", async (_, res) => res.status(200).send({ status: "Online" }))

app.use((_, res) => res.status(404).send({ status: 404, message: "Route Not Found" }))

app.listen(system?.port || process.env.SERVER_PORT, "0.0.0.0", () => alertLogin(system?.name))

export default app

async function alertLogin(host) {

  if (!host) {
    console.clear()
    return process.exit(10)
  }

  console.log('13/14 - Saphire\'s Local API Connected')

  await client.sendWebhook(
    process.env.WEBHOOK_STATUS,
    {
      username: `[${client.canaryId === client.user.id ? 'Saphire Canary' : 'Saphire'}] Connection Status`,
      content: `${e.Check} | **Shard ${client.shardId} in Cluster ${client.clusterName} Online**\n📅 | ${new Date().toLocaleString("pt-BR").replace(" ", " ás ")}\n${e.cpu} | Processo iniciado na Host ${host}\n📝 | H.O.S Name: ${hostName}`
    }
  )

  return await axios({
    url: 'https://ways.discloud.app/online',
    method: "POST",
    headers: {
      authorization: `${process.env.LOGIN_ACCESS}`,
      hostname: `${host} - ${hostName}`,
      "Content-Type": "application/json"
    },
    data: {}
  })
    .catch(err => console.log(err.response.data))
}