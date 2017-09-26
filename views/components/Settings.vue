<template>
  <div>
    <div class="content">
      <form method="post" @submit.prevent="submit">
        <input type="text" name="key" placeholder="Twitter API Key" v-model="key" class="full-width" required>
        <input type="text" name="secret" placeholder="Twitter API Secret" v-model="secret" class="full-width" required>
        <p class="right"><button type="submit">Authenticate</button></p>
      </form>
    </div>
    <div class="content">
      <p>License yarns</p>
      <form method="post" @submit.prevent="submit">
        <input type="text" name="key" placeholder="Licence Key" v-model="key" class="full-width" required>
        <p class="right"><button type="submit">Upgrade</button></p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
}
</script>