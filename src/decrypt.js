import crypto from 'crypto'

export function decrypt(input, key, opts = {}) {
  if(!input) {
    throw new Error('Missing input.')
  }

  const {
    algorithm = 'aes-256-ctr',
    inputEncoding = 'hex',
    outputEncoding = 'binary',
  } = opts

  const hashed = JSON.parse(input)
  const decipher = crypto
    .createDecipheriv(algorithm, key, Buffer.from(hashed.iv, inputEncoding))
  const decrypted = Buffer
    .concat([
      decipher.update(Buffer.from(hashed.content, inputEncoding)), decipher.final()
    ])

  return new Buffer(decrypted.toString(outputEncoding), outputEncoding)
    .toString(outputEncoding)
}