<script>
  export default {
    name: 'horizontlNav',
    components: {
      Icon
    },
    props: {
      items: {
        type: Array,
        default: () => {
          return []
        }
      },
      multiLevel: {
        type: Boolean,
        default: false
      },
      subItems: {
        type: Array,
        default: () => {
          return []
        }
      }
    }
  }
</script>

<template>
  <ul>
    <li v-for="item in this.items"><a href="item.link">{{ item.text }}</a>
      <ul v-if="multiLevel">
        <li v-for="subItem in this.subItems"><a href="subItem.link">{{ subItem.item }}</a></li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>

</style>