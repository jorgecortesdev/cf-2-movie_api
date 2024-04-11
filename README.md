# cf-2-movie_api

## Uploading the database

```
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection movies --type json --file db/movies.json
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection users --type json --file db/users.json
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection actors --type json --file db/actors.json
```

- `<DB_USER>`: The newly created user.
- `<DB_PASSWORD>`: The password of the newly created user.
- `<DB_HOST>`: The database host.
- `<DB_NAME>`: The database name.
