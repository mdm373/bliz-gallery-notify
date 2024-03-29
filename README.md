# Blizzard Gallery Notification
>A scheduled lambda function to give me a heads up when blizzard has a new gallery item for sale

 :heavy_exclamation_mark: `ps/something commands` in details below are powershell scripts
 
## Requirements
* AWS CLI
* NPM / NODEJS 8+
* Win 7/10 (Powershell scripts)
## Set up
* `npm install` : the usual npm install 😉
* `ps/create` : create function and table
  * provide an IAM Role with lambda invoke access when prompted.
    * role requires `AWSLambdaBasicExecutionRole ` for cloud watch logging
    * role requires `AmazonSNSFullAccess` or equivilent permission for SMS notifications
    * role requires `AmazonDynamoDBFullAccess` or equivilent permissions for dyanmo record keeping
  * provide phone number that should recieve SMS notifications when the function detects a gallery update
    * to modify SMS phone number after creation, change the  `PHONE_NUMBER` environment variable in lambda
  * provide any unique value for deviceID to identify instance of running lambda for record keeping
* `ps/schedule` : schedule function and record keeping expiration
  * see `aws/function-schedule-create.json` to modify frequency

## Develop
* `ps/update` : builds and updates lambda function code
* `ps/invoke` : invokes lambda function with empty payload
* `ps/test` : updates and invokes lambda function with empty payload
* `npm run dev`
  * runs tsc in watch mode
  * run `node dist/tasks/test` to test function invoke locally
  * required ENV vars
    * AWS_KEY / AWS_SECRET_KEY : aws credentials
    * PHONE_NUMBER : phone number to text updates to
    * DEVICE_ID : device identifier for record keeping
