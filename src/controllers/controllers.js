import connection from "../databases/db.js"


const status = async (req, res) => {
    res.sendStatus(200)
}

const getCategories = async (req, res) => {

    const categories = await connection.query(`SELECT * FROM categories;`)

    res.status(200).send(categories.rows[0])
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

//SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id; -> query para trazer as linhas do get /games

export {status, addCategories, getCategories, addGames}