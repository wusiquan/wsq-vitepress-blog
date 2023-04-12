export default {
  title: 'wsq vitepress',
  vite: {
    optimizeDeps: {
      // 好像是传给vite server的避免cacheDir发挥作用
      force: false
    }
  }
}
