const toEncrypt = (val) => {
    if (!val) return
    return Buffer.from(val.toString()).toString('base64')
}

const toDecrypt = (val) => {
    if (!val) return
    return Buffer.from(val.toString(), 'base64').toString('ascii')
}

export {
    toEncrypt,
    toDecrypt
}
