npx openapi-generator-cli generate `
  -i http://localhost:8080/swagger/v1/swagger.json `
  -g typescript-fetch `
  -o src/api `
  --additional-properties=supportsES6=true