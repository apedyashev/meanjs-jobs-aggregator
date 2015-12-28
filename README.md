[![Build Status](https://codeship.com/projects/8f5d90b0-83f7-0133-c789-0221f9c8cecf/status?branch=master)](CodeShip)

This project was developed as part of my learning of AngularJS. The project is a service that allows to search jobs scrapped from jobscout24.ch using import.io

Demo can be seen [here](http://ja.rrs-lab.com)
The other goal of this project is to create REST API that I can use for future learning of front-end frameworks (like ReactJS, Angular 2.0 etc).


## Installation

Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

To install Node.js dependencies you're going to use npm again, in the application folder run this in the command-line:

```
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)


## REST API description
* GET /api/users/me - returns logged user or *null* if user is not logged in
* PUT /api/users - updates user's info
* POST /api/users/password - changes password. Requires following fields: 
 - currentPassword
 - newPassword
 - verifyPassword
* POST /api/auth/signup - signes user up. Required fields:
 - firstName
 - lastName 
 - email
 - username
 - password
* POST /api/auth/signin. Required fields
 - email
 - password
* delete /api/auth Signs user out
* GET /api/jobs. Returns all jobs. Aceptable query string's params:
 - **subscriptionId** [NOT REQUIRED] - if specified, then only jobs found for that subscriptions will be returned. Can be used by **authorized** users only, oterwise 401 HTTP status code will be returned
 - **limit** [NOT REQUIRED]. Number of redurned jobs. Default value is **20**
 - **offset** [NOT REQUIRED] Default is **0**
* GET /api/jobs/stats - Returns statistics. Aceptable query string's params:
 - cities=true [NOT REQUIRED] Array with stats by cities will be returned. Example: [{name: "Bern", count: 126}]. That means that DB contains 126 jobs in the city named Bern
 - availabilities=true [NOT REQUIRED]. This param will be renamed in the future since I'm not sure if it correct english word. It returns stats for different occupancies. For example: [{name: '100%', count: 507}]. That means that DB contains 507 full-time jobs (with 100% occupancy) 
* GET /api/subscriptions - returns list of subscriptions for logged user. Returns 401 Status Code if user is not logged in
* POST /api/subscriptions. Creates new subscription. Required params:
 - title [REQUIRED, String]
 - keywords [NOT REQUIRED, array of strings]
 - cities [NOT REQUIRED, array of strings]

* GET /api/subscriptions/:subscriptionId - returns subscription by ID
* PUT /api/subscriptions/:subscriptionId - updates subscription. Allowed fields are the same as for **POST /api/subscriptions**
* DELETE  /api/subscriptions/:subscriptionId  - deletes subscription by ID

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
