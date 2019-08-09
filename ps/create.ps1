$role = Read-Host -Prompt "Role ARN"
$phoneNumber = Read-Host -Prompt "Phone Number"
$deviceId = Read-Host -Prompt "Device ID" 
npm run package
$functionCreateResponse = aws lambda create-function --cli-input-json file://./aws/function-create.json --zip-file fileb://./dist/index.zip --role=$role --environment Variables=`{PHONE_NUMBER=$phoneNumber,DEVICE_ID=$deviceId`} | ConvertFrom-Json
$functionArn = $functionCreateResponse.FunctionArn
$createResponse = aws dynamodb create-table --cli-input-json file://./aws/history-table-create.json | ConvertFrom-Json
$tableArn = $createResponse.TableDescription.TableArn
Write-Host "Table ARN is $tableArn"
Write-Host "Function ARN is $functionArn"