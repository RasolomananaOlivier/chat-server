const sortOffline = (arr , u ) => {
    const update = arr.filter((item) => item !== u)
    return update
}

module.exports = sortOffline;