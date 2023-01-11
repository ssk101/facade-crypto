import crypto from 'crypto'

export function encrypt(input, key, opts = {}) {
  if(!input) {
    throw new Error('Missing input.')
  }

  const IV = crypto.randomBytes(16)

  const {
    algorithm = 'aes-256-ctr',
    inputEncoding = 'hex',
  } = opts

  try {
    const cipher = crypto.createCipheriv(algorithm, key, IV)
    const encrypted = Buffer.concat([cipher.update(input), cipher.final()])

    return {
      iv: IV.toString(inputEncoding),
      content: encrypted.toString(inputEncoding),
    }
  } catch (e) {
    throw new Error(e)
  }
}