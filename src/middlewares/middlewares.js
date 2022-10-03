import joi from "joi"


const schemaAddGames = joi.object({
    name: joi.string()
    .empty()
    .required(),

    stockTotal: joi.number()
    .required(),

    pricePerDay: joi.number()
    .required()
}).options({ abortEarly: false })

const schemaCategories = joi.object({
  name: joi.string()
  .empty()
  .required(),
}).options({ abortEarly: false })

const schemaCustomers = joi.object({
  name: joi.string()
  .empty(),

  phone: joi.string()
  .min(10)
  .max(11),

  cpf: joi.string()
  .min(11)
  .max(11)
  .pattern(/^[0-9]+$/, 'numbers'),

  birthday: joi.date()
  .iso()
  .max('now')
}).options({ abortEarly: false })

async function ValidaCategories(req, res, next) {
  const {name} = req.body

	const validation = schemaCategories.validate({name});

  if (validation.error) {
    return res.sendStatus(400);
  }
  next()
}

async function ValidaschemaAddGames(req, res, next) {
  const {name, stockTotal, pricePerDay} = req.body

	const validation = schemaAddGames.validate({name, stockTotal, pricePerDay});

  if (validation.error) {
    return res.sendStatus(400);
  }
  next()
}

async function ValidaschemaAddCustomers(req, res, next) {
  
  
	const validation = schemaCustomers.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }
  next()
}



export {ValidaCategories, ValidaschemaAddGames, schemaCustomers, ValidaschemaAddCustomers}

// links uteis

// https://stackoverflow.com/questions/20083807/javascript-date-to-sql-date-object

// https://day.js.org/docs/en/parse/string

// https://day.js.org/docs/en/parse/string-format