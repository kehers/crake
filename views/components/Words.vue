<template>
  <div id="app">
    <section class="m-t">
      <div class="content">
        <form method="post" @submit.prevent="submit">
          <p>Enter words or phrases you want to track on Twitter and press enter:</p>
          <input type="text" name="words" class="full-width" required>
          <div class="align-right"><button method="post" :disabled="disabled">Start Tracking</button></div>
        </form>

        <h3 class="m-t-20">Tips</h3>
        <ul class="list">
          <li>The case of the words/phrases does not matter</li>
          <li><code>crake twitter</code> will match tweets containing <code>crake</code> <strong>AND</strong> <code>twitter</code>. <code>crake,twitter</code> will match tweet containing <code>crake</code> <strong>OR</strong> <code>twitter</code></li>
          <li>Words/phrases shouldn't be more than 60 characters each</li>
          <li><a href="https://dev.twitter.com/streaming/overview/request-parameters#track">More</a></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      words: [],
      disabled: true
    }
  },
  methods: {
    submit: function () {
      db.config.update({id: 1}, {
        $set: {words: this.words}
      }, {}, err => {
        if (!err)
          this.$router.push('/dashboard');
      });
    }
  },
  mounted: function () {
    let tagify = new this.$Tagify(document.querySelector('input[name=words]'));
    tagify.on('add', e => {
      this.words.push(e.detail.value);
      this.disabled = false;
      document.querySelector('input[name=words]').focus();
    });
    tagify.on('remove', e => {
      this.words.splice(this.words.indexOf(e.detail.value), 1);
      if (this.words.length == 0)
        this.disabled = true;
    });
  }
}
</script>