<template>
  <img class="message-image" :src="data.url">
</template>

<script lang="ts">
export default {
    name: 'MessageFace',
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>
<style lang="scss" scoped>
.text-img {
  width: 20px;
  height: 20px;
}
</style>
