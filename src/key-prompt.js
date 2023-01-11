import prompt from 'prompt'

const promptSchema = {
  properties: {
    key: {
      description: 'Key',
      pattern: /^.{32,32}$/,
      message: 'Key must be exactly 32 characters in length',
      hidden: true,
      replace: '*',
      required: true,
    },
  },
}

export async function keyPrompt() {
  prompt.start()

  const result = await prompt.get(promptSchema)

  return result
}