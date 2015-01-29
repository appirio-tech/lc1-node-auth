serenity authorizaiton node module
===

Common module for serenity applications.

This is the authentication module for serenity


## How to install?

Install via npm and git

```
npm install git+https://github.com/appirio-tech/lc1-node-auth.git
```

## Configuration

Sample configuration is provided below (below configuration is defined in yaml the same can be defined in javascript also)

```
app:
  tcApi: http://qa.topcoder.com/v2
  tcUser: http://dev-lc1-user-service.herokuapp.com
auth0:
  client: ''
  secret: ''
auth:
  enabled: false
  perms:
    - challengeApp
  paths:
    - httpVerb: DELETE
      path: '*'
    - httpVerb: PUT
      path: '*'
    - httpVerb: POST
      path: '*'
    - httpVerb: GET
      path: '/challenges/:challengeId/files/:fileId/download'
    - httpVerb: GET
      path: '/challenges/:challengeId/files/:fileId/upload'
    - httpVerb: GET
      path: '/challenges/:challengeId/submissions/:submissionId/files/:fileId/upload'
    - httpVerb: GET
      path: '/challenges/:challengeId/submissions/:submissionId/files/:fileId/download'
```

This is the default configuration which is used in lc1-challenge-service. There is no change in this configuration. This configuration object has to be passed to serenity-auth module during instantiation

## Examples:

```
var auth = require('serenity-auth');
// central point for all authentication
auth.auth(app, config, routeHelper.errorHandler);
// NOTE: Above the last argument is the error handler middleware. If any error occured in serenity-middleware it will be passed to next middleware. This removes the dependency with route-helper

```
