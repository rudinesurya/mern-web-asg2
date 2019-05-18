# mern-web-asg2

Name: Rudine Surya Hartanto

server: https://github.com/rudinesurya/mern-web-asg2

client: https://github.com/rudinesurya/ess-ewd-asg2-react


## Table of Contents

+ [Overview](#Overview)
    + [Objectives](#Objectives)


+ [Setup Requirements](#Setup-Requirements)
    + [Installation](#Installation)
    + [Configuration](#Configuration)
    + [Scripts](#Scripts)


+ [Api Design](#Api-Design)
    + [Routing](#Routing)
    + [Best Practices](#Best-Practices)
    + [Middlewares](#Middlewares)
    
    
+ [Persistence](#Persistence)
    + [MongoDB](#MongoDB)
    + [Mongoose](#Mongoose)
    + [Data Model Design](#Data-Model-Design)
    
    
+ [Features](#Features)
    + [Clean Architecture Adopted](#Clean-Architecture-Adopted)
    + [Validations](#Validations)
    + [Authentication](#Authentication)
    + [Error Handling](#Error-Handling)
    + [ES linting](#ES-linting)
    
    
+ [Optimizations](#Optimizations)
  
  
+ [Testings](#Testings)
    + [Unit Tests](#Unit-Tests)
    + [Api Tests](#Api-Tests)
   
+ [Deployment](#Deployment) 
+ [Continuous Integration](#Continuous-Integration)

+ [Third Party Components](#Third-party-components)

+ [References](#References)




# Overview
### Objectives
FastJobs Api is a RESTful interface, providing access to most of the data in the system.
The Api accepts json content query parameters in requests and all responses are encoded in JSON, including errors. 

# Setup Requirements
### Installation
+ npm install

Make sure the mongodb the app is using is switched on before starting the server. 
To specify the mongo_uri, change the config json file.

### Configuration
To override the configurations, you should create a new development.json file and place it in the config folder.
The project will use the default.json when no NODE_ENV is specified, otherwise it will use the config file matching it.

### Scripts

command | description
--- | ---
npm run dev | starts the server using nodemon and NODE_ENV=development
npm run eslint | auto fix all eslint errors
npm run ut | run unit tests
npm run it | run api tests
npm run coverage | run full coverage tests
npm run openc | open the full coverage report

# Api Design
### Routing

type | url | description | require login | require admin
--- | --- | --- | --- | ---
POST | api/users/ | Register a new user | No | No
POST | api/users/login | Login user | No | No
GET | api/users/current | Get current user | Yes | No
DELETE | api/users/current | Delete current user | Yes | No
DELETE | api/users/:id | Delete user | Yes | Yes
GET | api/profiles | Get all user profiles | No | No
POST | api/profiles | Create a new user profile | Yes | No
GET | api/profiles/current | Get current user profile if it exists | Yes | No
GET | api/profiles/:userId | Get user profile by userId if it exists | No | No
GET | api/profiles/handle/:handle | Get user profile by handle if it exists | No | No
POST | api/profiles/current | Create or update user profile | Yes | No
GET | api/jobs/ | Get all the jobs | No | No
GET | api/jobs/:jobId | Get a job by id | No | No
POST | api/jobs/ | Create a new job | Yes | No
PUT | api/jobs/:jobId | Update an existing job | Yes | No
DELETE | api/jobs/:jobId | Delete an existing job | Yes | No
POST | api/jobs/join/:jobId | Join an existing job | Yes | No
POST | api/jobs/leave/:jobId | Leave an existing job | Yes | No
POST | api/jobs/comment/:jobId | Leave a comment in a job post | Yes | No
DELETE | api/jobs/comment/:jobId/:commentId | Delete a comment in a job post | Yes | No


### Best Practices
+ Use nouns but no verbs
+ GET method should not alter the state
+ Use POST/PUT/PATCH to modify state
+ Use sub-resources for relations if a resource is related to another resource
    + api/jobs/comment/:jobId/:commentId
+ Provide filtering, sorting and paging for collections
    + GET api/jobs?hostId=aizkdkaskkdqwe Returns a list of jobs hosted by the hostId
    + GET api/jobs?sortBy=-date Returns a list of jobs sorted by descending date order
    + GET api/jobs?limit=10&skip=10 Returns the next 10 jobs
+ Handle errors with HTTP status codes

status code | message | description
--- | --- | ---
200 | Ok | The request was valid and served.
201 | Resource created | The request created new resources.
204 | No content | The request is valid but has no return content.
304 | Not Modified | The client has the response already in its cache.
400 | Bad request | The request was invalid or cannot be served.
401 | Unauthorized | The request requires an user authentication
403 | Forbidden | The server understood the request, but is refusing it or the access is not allowed.
404 | Not found | There is no resource behind the URI.
422 | Unprocessable Entity | Should be used if the server cannot process the entity
500 | Internal Server Error | The error that can't be catched in all of our catch blocks.

### Middlewares
middleware | description
--- | ---
passport | checks the Authorization header in each request. Returns 401 error if token is not authenticated.
admin | checks the user.admin property before granting access to forbidden routes. Returns 403 if admin is false.
error | executes at the end of each request. Acts as a global catch block to log errors and send error JSON object to client.

# Persistence
### MongoDB
All the data are being served by NoSql database, MongoDB. The db is then hosted in the cloud, by Mongo Atlas,
which makes it convenient to deploy the server to Heroku later on.

### Mongoose
Mongoose allows data to be defined using the Schema interface. 
The Schema allows you to define the fields stored in each document along with their validation requirements and default values.
The Schema allows nested schema such as the example shown below.

```$xslt
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  location: {
    type: LocationSchema,
  },
  ...
});

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
  },
});

const LocationSchema = new mongoose.Schema({
  name: String,
  location: {
    type: PointSchema,
    required: true,
  },
});
```

Mongoose also provides utility static methods eg. findOne, findById, populate that allows you to query
the database and also chain these methods together.

```$xslt
await Job.find(match)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .populate('host', ['name', 'email', 'avatarUrl']);
```

### Data Model Design
<img src="readme_img/data_model_relationship.png" width="250">

#### User
<img src="readme_img/user_model.png">

#### Profile
<img src="readme_img/profile_model.png">

#### Job
<img src="readme_img/job_model.png">
    
# Features
### Clean Architecture Adopted
This app adopted one of the most known architecture pattern, 
the one proposed by [Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) 
some years ago, called Clean Architecture.
It supports the idea of separation of concern, making the model, endpoints and business logic independent of each other.
So following those rules we split all the business logic from our API framework, creating a new ‘service’ layer.

Advantages:
+ re-useable service code. No need for repeating common functionalities.
+ clean and descriptive endpoints. 
```$xslt
/**
 * @route   POST api/jobs/comment/:jobId
 * @desc    Leave a comment in a job post
 * @access: private
 */
router.post('/comment/:jobId', passport, async (req, res) => {
  const result = await jobs.postComment(req.user._id,
    req.params.jobId,
    req.body);
  res.json(result);
});
```
+ clean and well separated business logic code
+ easier to mock test the business logic without the (req, res)
```$xslt
module.exports.postComment = function (userId, jobId, data) {
  return new Promise(async (resolve, reject) => {
    const errors = validatePostComment(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    const newComment = {
      user: userId.toString(),
      text: data.text,
    };

    try {
      const job = await Job.findById(jobId);
      if (!job) return reject(Boom.notFound('Job not found'));

      job.comments.unshift(newComment);
      const result = await job.save();
      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};
```


### Validations
Besides having mongoose to validate our data before db operations, 
we have used Joi to validate data at the request level.
The code snippet below is a validator for user registration.
```$xslt
const Joi = require('joi');

module.exports = (input) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(3).max(50).required(),
    password2: Joi.string().min(3).max(50).required(),
    isAdmin: Joi.boolean(),
  };

  const { error } = Joi.validate(input, schema, { abortEarly: false });
  let result = {};
  if (error) {
    result = error.details.reduce((map, obj) => {
      map[obj.path] = obj.message;
      return map;
    }, {});
  }
  return result;
};
```
If the input is valid, then the error will be null, otherwise it will be an Error object providing more information.

### Authentication


### Error Handling
Adhering to the best practices, we gracefully handle errors, without crashing the server,  
and use appropriate http status codes and error messages.

status code | message | description
--- | --- | ---
400 | Bad request | The request was invalid or cannot be served.
401 | Unauthorized | The request requires an user authentication
403 | Forbidden | The server understood the request, but is refusing it or the access is not allowed.
404 | Not found | There is no resource behind the URI.
422 | Unprocessable Entity | Should be used if the server cannot process the entity
500 | Internal Server Error | The error that can't be catched in all of our catch blocks.

Managing which error code and error message to return can be cumbersome, Boom provides a set of utilities for returning HTTP errors,
which allows consistency and cleaner error handling.

### ES linting
[Airbnb ES Linting](https://github.com/airbnb/javascript)
enables state of the art code quality and consistent style throughout the project.
    
# Optimizations
    
# Testings  
90%+ test coverage report

<img src="readme_img/coverage_report.png">

### Unit Tests
Model Tests : Validations of input.

Service Tests : Test business logic while mocking the mongoose operations.

<img src="readme_img/unit_tests.png" width="400">

### Api Tests
Testing of the endpoints

<img src="readme_img/api_tests.png" width="400">

# Deployment
The nodejs server is hosted in heroku.

# Continuous Integration
Travis enables automated testing and redeployment when the src gets pushed to github.

# Third Party Components 
library | description
--- | ---
boom | HTTP-friendly error objects
bcryptjs | Hashing and comparing passwords
config | Organizes hierarchical configurations for your app deployments.
cors | provide cors middleware
express-async-errors | A dead simple ES6 async/await support hack for ExpressJS
gravatar | Service for providing globally unique avatars
joi | Object schema description language and validator for JavaScript objects.
jsonwebtoken | JSON Web Token implementation
jwt-decode | Decode jwt tokens to object
lodash | JS utility library
mongoose | Object Data Modeling (ODM) library for MongoDB and NodeJS 
morgan | HTTP request logger middleware
passport | Authentication middleware for Node.js.
winston | Logger

dev library | description
--- | ---
chai | BDD / TDD assertion library
eslint |  linter tool for identifying and reporting on patterns
mocha | JavaScript test framework 
mockgoose | In memory database mock to allow for testing
nodemon | Simple monitor script for use during development of a node.js app
nyc | Code coverage reporter
should | BDD / TDD assertion library
sinon | Standalone test spies, stubs and mocks for JavaScript
supertest | Super-agent driven library for testing node.js HTTP servers using a fluent API

# References 

https://blog.mwaysolutions.com/2014/06/05/10-best-practices-for-better-restful-api/

https://solidgeargroup.com/clean-architecture-in-nodejs

https://github.com/airbnb/javascript

https://github.com/hapijs/boom/blob/master/API.md
