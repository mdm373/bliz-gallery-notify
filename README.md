## Blizzard Client Notify
>A scheduled lambda function to give me a heads up when blizzard has a new gallery item for sale

 :bangbang: ps/something commands in details below are powershell scripts
## Set up
* exec 'npm install'
* create function: ps/create
  * provide an IAM Role with lambda invoke access when prompted. 
    * role requires 'AmazonSNSFullAccess' or equivilent permission
  * Provide phone number that should recieve SMS notifications when the function detects a gallery update
    * To modify SMS phone number after creation, change the  `PHONE_NUMBER` environment variable in lambda
* schedule function: ps/schedule
  * see `aws/function-schedule-create.json` to modify frequency

## Develop
* ps/update : builds and updates lambda function code
* ps/invoke : invokes lambda function with empty payload
* ps/test : updates and invokes lambda function with empty payload