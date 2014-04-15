#Zza Breeze-MEAN

The "Zza Breeze-MEAN" sample app is a single page application (SPA) built with BreezeJS, AngularJS, Node, and MongoDB 
> MEAN == Mongo, Express, AngularJS, and NodeJS.

This application is a fork of the excellent work by [Ward Bell](https://github.com/wardbell) and folks at IdeaBlade: [Breeze JS Samples](https://github.com/Breeze/breeze.js.samples) . That [*upstream* version](https://github.com/Breeze/breeze.js.samples/tree/master/node/zza-node-mongo) was created to demonstrate how AngularJS and BreezeJS can be used together to *easily* build complex LOB ( Line of Business ) applications. [BreezeJS](http://www.breezejs.com/) is an amazing JavaScript ORM library responsible the persistence and loading of complex object models.

Recent upgrades to the *upstream* source added UI-Router to provide robust nested-view management and improved UX.  But many *enterprise* conventions were <u>not</u> introduced in order to keep the *student* sample focused upon BreezeJS integration. This *downstream* fork enhances the code and architecture with features demanded by larger applications and team-based development. These same features are ubiquitous in other technology/platform solutions: Java, AS3, etc... so why it seems obvious to use the same within AngularJS SPA architectures:

1. Use of RequireJS to provide AMD and Class depedency management. <br>See [Dependency Injection Using RequireJS and AngularJS](http://solutionoptimist.com/2013/09/30/requirejs-angularjs-dependency-injection/) for detailed explanations.
2.  Organization of classes/packages by **feature**
3.  Use of UpperCamelCase naming conventions
4.  Clear separation of angular registrations from class registration
5.  Consistent use of enhanced $log for full-workflow logging
6.  Color-enhanced logging to easily highlight *route* logging (see above snapshot)

> Considering the complexity of workflows and components within an AngularJS SPA, we cannot ignore the "unreasonable effectiveness of data"... Class and method logging delivers high quality data concerning the state and flow of an SPA. Do not underestimate the effectivenes and positive impact [on code quality] that be achieved with consistent **logging**.

Shown below is a snapshot of the Zza application and its **console** view:

> ![zza with console logging](https://cloud.githubusercontent.com/assets/210413/2667789/18dbb27e-c0b2-11e3-92bb-054483fe1bf1.png)


## Prerequisites

* NPM
* Bower
* Node.js
* MongoDB

## Install and use

### Extract the database

Extract the Zza application's MongoDB database in *zza-mongo-database.zip* to your MongoDB data directory.

>The default location per MongoDB installation instructions is *C:\data*. Your location may be different.

You only have to install this database once.

### Install dependent node modules

1. Open a command prompt window.

2. Navigate to the *Zza-Node-Mongo* directory.

3. Use npm to install the following three modules:
<pre style="margin-left: 2em">
npm install mongodb
npm install express
npm install breeze-mongodb
</pre>

Confirm that all of them ran without error (warnings are ok). You can close this window when you're done.

You only install these modules once.

### Start the servers
*Every time you run the application* you must first launch **two** servers: the MongoDB server and the Zza application's node/express server. If you are using WebStorm IDEA, here are two snapshots to make these tasks trivial:

> Configure WebStorm External tool "Start MongoDb Server": <br/><br>![zza-webstorm-start_mongo](https://cloud.githubusercontent.com/assets/210413/2668242/4782bb4a-c0b7-11e3-982c-ddc688ee72a4.png)

> Configure **WebStorm"  custom Zza Web Server : <br/><br>
![zza-webstorm_webserver](https://cloud.githubusercontent.com/assets/210413/2668258/5c4861b0-c0b7-11e3-92bf-4c5ae7b0ebac.png)

### Run Zza

Open **localhost:8080** in a web browser to run the Zza application.

## Release 0.8.0

* UpperCamelCase class names
* Class packaging by features
* Use of RequireJS and define()
* Best-practice usages of angular.module()
* Use of HeadJS for non-blocking, script loading
* Separation of script loading from HTML markup
* Separation of Class registration from AngularJS instantiations.
* Use of AngularJS UI-Router plugin for easy-to-maintain, sophisticated UX and workflows
