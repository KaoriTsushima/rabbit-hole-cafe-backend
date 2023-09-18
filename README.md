# Setup

To run the app, you need a `.env` file with the following:

```
JWT_ISSUER=rhc-backend
JWT_AUDIENCE=rhc-frontend
JWT_SECRET={jwt secret}

# aws credentials with access to dynamoDB
REGION=aws region
ACCESS_KEY_ID=aws access key
SECRET_ACCESS_KEY=aws secret access key
```

You need DynamoDB setup to have the tables:

* RHC-USERS
