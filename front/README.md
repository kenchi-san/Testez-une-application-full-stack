# Yoga

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project

Git clone:

```sh
git clone https://github.com/kenchi-san/Testez-une-application-full-stack.git
cd /front
```

Install dependencies:

> npm install

Launch Front-end:

> ng serve;


## Ressources

### Mockoon env 

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json 

by following the documentation: 

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman


### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234


### Test

#### E2E

Launching e2e test:

> ng run yoga:e2e-ci

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:
> front/coverage/lcov-report/index.html

#### Unitary test

Launching test:

> npm run test

for following change:

> npm run test:watch


open virtual cypress:
> cypress open

open coverage jest array:
> front/coverage/jest/lcov-report/index.html


