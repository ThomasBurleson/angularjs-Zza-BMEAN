#Zza Breeze-MEAN

The "Zza Breeze-MEAN" sample app is a single page application (SPA) built with BreezeJS, AngularJS, Node, and MongoDB 

![zza_home](https://cloud.githubusercontent.com/assets/210413/2725275/88509a0e-c5ab-11e3-84e6-bd12b7d91a7b.png)

> MEAN == Mongo, Express, AngularJS, and NodeJS.

This application is a fork of the excellent work by [Ward Bell](https://github.com/wardbell) and folks at IdeaBlade: [Breeze JS Samples](https://github.com/Breeze/breeze.js.samples) . That [*upstream* version](https://github.com/Breeze/breeze.js.samples/tree/master/node/zza-node-mongo) was created to demonstrate how AngularJS and BreezeJS can be used together to *easily* build complex LOB ( Line of Business ) applications. [BreezeJS](http://www.breezejs.com/) is an amazing JavaScript ORM library responsible the persistence and loading of complex object models.

![zza_about](https://cloud.githubusercontent.com/assets/210413/2725443/fe161cf4-c5ac-11e3-95b1-d9ad9692cc82.png)


Recent upgrades to the *upstream* source added an improved user experience, code-cleanup, and integrated the AngularJS UI-Router plugin: to provide robust nested-view management.  

But many *enterprise* conventions were <u>not</u> introduced in order to keep the *student* sample focused upon BreezeJS integration. This **downstream** fork enhances the code and architecture with features and patterns demanded by larger applications and team-based development. Those features and patterns manifest in other technology/platform solutions: Java, AS3, etc... so why it seems *obvious* to use the same within AngularJS SPA architectures:

1. Use of RequireJS to provide AMD and Class depedency management. <br>See [Dependency Injection Using RequireJS and AngularJS](http://solutionoptimist.com/2013/09/30/requirejs-angularjs-dependency-injection/) for detailed explanations.
2.  Organization of classes/packages by **feature**
3.  Use of UpperCamelCase naming conventions
4.  Clear separation of angular registrations from class registration
5.  Consistent use of enhanced $log for full-workflow logging
6.  Color-enhanced logging to easily highlight *route* logging (see above snapshot)
7.  Consistent use of <xxx>Services; with a hidden back-plane ORM layer.

> Considering the complexity of workflows and components within an AngularJS SPA, we cannot ignore the "unreasonable effectiveness of data"... Class and method logging delivers high quality data concerning the state and flow of an SPA. Do not underestimate the effectivenes and positive impact [on code quality] that be achieved with consistent **logging**.

The most important [and radically different change] is the use of AngularJS services to hide all ORM activity and usages.
Now the custom Breeze ORM setup and uses are hidden by services such as `ProductService`, `OrderService`, and `CustomerService`. And static lookups are performed by the global `SessionController`.

This revised architecture supports the expected MVVM AngularJS best-practice architectures and leverages the ORM layer as the **behind-the-services** layer for the application. This encapsulation significantly improves understanding of the application layers and centralizes all ORM activity/configuration into the ORM layer.

Shown below is a snapshot of the Zza application and its **console** view:

> ![zza with console logging](https://cloud.githubusercontent.com/assets/210413/2667789/18dbb27e-c0b2-11e3-92bb-054483fe1bf1.png)

## Live Demo

A live version has been deployed to Heroku:  [Zza Live](http://zza-breeze-mean.herokuapp.com/)!

This version will demonstrate the UI-Router and AngularJS transitions/animations within the screens, the live logging (Chrome Console), deep linking, routing/navigation, and more... 

> The Heroku deployment is published on a **free**, sleep-after-1-hour virtual image. This means that the **1st-time** loading of the application may require 3-5 seconds to startup. Subsequent database queries and loads should be much faster. So please wait during the initial startup...


## Prerequisites

* NPM
* Bower
* Node.js
* MongoDB

## Install and use

This repository represents a full MEAN stack; where both the client and the server and database must be configured. Libraries must be installed for the client and ser applications. Since the App-Server will handle RESTful web service requests and route appropriate commands to query the Mongo `zza` database, Mongo must be installed and the zza database configured properly.

### Extract the database

Extract the Zza application's MongoDB database in *zza-mongo-database.zip* to your MongoDB data directory. 

>The default location per MongoDB installation instructions should be `<projectDirectory>/database/zza/*`.

You only have to install this database once.

### Install dependent node modules

1. Open a command prompt window.

2. Navigate to the *Zza-Node-Mongo* directory; aka <projectDirectory>.


```text
cd <projectDirectory>/server
npm update
```

This should update/install all the NPM modules needed for the NodeJS, Breeze, Mongo stack.

```text
cd <projectDirectory>/client/build

rem Now update the NPM modules for Grunt
npm update

rem Now use Bower to install/update the AngularJS vendor libraries
bower update
```

These will install all the vendor libraries for the AngularJS client. And the NPM modules required for the optional Grunt build tasks.
You only have to install these modules and vendor libraries once.

### Start the servers
*Every time you run the application* you must first launch **two** servers: the MongoDB server and the Zza application's node/express Server. If you are using WebStorm IDEA, here are two snapshots to make these tasks trivial:

> Configure WebStorm External tool "Start MongoDb Server": <br/><br>![zza-webstorm-start_mongo](https://cloud.githubusercontent.com/assets/210413/2668242/4782bb4a-c0b7-11e3-982c-ddc688ee72a4.png)

> Configure **WebStorm"  custom Zza Web Server : <br/><br>
![zza-webstorm_webserver](https://cloud.githubusercontent.com/assets/210413/2668258/5c4861b0-c0b7-11e3-92bf-4c5ae7b0ebac.png)

### Run Zza

Open **localhost:8080** in a web browser to run the Zza application.

## Release 0.9.0

* UpperCamelCase class names
* Class packaging by features
* Use of RequireJS and define()
* Best-practice usages of angular.module()
* Use of HeadJS for non-blocking, script loading
* Separation of script loading from HTML markup
* Separation of Class registration from AngularJS instantiations.
* Use of AngularJS UI-Router plugin for easy-to-maintain, sophisticated UX and workflows
* Encapsulation of ORM classes... only utilized within the <xxx>Services and SessionController.
