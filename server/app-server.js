/**
 * Express application server handling all client requests
 */
var express        = require('express')
    , bodyParser   = require('body-parser')
    , compress     = require('compression')
    , favicon      = require('static-favicon')
    , fileServer   = require('serve-static')
    , logger       = require('morgan')

    , breezeRoutes = require('./zza/breeze-routes')
    , errorHandler = require('./zza/errorHandler')

    , port         = process.env["PORT"] || 8080
    , app          = express();

    app.use( favicon()                  );
    app.use( logger('dev')              );
    app.use( compress()                 );
    app.use( bodyParser.json()          );
    app.use( bodyParser.urlencoded()    );

    // Configure both breeze-specific routes for REST API
    breezeRoutes.configure( app );

    // Support static file content
    app.use( fileServer( process.cwd() ));

    app.use( errorHandler );

    // Start listening for HTTP requests
    app.listen( port );

    // Configuration logging
    console.log('env = '+ app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd() );
    console.log('\nListening on port '+ port);


module.exports = app;

