<script>
  export default {
    name: 'MultipleSelect',
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
        if (this.option.indexOf(item.option) >= 0) {
          this.option.splice(this.option.indexOf(item.option), 1)
        } else {
          this.val.push(item.val)
          this.option.push(item.option)
        }
        this.toggleDropdown()
        this.$emit('selectVal', this.val)
      }
    }
  }
</script>

<template>
  <div>
    <input @click="toggleDropdown" v-model="option" placeholder="Select options" readonly="readonly">
    <ul tabindex="-1" class="dropdown" v-if="dropdownOpen">
      <li v-for="item in items" @click="updateValue(item)">{{ item.option }}</li>
    </ul>
  </div>
</template>

<style scoped>
  
</style>
