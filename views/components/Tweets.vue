<template>
  <div>
    <div v-show="prefill.length > 0" class="left">
      <div class="unread-count" @click="addPrefill">{{ prefill.length }} new tweet{{ prefill.length > 1 ? 's' : '' }}</div>
      <p>&nbsp</p>
    </div>
    <ul class="feed">
      <li v-for="tweet in tweets">
        <div v-if="tweet.retweeted_status" class="retweeted">
          <i class="material-icons">repeat</i> <a :href="'https://twitter.com/'+tweet.user.username">{{ tweet.user.name }} ({{ tweet.user.username }})</a> &middot; <a :href="'https://twitter.com/'+tweet.user.username+'/status/'+tweet.id">{{ timeago(tweet.date) }}</a>
          <span v-if="tweet = tweet.retweeted_status"></span>
        </div>
        <div class="avatar"><a :href="'https://twitter.com/'+tweet.user.username"><img :src="tweet.user.avi"></a></div>
        <div class="tweet">
          <div class="date"><a :href="'https://twitter.com/'+tweet.user.username+'/status/'+tweet.id">{{ timeago(tweet.date) }}</a></div>
          <div class="name"><strong><a :href="'https://twitter.com/'+tweet.user.username">{{ tweet.user.name }}</a></strong> <span class="fade"><a :href="'https://twitter.com/'+tweet.user.username">@{{ tweet.user.username }}</a></span></div>
          <div class="body" v-html="format(tweet)"></div>
          <div class="actions">
            <span><i class="material-icons">reply</i></span>
            <span><i class="material-icons">repeat</i> {{ tweet.retweet_count ? tweet.retweet_count:'' }}</span>
            <span><i class="material-icons">favorite</i> {{ tweet.favorite_count ? tweet.favorite_count:'' }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['tweets', 'prefill'],
  data() {
    return {
    }
  },
  methods: {
    format: function (tweet) {
      let _tweet = JSON.parse(JSON.stringify(tweet));
      return twitter.autoLinkWithJSON(_tweet.text, _tweet.entities);
    },
    timeago: function (date) {
      return moment(date).fromNow();
    },
    addPrefill: function() {
      let _prefill = this.prefill.slice();
      this.prefill.splice(0, this.prefill.length);
      this.tweets.unshift(..._prefill);
    }
  }
}
</script>