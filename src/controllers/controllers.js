import connection from "../databases/db.js"
import dayjs from "dayjs"

const status = async (req, res) => {
    res.sendStatus(200)
}

const getCategories = async (req, res) => {

    const categories = await connection.query(`SELECT * FROM categories;`)

    res.status(200).send(categories.rows)
}

const addCategories = async (req, res) => {
    const { name } = req.body

    //SELECT usuario FROM tabela WHERE usuario = 'exemplo';

    const existCategorie = await connection.query(`SELECT * FROM categories WHERE name = '${name}';`)

    if(existCategorie.rows.length > 0){
        res.sendStatus(409)
    }else{
        await connection.query(`INSERT INTO categories (name) VALUES ('${name}');`)
        res.sendStatus(201)
    }
    
}

const addGames = async (req, res) => {
    let { name, image, stockTotal, categoryId, pricePerDay } = req.body

    if(stockTotal <= 0 || pricePerDay  <= 0){
        res.sendStatus(400)
        return
    }

    const existGame = await connection.query(`SELECT * FROM games WHERE name = '${name}';`)

    const existIdGame = await connection.query(`SELECT * FROM categories WHERE id = '${categoryId}';`)

    console.log(existGame.rows.length)
    console.log(existIdGame.rows.length)

    if(existGame.rows.length > 0 && existIdGame.rows.length > 0){
        res.sendStatus(409)
        return
    }else{

        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`, [name, image, stockTotal, categoryId, pricePerDay])

        res.sendStatus(201)
        return
    }
}

const getGames = async (req, res) =>{
    const filter = req.query.name
    console.log(filter)
    if(filter){
        const games = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE games.name ~* '${filter}';`)

        res.status(200).send(games.rows)
        return
    }else{
        
        const games = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id;`)
    
        res.status(200).send(games.rows)
        return
    }

    
}

const addCustomers = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body

    if(!name || !phone || !cpf || !birthday) {
        return res.sendStatus(400)
    }

    const existCategorie = await connection.query(`SELECT * FROM customers WHERE cpf = '${cpf}';`)

    if(existCategorie.rows.length > 0){
        res.sendStatus(409)
        return
    }else{
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday])
        res.sendStatus(201)
        return
    }
}

const getCustomers = async (req, res) => {

    const cpf = req.query.cpf
    //const id = req.params.id

    if(cpf){

        const games = await connection.query(`SELECT * FROM customers WHERE customers.cpf ~* '${cpf}';`)

        res.status(200).send(games.rows)
        return
    }else{
        
        const games = await connection.query(`SELECT * FROM customers;`)
    
        res.status(200).send(games.rows)
        return
    }
    
}


const getCustomersId = async (req, res) => {
    const id = req.params.id

    if(id){
        const games = await connection.query(`SELECT * FROM customers WHERE customers.id = '${id}';`)

        if(games.rows.length > 0){
            res.status(200).send(games.rows)
            return
        }else{
            res.sendStatus(404)
        }
    }
}

const updateCustomers = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body
    const { id } = req.params
    const existCpf = await connection.query(`SELECT * FROM customers WHERE cpf = '${cpf}';`)

    if(existCpf.rows.length > 0){
        res.sendStatus(409)
        return
    }else{
        if(name) {
            connection.query(`UPDATE customers SET name=$1 WHERE id = $2;`, [name, id])
            
        }
        if(phone) {
            connection.query(`UPDATE customers SET phone=$1 WHERE id = $2;`, [phone, id])
        }
        if(cpf) {
            connection.query(`UPDATE customers SET cpf=$1 WHERE id = $2;`, [cpf, id])
        }
        if(birthday) {
            connection.query(`UPDATE customers SET birthday=$1 WHERE id = $2;`, [birthday, id])
        }
        res.sendStatus(201)
        return
    }
}

const addRentals = async (req, res) => {
    const {customerId, gameId, daysRented} = req.body

    const rentDate = dayjs()

    const returnDate = null

    const delayFee = null

    if(daysRented <= 0){
        return res.sendStatus(400)
    }

    const {rows: [ game ]} = await connection.query(`SELECT * FROM games WHERE id = ${gameId};`)

    const originalPrice = daysRented * game.pricePerDay

    const existCliente = await connection.query(`SELECT * FROM customers WHERE id = ${customerId};`)

    console.log(existCliente)
    console.log(game)
    if(existCliente.rows.length <= 0 || !game){
        return res.sendStatus(400)
    }

    const quantAlug = await connection.query(`SELECT * FROM rentals WHERE id = ${gameId};`)

    if(quantAlug.rows.length >= game.stockTotal){
        return res.sendStatus(400)
    }

    await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee])

    res.sendStatus(201)
}

const getRentals = async (req, res) => {

    const resp = await connection.query(`SELECT rentals.*, customers.name as "customerName", games."categoryId", games.name as "gameName", categories.name as "categoryName" FROM rentals
    JOIN customers ON rentals."customerId"=customers.id
    JOIN games ON rentals."gameId"=games.id 
    JOIN categories ON games."categoryId"=categories.id;`)

    res.status(200).send(resp.rows)
}

//SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE games.name ~* 'ba';

//SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id; -> query para trazer as linhas do get /games

export {status, addCategories, getCategories, addGames, getGames, addCustomers, getCustomers, getCustomersId, updateCustomers, addRentals, getRentals}