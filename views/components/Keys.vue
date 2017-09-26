<template>
  <div id="app">
    <section class="m-t">
      <div class="content">
        <form method="post" @submit.prevent="submit">
          <input type="text" name="key" placeholder="Twitter API Key" v-model="key" class="full-width" required>
          <input type="text" name="secret" placeholder="Twitter API Secret" v-model="secret" class="full-width" required>
          <p class="right"><button type="submit">Authenticate</button></p>
          <p class="right cf fade">(This will open Twitter's authentication page in a new window)</small></p>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data: {
    key: '',
    secret: ''
  },
  methods: {
    submit: function () {
      let wn = new remote.BrowserWindow({webPreferences: {nodeIntegration: false}, width: 800, height: 600})
      let info = new tO(this.key, this.secret);
      let auth = new oauth();
      auth.login(info, wn).then((result) => {
        wn.close();
        db.config.insert({
          id: 1,
          key: this.key,
          secret: this.secret,
          token: result.oauth_access_token,
          token_secret: result.oauth_access_token_secret,
          date: new Date()
        }, (err, doc) => {
          if (!err)
            this.$router.push('/words');
        });
      }).catch((error) => {
        console.log(error);
        // todo
        wn.close();
      });
      //db.config.remove({}, {multi: true});
    }
  }
}
</script>