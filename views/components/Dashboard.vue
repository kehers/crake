<template>
  <div id="app">
    <div class="lhs">
      <ul class="nav">
        <li><router-link to="/dashboard"><i class="material-icons">textsms</i></router-link></li>
        <!--li><router-link to="/fav"><i class="material-icons-">favorite</i></router-link></li-->
        <li><router-link to="/dashboard/edit"><i class="material-icons">format_color_text</i></router-link></li>
      </ul>
      <ul class="nav bottom">
        <li><router-link to="/dashboard/settings"><i class="material-icons">settings</i></router-link></li>
      </ul>
    </div>
    <div class="rhs">
      <router-view :tweets="tweets" :prefill="prefill"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prefill: [],
      tweets: []
    }
  },
  created: function () {
    // Load tweets from db
    db.tweets.find({}).sort({date: -1}).limit(100).exec((err, docs) => {
      this.tweets = docs;
    });
    // Start Twit
    db.config.findOne({id: 1}, (err, config) => {
      if (!config)
        return this.$router.push('/');

      let T = new Twit({
        consumer_key: config.key
        , consumer_secret: config.secret
        , access_token: config.token
        , access_token_secret: config.token_secret
      });
      let stream = T.stream('statuses/filter', {track: config.words});
      stream.on('message', function (msg) {
        console.log('message', msg);
      })
      /*stream.on('connect', function (msg) {
        console.log('connect', msg);
      })
      stream.on('connected', function (msg) {
        console.log('connected', msg);
      })
      stream.on('disconnect', function (msg) {
        console.log('disconnect', msg);
      })//*/
      stream.on('tweet', tweet => {
        tweet = this.filter(tweet);
        // Add to tweet
        if (this.tweets.length < 5)
          this.tweets.unshift(tweet);
        else
          this.prefill.unshift(tweet);
        // Add to db
        db.tweets.insert(tweet);
      });

      // On update phrases
      this.$on('words-updated', words => {
        // Stop
        stream.stop();
        // Restart
        stream = T.stream('statuses/filter', {track: words});
        stream.start();
      });
    });
  },
  methods: {
    filter: function (tweet) {
      let t = {};

      t.id = tweet.id_str;
      t.date = tweet.created_at;
      if (tweet.in_reply_to_screen_name)
        t.irt_user = tweet.in_reply_to_screen_name;
      if (tweet.in_reply_to_status_id_str)
        t.irt_id = tweet.in_reply_to_status_id_str;
      if (tweet.favorite_count)
        t.favorite_count = tweet.favorite_count;
      if (tweet.favorited)
        t.favorited = tweet.favorited;
      if (tweet.retweet_count)
        t.retweet_count = tweet.retweet_count;
      if (tweet.retweeted)
        t.retweeted = tweet.retweeted;
      t.text = tweet.text;
      t.entities = tweet.entities;
      if (tweet.extended_tweet) {
        t.text = tweet.extended_tweet.full_text;
        if (tweet.extended_tweet.entities)
          t.entities = tweet.extended_tweet.entities;
      }

      t.user = {
        id: tweet.user.id_str,
        name: tweet.user.name,
        avi: tweet.user.profile_image_url_https,
        protected: tweet.user.protected,
        verified: tweet.user.verified,
        username: tweet.user.screen_name,
        statuses: tweet.user.statuses_count,
        entities: tweet.user.entities,
        favourites: tweet.user.favourites_count,
        followers: tweet.user.followers_count,
        friends: tweet.user.friends_count,
      }
      if (tweet.user.location)
        t.user.location = tweet.user.location;
      if (tweet.user.url)
        t.user.url = tweet.user.url;

      if (tweet.retweeted_status)
        t.retweeted_status = this.filter(tweet.retweeted_status);

      //if (tweet.retweeted_status && tweet.retweeted_status.extended_tweet)
        //console.log(tweet);

      if (tweet.quoted_status)
        t.quoted_status = this.filter(tweet.quoted_status);

        //console.log(tweet);
      // todo:
      // Expand entities and get oembed
      // If image, resolve and get <img>

      return t;
    }
  }
}
</script>