# A challenge project

* [A challenge project](#a-challenge-project)
  * [Project description](#project-description)
     * [Campaign](#campaign)
     * [Ad Group](#ad-group)
     * [Ad](#ad)
     * [Ad Stats](#ad-stats)
     * [Data files](#data-files)
  * [Starting the service](#starting-the-service)
  * [Features](#features)
     * [Configuration](#configuration)
     * [Swagger documentation](#swagger-documentation)
     * [Endpoint validation](#endpoint-validation)
     * [Linting](#linting)
     * [Database](#database)
     * [Docker](#docker)
     * [Docker Compose](#docker-compose)
     * [Linting](#linting-1)
     * [Testing](#testing)
  * [Used libraries](#used-libraries)
  * [npm tasks](#npm-tasks)
  * [DB Collections](#db-collections)
  * [Further comments about API](#further-comments-about-api)
  * [Postman](#postman)
  * [Deploying service using Kubernetes](#deploying-service-using-kubernetes)

## Project description

### Campaign
Describes advertising campaign. Campaign is composed of one or multiple adgroups and each adgroup has a set of ads assigned to it

### Ad Group
Describes ad group of advertising campaign

### Ad
Describes ad of particular ad group

### Ad Stats
Describes statistics of particular ad for time t

### Data files
Data files contain a collections of advertising campaigns, adgroups, ads and ads statistics over time. 
Each advertising campaign has following structure: Campaign 1-> N Ad groups 1 -> N Ads 1 -> N stats

## Starting the service

 * Clone project locally
 
`git clone git@github.com:mirceaalexandru/sample-project-express.git`

 * Prepare configuration: 
   * Copy `sample.env` as `.env`. Change any environment variable to match your environment configuration.
   * Copy `sample-env-variables.env` as `env-variables.env`. Change any environment variable to match your environment configuration. This file contains the configuration required by docker-compose.

 You can start you service in one of these ways:
 * Start your service using an external Mongo DB. Just need to provide correct DB URI in `.env` (or as environment variable).
 * Start your service using the MongoDB started with docker-compose. 
 You need to start docker-compose (`docker-compose up --build --scale service=0`) and then you can start your service on local host.
 * Start your service and MongoDB using docker-compose. You can start docker compose (`docker-compose up --build`). This will start multiple MongoDB and then start the service. 

`Note` The docker-compose method is another way of starting this service in development mode, using nodemon which will restart the application
        when code changes are made.

## Features

### Configuration

 * Configuration is loaded from environment variables.
 * Support for loading from an `.env` file is provided. However the `dotenv` is added as dev dependency making sure that `.env` is not loaded in production as this will be a bad practice.
 * Before service is started a strict schema validation is applied on configuration object. This is required to make sure the application is started with a valid configuration, at least from structure point of view.
 * There are no configuration defaults. This will enforce creating proper environment variables for all configuration parameters.
 
### Swagger documentation

 * Swagger documentation for implemented API is exposed automatically on `/api-docs/` endpoint.
 * This documentation is created automatically using the annotations in the API code.
 * This documentation is exposed automatically only for `development` environments, in `staging` or `production` it will not be available.
 * Swagger documentation is available here: http://test.alexandrumircea.ro:30000/api-docs 
 
### Endpoint validation

 * All endpoints have a strict validation implementing using JOI library.
 * This implementation is described in the Swagger documentation.
 * Validation errors details are not exposed in the HTTP response.
 
### Linting

The project is using eslint to make sure the code style is consistent.
 
### Database

The docker-compose provided in this project is creating the required MongoDB node.

### Docker

Docker files are provided for:
 * development environment - `Dockerfile.dev`. This is using nodemon for automatically reloading the service when changes are made.
 * production environment - `Dockerfile`

### Docker Compose

A docker compose is provided. This docker compose contains our service and also a MongoDB. The docker-compose will:
 * start MongoDB
 * start service
 
### Linting

Please run `npm run lint` for linting.

### Testing

Please run `npm run test:integrations` for running integration tests.

## Used libraries

Some of the libraries used in this project:
 
 - `@hapi/joi` - a very good JSON validation library. It is used to validate the configuration before starting the service and to validate requests.
 - `swagger-jsdoc` - generate Swagger JSON based on annotations in code
 - `swagger-ui-express` - generate and expose UI fo Swagger documentation based on output from `swagger-jsdoc`
 
## npm tasks
 
The following npm tasks are available to the developer:
 
  - `start` - start the service.
  - `start:dev` - start service in development mode, using nodemon library. It reloads the service when code changes are detected.
  - `db:clean` - clean database by deleting all documents in known collection (see next section for details). *Cannot be executed in any other environment that development*
  - `db:createIndexes` - create indexes fo MongoDB collections. Having the indexes stored in a file is good approach for maintaining database structure. This task can also be used by any pre-task when service is deployed/started.
  - `db:populate` - Use the [data files](#data-files) populate the database with some initial testing data. *Cannot be executed in any other environment that development*
  - `db:prepare` - is running `db:clean`, `db:createIndexes` and `db:populate` tasks in this order.

`Note #1` One initial requirement was to populate database when service is started. Because these scripts are destructive for database content
the decisions was to implement them as separate npm tasks. In this way the user can decide when it is OK to run these tasks.

`Note #2` Some of the above npm tasks are very dangerous to be applied in other environments than development. 
Because of this these tasks have at the start a test for environment and exit automatically if this condition is not matched. 
It is very important to be careful when running these tasks as these are very destructive for DB content. 
  
`Note #3` Each document in data files has an id that has 36 chars length. This is different from _id that is automatically created
for each MongoDB document. The assumption that this id should be used by all endpoints. 
Because of this all endpoints  are actually using (and returning in response) this id, not returning the _id internal mongo document id. 

`Note #4` As described above there is provided a script for adding [indexes](./scripts/createIndexes.js) fo known collections. 
Some of these indexes are also adding unique constraints for `id` in the collections, making sure no duplicates can be inserted.

## DB Collections

A file containing information about all database collection can be found [here](./scripts/dbHelper.js). 
This list is used by above scripts when preparing database with testing data.

## Further comments about API

- For one endpoint (`/v1/ads/:adId/stats/startDate/:startDate/endDate/:endDate`) it was also implemented pagination and sorting.
 In order to implement pagination & sorting it was required to compute cost per click as part of the retrieve data operation.
 Fo this endpoint it was used [MongoDB Aggregation Pipelines](./lib/models/stats.js).
 Also, the same aggregation pipelines computes the total number of items matching provided criteria as this is required for a proper implementation for pagination on client side.
- All endpoints have versions (`/v1` in this case). This helps manage changes in API definitions with backward compatibility.
- Health endpoint (`/v1/health`) is provided for liveness probe. 
- Health endpoint (`/v1/health`) can be used also for readiness probe as service is exposing the endpoints after DB connection is created.

## Postman

Postman collection of requests definitions and local environment setup variables can be found in [./docs/postman](./docs/postman) folder.

## Deploying service using Kubernetes

- Please check [here](./docs/eks.md) for details how this service was deployed using AWS ECR/EKS.
- Configuration files used for deploying the service can be found in [./docs/k8s](./docs/k8s) folder.
- Service is exposed at: http://test.alexandrumircea.ro:30000
- Swagger documentation is available here: http://test.alexandrumircea.ro:30000/api-docs