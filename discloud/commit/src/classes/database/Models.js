import Fanart from './models/Fanart.js'
import ModelClient from './models/Client.js'
import ModelGuild from './models/Guild.js'
import ModelEconomy from './models/Economy.js'
import ModelReminders from './models/Reminders.js'
import ModelUser from './models/User.js'
import Rather from './models/Rather.js'
import Indications from './models/Indications.js'

/**
 * Unificação de todos os Models para extensão da Classe Database
 */

class Models {
    constructor() {
        this.Fanart = Fanart
        this.Client = ModelClient
        this.Guild = ModelGuild
        this.Economy = ModelEconomy
        this.Reminder = ModelReminders
        this.User = ModelUser
        this.Rather = Rather
        this.Indications = Indications
    }
}

export {
    Fanart,
    ModelClient as Client,
    ModelGuild as Guild,
    ModelEconomy as Economy,
    ModelReminders as Reminders,
    ModelUser as User,
    Models,
    Rather,
    Indications
}