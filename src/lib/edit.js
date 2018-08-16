import VueEditPlugin from './edit.vue'
const editPlugin = {
  install: function(Vue) {
    Vue.component(VueEditPlugin.name, VueEditPlugin)
  }
}
// global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(editPlugin)
}
// 导出模块
export default editPlugin
