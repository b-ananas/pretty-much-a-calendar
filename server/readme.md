backend for pretty-much-a-calendar
build with typescript, express, typeorm(psql), apollo and jwt

authentication:
access token can be set only at one endpoint: /refresh_token. To use it a (http-only) refresh_token is required. it is obtained by login mutation

before deployment:
change the content of .env file