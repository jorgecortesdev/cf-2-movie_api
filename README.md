# myFlix API

The myFlix API provides users with access to a vast library of movie information, including details about different movies, directors, and genres.

Users can register, create a profile, and manage their favorite movies list. Additionally, users can explore actor information, view movie ratings, and create a "To Watch" list for future movie selections.

## Requirements

- MongoDB
- NodeJs

For consistency, I'll pin a `node` version for this project locally. I'm using [nvm](https://github.com/nvm-sh/nvm) to manage the versions. Check out the `.nvmrc` file for the `node` version used on this project.

## Installation & Usage

```
git clone https://github.com/jorgecortesdev/cf-2-movie_api.git
cd cf-2-movie_api
```

If you are not using `nvm` skip the next two commands:
```
nvm install
nvm use
```

Continue with:
```
npm install
cp .env.example .env
```

#### Additional Notes

- Please customize the `.env.example` file.
- The database name as `myFlixAPI`.
- The default port is 8080.
- Make sure to change the value of the `JWT_SECRET` env variable.

## Sample data installation

For a local mongodb server:

```
mongoimport --uri mongodb://localhost:27017/myFlixAPI --collection movies --type json --file db/movies.json
mongoimport --uri mongodb://localhost:27017/myFlixAPI --collection users --type json --file db/users.json
mongoimport --uri mongodb://localhost:27017/myFlixAPI --collection actors --type json --file db/actors.json
```

For a remote mongodb server:
```
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection movies --type json --file db/movies.json
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection users --type json --file db/users.json
mongoimport --uri mongodb+srv://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME> --collection actors --type json --file db/actors.json
```

- `<DB_USER>`: The newly created user.
- `<DB_PASSWORD>`: The password of the newly created user.
- `<DB_HOST>`: The database host.
- `<DB_NAME>`: The database name.

## The API Documentation

For documenting the API, the app uses [swagger](https://swagger.io/). You can find the live documentation right here https://cf-2-movie-api.onrender.com/docs.

## Code styling and problems

The app uses `eslint` and `prettier` for code styling and problems checker. To run it, use:

```
npm run lint
```

## Maintainers

Currently, the sole maintainer is [@jorgecortesdev](https://github.com/jorgecortesdev) - more maintainers are quite welcome.

## License

See [LICENSE.md](./LICENSE.md).
