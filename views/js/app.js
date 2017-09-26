const {remote} = require('electron')
      , Datastore = require('nedb')
      , Twit = require('twit')
      , path = require('path')
      , twitter = require('twitter-text')
      , moment = require('moment')
      , {oauth, twitter: tO} = require('oauth-electron-twitter')
      ;

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s:  "",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "1mo",
        MM: "%dmo",
        y:  "1y",
        yy: "%dy"
    }
});

let db = {};
    db.config = new Datastore({ filename: path.join(remote.getGlobal('sharedObject').dataPath, 'crake-config.db'), autoload: true });
    db.tweets = new Datastore({ filename: path.join(remote.getGlobal('sharedObject').dataPath, 'crake-tweets.db'), autoload: true });
