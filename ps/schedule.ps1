Write-Host "Updating Table TTL..."
aws dynamodb update-time-to-live --table-name bliz-gallery-history --time-to-live-specification `"Enabled=true,AttributeName=ttl`" | Out-Null
Write-Host "Creating Schedule Rule..."
$ruleCreateResponse = aws events put-rule --cli-input-json file://./aws/function-schedule-create.json | ConvertFrom-Json
$ruleArn = $ruleCreateResponse.RuleArn
Write-Host "Rule ARN is $ruleArn"
Write-Host "Getting Function Details..."
$functionDetails = aws lambda get-function --function-name bliz-gallery-notify | ConvertFrom-Json
$functionArn = $functionDetails.Configuration.FunctionArn
Write-Host "Function ARN is $functionArn"
Write-Host "Adding Function Permissions for Rule..."
$addPermissionResponse = aws lambda add-permission --cli-input-json file://./aws/function-schedule-allow.json --source-arn=$ruleArn | ConvertFrom-Json
$permissionStatement = $addPermissionResponse.Statement | ConvertFrom-Json
$permissionSid = $permissionStatement.Sid
Write-Host "Permission Sid is $permissionSid"
Write-Host "Targeting Schedule to Function..."
$targetResults = aws events put-targets --rule bliz-gallery-notify-rule --targets `"Id`"=`"1`",`"Arn`"=`"$functionArn`" | ConvertFrom-Json
$failCount = $targetResults.FailedEntryCount
If ($failCount -eq 0) { Write-Host "Target Success" }
Else { Write-Host "Target Failed"}
