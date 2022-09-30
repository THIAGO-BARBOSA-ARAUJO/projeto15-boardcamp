import joi from "joi"

const schemaCategories = joi.object({
    name: joi.string()
    .empty()
    .required(),
}).options({ abortEarly: false })

const schemaAddGames = joi.object({
    name: joi.string()
    .empty()
    .required(),

    stockTotal: joi.number()
    .required(),

    pricePerDay: joi.number()
    .required()
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

export {ValidaCategories, ValidaschemaAddGames}