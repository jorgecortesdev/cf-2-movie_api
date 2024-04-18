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

## CareerFoundry Students

If you are a CareerFoundry Student, this project is module #2 of the Full-Stack Immersion course. If you are not too sure about your code and you need a reference, you can use the following links to compare your code with mine.

- **2.2: Node.js Modules:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/1/files
- **2.3: Packages & Package Managers:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/2/files
- **2.4: Web Server Frameworks & Express:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/3/files
- **2.5: REST & API Endpoints:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/4/files
- **2.7: Non-Relational Databases & MongoDB:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/5/files
- **2.8: The Business Logic Layer:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/6/files
- **2.9: Authentication & Authorization:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/7/files
- **2.10: Data Security, Validation & Ethics:** https://github.com/jorgecortesdev/cf-2-movie_api/pull/8/files

If you are wondering why there are some missing numbers is because the lesson or the task wasn't directly related with the code and didn't require any modification of the API.

Additionally, if you want to extend your movie API project you might want read the code in the other branches.

- https://github.com/jorgecortesdev/cf-2-movie_api/pull/9/files
- https://github.com/jorgecortesdev/cf-2-movie_api/pull/10/files
- https://github.com/jorgecortesdev/cf-2-movie_api/pull/11/files
- https://github.com/jorgecortesdev/cf-2-movie_api/pull/12/files

#### Branches

The exercise branches are called `Task-2.x`, where `x` stands for exercise number.

The extra content branches start with a number which is the order and the feature added, ex. `2-add-swagger`.

If you want to clone a particular branch to review the code in your computer, first make sure to be in a different folder of your own project. Then you can do the following (change the branch name if you want a different branch):

```
git clone https://github.com/jorgecortesdev/cf-2-movie_api.git
cd cf-2-movie_api
git checkout Task-2.2
```

Or

```
git clone https://github.com/jorgecortesdev/cf-2-movie_api.git --branch Task-2.2
cd cf-2-movie_api
```

## Not a CareerFoundry Student?

If you’re interested in studying with CareerFoundry, you can use my referral link for a 5% discount on one of the courses: https://careerfoundry.com/en/referral_registrations/new?referral=ArJpwnEw

## Maintainers

Currently, the sole maintainer is [@jorgecortesdev](https://github.com/jorgecortesdev) - more maintainers are quite welcome.

## License

See [LICENSE.md](./LICENSE.md).
