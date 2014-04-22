/*
 * database service with an 'open' method that
 * creates a new MongoDb instance for the zza database
 * and opens it with optional post-open handler
 */
module.exports = {
    open: open
};

var mongodb = require('mongodb');

function open(openHandler ) {

    var dbName = 'app24422796'
      , host = 'oceanic.mongohq.com'
      , port = 10047;

    var dbServer = new mongodb.Server(host, port, { auto_reconnect: true});

    var db = new mongodb.Db(dbName, dbServer, {
        strict:true,
        w: 1,
        safe: true
    });

    var noop = function() { ; };

    db.open(function( error ){
        if ( !error )
        {
            db.authenticate("demo","breeze",noop);
            if ( openHandler != null) openHandler();
        }
    });

    return db;
}
