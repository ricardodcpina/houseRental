const { isValidObjectId } = require('mongoose')
const { House, Reserve } = require('../models')

const errors = require('../errors')

exports.createReserve = async (userId, houseId, date) => {

    // Checks Object ID validity
    if (!isValidObjectId(houseId)) throw errors.invalidID

    // Checks for house ID and availability
    const house = await House.findOne({
        _id: houseId, available: true
    })
    if (!house) throw errors.notFound

    // Checks if user is not the owner
    if (String(house.user) === userId) {
        throw errors.notAllowed
    }

    // Sets house availability to false
    await House.updateOne({ _id: houseId },
        { available: false })

    // Creates reserve on house
    const reserve = await Reserve.create(
        { user: userId, house: houseId, date })

    await reserve.populate('user')
    await reserve.populate('house')

    return reserve
}

exports.listMyReserves = async (userId) => {

    const reserves = await Reserve.find({ user: userId })
        .populate('house')

    return reserves
}

exports.cancelReserve = async (userId, reserveId) => {

    // Checks Object ID validity
    if (!isValidObjectId(reserveId)) throw errors.invalidID

    // Checks for reserve ID
    const reserve = await Reserve.findOne({ _id: reserveId })
        .populate('house')

    if (!reserve) throw errors.invalidID

    // Checks if reserve belongs to user
    if (String(reserve.user) !== userId) throw errors.notAllowed

    // Sets house availability to true
    await House.updateOne({ _id: reserve.house },
        { available: true })

    // Deletes the reserve
    return await Reserve.deleteOne({ _id: reserveId })
}

