import express from "express"
import { status, addCategories, getCategories, addGames, getGames, addCustomers, getCustomers, getCustomersId, updateCustomers, addRentals, getRentals } from "../controllers/controllers.js"
import { ValidaCategories, ValidaschemaAddGames, ValidaschemaAddCustomers } from "../middlewares/middlewares.js"

const router = express.Router()

router.get("/status", status) // teste

router.post("/categories", ValidaCategories, addCategories) // adiciona categoria

router.get("/categories", getCategories) // busca categorias

router.post("/games",ValidaschemaAddGames, addGames) // adiciona game

router.get("/games", getGames) // Busca games

router.post("/customers", ValidaschemaAddCustomers, addCustomers) // adiciona cliente

router.get("/customers", getCustomers) // busca clientes

router.get("/customers/:id", getCustomersId) // busca clientes por id

router.put("/customers/:id", ValidaschemaAddCustomers, updateCustomers) // atualiza clientes por id

router.post("/rentals", addRentals) // adciciona um aluguel

router.get("/rentals", getRentals) //busca um aluguel

export default router