<template>
  <div id="app">
    <in-edit v-model='text' ref="edit" :uploadServerImgUrl="uploadServerImgUrl"></in-edit>
    <span @click="showEdit">展示</span>
  </div>
</template>

<script>
  import inEdit from './lib/edit.vue'
export default {
  name: 'app',
  data () {
    return {
      uploadServerImgUrl:'',
      text:'sss'
    }
  },
  methods:{
    showEdit(){
      console.log(this.$refs.edit.$refs.editContent.innerHTML)
    }
  },
  components:{
    inEdit
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  height: 500px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
