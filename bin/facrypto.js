#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import {
  encrypt,
  decrypt,
  keyPrompt,
} from '../src/index.js'

const options = {
  f: {
    alias: 'inputFile',
    describe: 'Path to an input file to encrypt',
    type: 'string',
  },
  o: {
    alias: 'outputFile',
    describe: 'Path to an output file to encrypt',
    type: 'string',
  },
  i: {
    alias: 'input',
    describe: 'Input text to encrypt',
    type: 'string',
  },
  a: {
    alias: 'algorithm',
    describe: 'Type of encryption algorithm to be used',
    type: 'string',
    default: 'aes-256-ctr',
  },
  inputEncoding: {
    describe: 'Encoding for the input',
    type: 'string',
    default: 'hex',
  },
  outputEncoding: {
    describe: 'Encoding for the output',
    type: 'string',
    default: 'binary',
  },
}

const argv = yargs(process.argv.slice(2))
  .command(['encrypt', 'decrypt'])
  .options(options)
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .wrap(80)
  .argv

const {
  _,
  inputFile,
  outputFile,
  input,
  algorithm,
  inputEncoding,
  outputEncoding,
} = argv

const command = _[0]

const functions = {
  encrypt,
  decrypt,
}

const { key } = await keyPrompt()

let inputContent

if(inputFile) {
  try {
    inputContent = fs.readFileSync(inputFile)
  } catch (e) {
    throw new Error(e)
  }
} else if(input) {
  inputContent = input
}

const result = functions[command](inputContent, key, {
  algorithm,
  inputEncoding,
  outputEncoding,
})

const data = command === 'encrypt' ? JSON.stringify(result) : result
const outTarget = outputFile || `${inputFile}.${command}ed`

if(outTarget) {
  try {
    if(fs.existsSync(outTarget)) {
      throw new Error(`Output target ${outTarget} already exists.`)
    }
  } catch (e) {
    throw new Error(e)
  }

  const outDir = path.dirname(outTarget)

  if(!outDir) {
    throw new Error('Unkown error parsing output file directory.')
  }

  try {
    fs.mkdirSync(outDir, { recursive: true })
  } catch (e) {
    throw new Error(e)
  }

  try {
    fs.writeFileSync(
      outTarget,
      data,
      { encoding: outputEncoding }
    )
  } catch (e) {
    throw new Error(e)
  }

  console.log('Output saved to', outTarget)

  process.exit(0)
} else {
  console.log(data)
}

process.exit(0)

