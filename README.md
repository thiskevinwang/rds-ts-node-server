# rds-ts-node-server

## Notes

This api is consumed by

- https://github.com/thiskevinwang/coffee-code-climb
- https://github.com/thiskevinwang/you-suck-try-harder

## Local DynamoDB w/ Docker

- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.Docker.html
- https://hub.docker.com/r/amazon/dynamodb-local

```bash
docker pull amazon/dynamodb-local
docker run --rm -d -it -p 8000:8000 amazon/dynamodb-local
```
