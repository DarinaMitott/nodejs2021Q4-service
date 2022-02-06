# RS School REST service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/DarinaMitott/nodejs2021Q4-service
```

Check out the `origin/nestjs` branch.
```bash
git checkout -b nestjs origin/nestjs
```

## Installing NPM modules

```
npm install
```

## Running application in **Docker**

```bash
docker-compose up --build
```


After the two containers are up, you can **Run tests**:
```bash
# execute this this command to run tests
docker exec -it $(docker ps | grep nodejs2021q4-service_app | awk '{print $1}') npm run test:auth
```

This command may fail if you checked out the repository to other than `nodejs2021q4-service` folder

It will create two containers: one for postgres, another one for the application itself

Any source file change would restart the application.

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm test
```

To run only one of all test suites (users, boards or tasks)

```
npm test <suite name>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization (users, boards or tasks)

```
npm run test:auth <suite name>
```

## Comparison NestJs backends: Express vs Fastify results


| backend | Response Time                              | vusers sess len                                      | 
|---------|--------------------------------------------|------------------------------------------------------|
| Express | min 4, max 180, mid 21.1, p95 144, p99 153 | min 73.8, max 280.5, mid 135.7, p95 194.4, p99 242.3 |
| Fastify | min 3, max 175, mid 19.9, p95 147, p99 153 | min 68.7, max 297,   mid 135.7, p95 186.8, p99 228.2 |        


For load testing used [artillery](https://artillery.io/) library.

To switch between backends there is `USE_FASTIFY` env variable in the `.env` file, set it to `true` to
switch to **Fastify**, otherwise **Express** will be used.

You can run the testing via the following command:
```bash
artillery run artillery.yml
```

Load test results for dev environment are stored at:
- [`./artillery-express.json`](./artillery-express.json)
- [`./artillery-fastify.json`](./artillery-fastify.json)


## Development

If you're using VSCode, you can get a better developer experience from integration with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions.

### Auto-fix and format

```
npm run lint
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
