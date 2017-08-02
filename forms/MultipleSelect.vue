<script>
  export default {
    name: 'multipleSelect',
    data () {
      return {
        isSelected: false,
        dropdownOpen: false,
        val: [],
        items: [
          { val: 1, text: 'option 1', selected: false },
          { val: 2, text: 'option 2', selected: false },
          { val: 3, text: 'option 3', selected: false },
          { val: 4, text: 'option 4', selected: false },
          { val: 5, text: 'option 5', selected: false },
          { val: 6, text: 'option 6', selected: false },
          { val: 7, text: 'option 7', selected: false },
          { val: 8, text: 'option 8', selected: false }
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
    },
    methods: {
      openDropdown () {
        this.dropdownOpen = true
      },
      closeDropdown () {
        this.dropdownOpen = false
      },
      setVal (val) {
        this.val.push(val)
        this.closeDropdown()
      },
      setItemClass (index) {
        if (this.items[index].selected) {
          this.items[index].selected = false
        } else {
          this.items[index].selected = true
        }
      }
    }
  }
</script>

<template>
  <div>
    <input class="form-select-simple" @click="openDropdown" cols="30" rows="10" v-model="val" placeholder="Select options">
    <ul tabindex="-1" @blur="closeDropdown" class="form-select-dropdown" v-if="dropdownOpen">
      <li :class="{ 'selected': item.selected }" v-for="(item, index) in items" @click="setVal(item.val), setItemClass(index)">{{ item.text }}</li>
    </ul>
  </div>
</template>

<style src="../../assets/themes/default/form.css"></style>
