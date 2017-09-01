<script>
  export default {
    name: 'horizontalNav',
    components: {
      Icon
    },
    props: {
      items: {
        type: Array,
        default: () => {
          return []
        }
      }
    }
  }
</script>

<template>
  <ul class="horizontal-nav">
    <li class="horizontal-nav-item" v-for="item in this.items"><a :href="item.link" :class="{ 'sub-item': item.subItems }">{{ item.name }}</a>
      <ul class="horizontal-nav-dropdown" v-if="item.subItems">
        <li class="horizontal-nav-dropdown-item" v-for="subItem in item.subItems"><a href="subItem.link">{{ subItem.name }}</a></li>
      </ul>
    </li>
  </ul>
</template>

<style scoped></style>
