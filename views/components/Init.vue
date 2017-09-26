<template>
  <div id="app">
    <section class="m-t">
      <div class="content">
        <p>To get started, you need to setup an "app" on Twitter.</p>
        <ul class="list">
          <li>Visit <a href="https://apps.twitter.com">apps.twitter.com</a></li>
          <li>Click the <strong>Create New Apps</strong> button</li>
          <li>Give your application a name and a short description. Add your website as well and use any valid URL as your callback URL.</li>
          <li>Read and Accept the developer terms and submit</li>
          <li>On the application page, scroll down to <strong>Application Settings</strong> and note your <strong>Consumer Key (API Key)</strong> and <strong>Consumer Secret (API Secret)</strong></li>
        </ul>
        <div class="wrap-auto" style="width:90%;margin-top:50px">
          <router-link to="/keys" class="button default full-width">Done. I have my API keys</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  beforeCreate: function () {
    // Config exist?
    //db.config.remove({}, {multi: true});
    db.tweets.remove({}, {multi: true});
    db.config.findOne({id: 1}, (err, doc) => {
      if (doc) {
        if (doc.words)
          this.$router.push('/dashboard');
        else
          this.$router.push('/words');
      }
    });
  }
}
</script>