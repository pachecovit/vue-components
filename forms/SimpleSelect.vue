<script>
  export default {
    name: 'simpleSelect',
    data () {
      return {
        dropdownOpen: false,
        val: '',
        items: [
          { val: 1, text: 'Option 1' },
          { val: 2, text: 'Option 2' }
        ]
      }
    },
    props: {
      validation: {
        type: Object,
        default: function () {
          return { $error: false, $touch: function () {} }
        }
      }
    }
    methods: {
      openDropdown () {
        this.dropdownOpen = true
      },
      closeDropdown () {
        this.dropdownOpen = false
      },
      setVal (val) {
        this.val = val
        this.closeDropdown()
      }
    }
  }
</script>

<template>
  <div>
    <input @click="openDropdown" cols="30" rows="10" v-model="val" placeholder="Select an option">
    <ul tabindex="-1" @blur="closeDropdown" class="dropdown" v-if="dropdownOpen">
        <li v-for="item in items" @click="setVal(item.val)">{{ item.text }}</li>
    </ul>
  </div>
</template>

<style scoped>
  
</style>
