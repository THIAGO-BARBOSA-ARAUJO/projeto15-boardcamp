import express from "express"
import { status, addCategories, getCategories, addGames } from "../controllers/controllers.js"
import { ValidaCategories, ValidaschemaAddGames } from "../middlewares/middlewares.js"

const router = express.Router()

router.get("/status", status) // teste

router.post("/categories", ValidaCategories, addCategories) // adiciona categoria

router.get("/categories", getCategories) // busca categorias

router.post("/games",ValidaschemaAddGames, addGames)

export default router