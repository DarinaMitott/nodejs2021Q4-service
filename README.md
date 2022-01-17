# RS School REST service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/DarinaMitott/nodejs2021Q4-service
```

Check out the `origin/typeorm` branch.
```bash
git checkout -b typeorm origin/typeorm
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
docker exec -it $(docker ps | grep nodejs2021q4-service_app | awk '{print $1}') npm run test
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

## Development

If you're using VSCode, you can get a better developer experience from integration with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions.

### Auto-fix and format

```
npm run lint
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
