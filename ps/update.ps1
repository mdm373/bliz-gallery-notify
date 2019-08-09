npm run package
aws lambda update-function-code --zip-file fileb://./pack/index.zip --function-name bliz-gallery-notify

