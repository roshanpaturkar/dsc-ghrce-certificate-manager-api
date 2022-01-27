const Pool = require('../../../models/pool')

const getPoolResponse = async function(pageSize, pageNumber, query) {
    const skips = pageSize * (pageNumber - 1)
    const total = await Pool.find(query).countDocuments()
    const currentPageEvents = await Pool.find(query).sort( { "_id": -1 }).skip(skips).limit(pageSize)
    const pageCount = total/pageSize
    const totalPages = pageCount.toString().split('.')[1]?parseInt(pageCount.toString().split('.')[0])+1: parseInt(pageCount.toString().split('.')[0]);

    return {
        currentPageSize: pageSize,
        currentPageNumber: pageNumber,
        totalPages: totalPages,
        totalDataCount: total,
        currentPageDataCount: currentPageEvents.length,
        data: currentPageEvents
    }
}

module.exports = getPoolResponse