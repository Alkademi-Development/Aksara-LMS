import { createCipheriv } from 'crypto'

// get token and code from localStorage
let storageToken = localStorage.getItem('gt') || ''
let storageCode = localStorage.getItem('ct') || ''
let appSecret = 'vOVH6sdmpNWjR271Cc7rdxs01lwHzfr3' // TEMP

const generate = (code, token) => {
    const ci = createCipheriv(
        'aes-256-ctr',
        Buffer.from(appSecret),
        Buffer.from(code)
    )

    return ci.update(token, 'utf8', 'hex') + ci.final('hex')
}

const generatedToken = async (code, token) => {
    console.log("-1", code, token);

    if (!!code && !!token) {
        return generate(code, `${new Date().getTime()}:${generate(code, token)}`);
    }
}

const generateDAppToken = async (code, token) => {

    const res = {
        code: code,
        token: await generatedToken(code, token)
    }

    return res
}

export default {
    generatedToken,
    generateDAppToken,
}
