const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getAll = async function (req, res) {
    const query = {
        user: req.user.id,
    }

    if (req.query.start) {
        query.date = {
            $gte: req.query.start  // $gte => больше или равно
        }
    }
    if (req.query.end) {
        if (!query.date) {
            query.date = {}
        }

        query.date['$lte'] = req.query.end  // $lte => меньше или равно
     }
     
     if (req.query.order) {
        query.order = +req.query.order
     }

    try {
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset) // для пагинации используем етот метод
            .limit(+req.query.limit) // кол-во на странице

        res.status(200).json(orders)
    } catch (e) {
        errorHandler(res, e)
    }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.create = async function (req, res) {
    try {
        const lastOrder = await Order
            .findOne({user: req.user.id})
            .sort({date: -1})

        const maxOrder = lastOrder ? lastOrder.order : 0

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save()

        res.status(201).json(order)
    } catch (e) {
        errorHandler(res, e)
    }
}