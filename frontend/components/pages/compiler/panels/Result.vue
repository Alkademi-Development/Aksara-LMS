<template>
    <div class="flex-grow-1 overflow-auto px-3 py-2" style="max-height: 320px;">
        <BTable striped hover :items="items" />
    </div>
</template>

<script setup>
import { BTable } from 'bootstrap-vue-next'
const items = [
  {age: 40, first_name: 'Dickerson', last_name: 'Macdonald'},
  {age: 21, first_name: 'Larsen', last_name: 'Shaw'},
  {age: 89, first_name: 'Geneva', last_name: 'Wilson'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jami', last_name: 'Carney'},
  {age: 38, first_name: 'Jane', last_name: 'Jane'},
]
</script>

<style lang="scss" scoped>
table {
  background-color: transparent;
  color: inherit;

  thead {
    background-color: transparent;
    color: inherit;
    border-bottom: 1px solid var(--black3);
  }

  tbody {
    tr {
      border-color: var(--black3);
    }
  }

  td, th {
    vertical-align: middle;
  }

}
</style>