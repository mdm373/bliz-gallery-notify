$role = Read-Host -Prompt "Role ARN"
$phoneNumber = Read-Host -Prompt "Phone Number"
npm run package
aws lambda create-function --cli-input-json file://./aws/function-create.json --zip-file fileb://./dist/index.zip --role=$role --environment Variables=`{PHONE_NUMBER=$phoneNumber`}