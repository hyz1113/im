<template>
   <router-view/>
</template>


<script>
import mepal from "@/utils/mepal";
import {useRouter} from 'vue-router';
import { onMounted } from 'vue';


export default {
  setup() {
    const router = useRouter();
    onMounted(() => {
      mepal.onEvent('open', (url) => {
       router.replace(url)
      })
    })
  },
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
