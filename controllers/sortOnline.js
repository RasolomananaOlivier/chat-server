const sortOnline = (arr) => {
    let sorted = []
    sorted.push(arr[0])
    for (let index = 1; index < arr.length; index++) {
        const element = arr[index];
        let isPresent = false
        sorted.forEach(el => {
            if (el === element) {
                isPresent= true
            }
        });
        if (!isPresent) sorted.push(element)
    }
    return sorted;
};

module.exports = sortOnline;
