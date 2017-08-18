<script>
  export default {
    name: 'SimpleSelect',
    data () {
      return {
        dropdownOpen: false,
        val: [],
        option: []
      }
    },
    props: {
      items: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    methods: {
      toggleDropdown () {
        this.dropdownOpen = !this.dropdownOpen
      },
      updateValue (item) {
        this.val = item.val
        this.option = item.option
        this.toggleDropdown()
        this.$emit('selectVal', this.val)
      }
    }
  }
</script>

<template>
  <div>
    <input @click="toggleDropdown" v-model="option" placeholder="Select an option" readonly="readonly">
    <ul tabindex="-1" class="dropdown" v-if="dropdownOpen">
      <li v-for="item in items" @click="updateValue(item)">{{ item.option }}</li>
    </ul>
  </div>
</template>

<style scoped>
  
</style>
