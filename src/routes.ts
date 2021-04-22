import {Router} from "express";
import { SettingsController } from "./Controllers/SettingsController";
import { UsersController } from "./Controllers/UsersController";


const routes = Router()

/* Rota de configuração */

const settingsController = new SettingsController()
const usersController = new UsersController()
routes.post('/settings', settingsController.create)
routes.post('/users', usersController.create)



export { routes }