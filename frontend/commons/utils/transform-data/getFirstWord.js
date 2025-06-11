const getFirstWord = (str) => {
    let first = str
    let firstSplit = first.split(" ")
    let firstLength = firstSplit?.length ?? null

    const firstName = firstSplit[0]?.toLowerCase()

    if (firstLength > 1 && (firstName == "muhamad" || firstName == "muhammad" || firstName == "mochamad" || firstName == "mochammad" || firstName == "mohammad" || firstName == "m" || firstName == "m.")) {
        if (firstLength && firstLength > 1 && firstSplit[1] != "") {
            first = firstSplit[1]
        }
        else {
            first = firstSplit.filter(item => item.length > 1)[1]
        }
    } else {
        if (firstLength && firstLength > 1 && firstSplit[0] != "") {
            first = firstSplit[0]
        }
        else {
            first = firstSplit.filter(item => item.length > 1)[0]
        }
    }
    

    return first
}

export { getFirstWord }