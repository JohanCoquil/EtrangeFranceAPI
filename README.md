# EtrangeFranceAPI

Simple API server built with Node.js and Express.

## Development

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

By default, the server attempts to connect to a MySQL database using the following credentials:

- host: `localhost`
- user: `yoxigen_EtrFra`
- password: `x05cl5FLuyF!`
- database: `yoxigen_EtrFra`

Override these values by setting the environment variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.

Run tests:

```bash
npm test
```

## API

- `GET /professions` – returns the list of professions with fields `id`, `name`, `description`, and `image`.
