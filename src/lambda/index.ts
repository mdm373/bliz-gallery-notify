
import {JSDOM, VirtualConsole} from 'jsdom'
import {get as requestGet} from 'request-promise-native'
import {DynamoDB, SNS} from 'aws-sdk'

const oneYearOfSeconds = 60 * 60 * 24 * 360
const tableName = 'bliz-gallery-history'

interface ProductEntry {
  readonly productCount: number
  readonly ttl?: number
  readonly deviceId?: string
}

const dynamoClient = new DynamoDB.DocumentClient({region: 'us-east-1'})
const sns = new SNS({region: 'us-east-1'})

const getExistingProductCount = async (deviceId: string) => {
  const items = (await dynamoClient.query({
    TableName: tableName,
    KeyConditionExpression: 'deviceId = :deviceId',
    ExpressionAttributeValues: {':deviceId': deviceId},
  }).promise()).Items
  return items && items[0] as ProductEntry || undefined
}

export const handler = async (_: any) => {
  const deviceId = process.env.DEVICE_ID as string
  if (!deviceId) {
    throw new Error('device id not found')
  }
  const phoneNumber = process.env.PHONE_NUMBER as string
  if (!phoneNumber) {
    throw new Error('phone number not found')
  }

  console.log('getting gallery website')
  const url = 'https://gear.blizzard.com/us/blizzard-gallery-products'
  const html = await requestGet(url)
  const virtualConsole = new VirtualConsole()
  console.log('browsing with jsdom')
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url, virtualConsole})
  await new Promise ( (accept) => dom.window.onload = () => {accept()})
  console.log('window loaded')
  const products = dom.window.document.getElementsByClassName('product-card')
  const newProductCount = products.length
  dom.window.close()
  const oldProduct = await getExistingProductCount(deviceId) || {productCount: 0}

  console.log(`new product count: ${newProductCount}`)
  console.log(`old product count: ${oldProduct.productCount}`)
  if (oldProduct.productCount !== newProductCount) {
    console.log('updating for modified product count')
    const ttl =  Math.floor(Date.now() / 1000) + oneYearOfSeconds
    const newProduct: ProductEntry = {deviceId, ttl, productCount: newProductCount}
    await Promise.all([
      await dynamoClient.put({ TableName: tableName, Item: newProduct }).promise(),
      await sns.publish({
        PhoneNumber: `+1 ${phoneNumber}`,
        Message: `Looks like there is a new product on the bliz gallery: ${url}`,
      }).promise(),
    ])
  }
}
