npm run package
aws lambda update-function-code --zip-file fileb://./dist/index.zip --function-name bliz-gallery-notify

