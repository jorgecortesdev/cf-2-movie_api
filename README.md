# myFlix API

The myFlix API provides users with access to a vast library of movie information, including details about different movies, directors, and genres.

Users can register, create a profile, and manage their favorite movies list. Additionally, users can explore actor information, view movie ratings, and create a "To Watch" list for future movie selections.

## Installation
- Clone the repository to your local machine.
- Open the project directory in your preferred code editor.
- Open the terminal and run `npm install`.

For consistency, we will pin a `node` version for this project locally. We will use [nvm](https://github.com/nvm-sh/nvm) to manage the version. Check out the `.nvmrc` file for the `node` version.

```
nvm install
nvm use
```

## Documentation

For documentation the app uses [swagger](https://swagger.io/). You can find the documentation of the API right here https://cf-2-movie-api.onrender.com/docs.
## Code styling and problems

```
npm run lint
```

## Uploading the database

```
cd db
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection movies --type json --file db/movies.json
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection users --type json --file db/users.json
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection actors --type json --file db/actors.json
```

- `<DB_USER>`: The newly created user.
- `<DB_PASSWORD>`: The password of the newly created user.
- `<DB_HOST>`: The database host.
- `<DB_NAME>`: The database name.
