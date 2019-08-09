import {handler} from '../lambda/index'
import { Config, config as globalAwsConfig, Credentials} from 'aws-sdk'

const getRequiredEnvVar = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`required env variable ${key} not defined`)
  }
  const value = process.env[key] || ''
  return value
}

const awsGlobal = async () => {
  const credentials = new Credentials(getRequiredEnvVar('AWS_KEY'), getRequiredEnvVar('AWS_SECRET_KEY'))
  const region = 'us-east-1'
  const config = new Config({region, credentials})
  globalAwsConfig.update(config)
  console.log('GLOBAL AWS CONFIG LOADED')
}

( async () => {
  try {
    await awsGlobal()
    await handler({})
  } catch (e) {
    console.error(e)
  }
})()
