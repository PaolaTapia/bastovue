<template>
  <div class="q-pa-md">
    <q-table title="Animals" :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
      :loading="loading" :filter="filter" @request="onRequest" binary-state-sort>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>
  </div>
</template>

<script>

import { ref, onMounted } from 'vue'
import { useAnimalStore } from "../stores/animals/animals-store";

const AnimalStore = useAnimalStore();
const columns = [
  {
    name: 'idSenasa',
    required: true,
    label: 'Id Senasa',
    align: 'left',
    field: row => row.idSenasa,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'typeAnimal', align: 'center', label: 'Tipo Animal', field: 'typeAnimal', sortable: true },
  { name: 'weight', label: 'Peso', field: 'weight' },
  { name: 'paddock', label: 'Potrero', field: 'paddock' },
  { name: 'numberDevice', label: 'Nro. Dispositivo', field: 'numberDevice' },
  { name: 'typeDevice', label: 'Tipo Dispositivo', field: 'typeDevice', sortable: true },
];
const originalRows = [];

export default {

  name: 'Animal',

  setup() {

    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 3,
      rowsNumber: 5
    })


    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    function fetchFromServer(startRow, count, filter, sortBy, descending) {

      const data = filter
        ? originalRows.filter(row => row.typeAnimal.includes(filter))
        : originalRows.splice(0, originalRows.length) //   no originalRows.slice(), copia originalRows

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
            ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
            : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          )
          : (descending
            ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
            : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          )
        data.sort(sortFn)
      }
      return data.slice(startRow, startRow + count)
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'
    function getRowsNumberCount(filter) {
      if (!filter) {
        return originalRows.length
      }
      let count = 0
      originalRows.forEach(treat => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count
    }

    async function onRequest(props) {

      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      loading.value = true

      await AnimalStore.getAnimals()
        .then(res => {
          res.animalsStore.map((item) => {
            !originalRows.includes(item) && originalRows.push(item)
          })
        }
        )
        .catch((err) => { console.log(err) });


      // update rowsCount with appropriate value
      pagination.value.rowsNumber = getRowsNumberCount(filter)

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage

      // fetch data from "server"
      const returnedData = fetchFromServer(startRow, fetchCount, filter, sortBy, descending)
      // clear out existing data and add new
      rows.value.splice(0, rows.value.length, ...returnedData)
      rows.value.slice(returnedData)
      // rows.value.push(returnedData)
      console.log('rows', rows)


      // don't forget to update local pagination object
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.sortBy = sortBy
      pagination.value.descending = descending

      // ...and turn of loading indicator
      loading.value = false

    }

    onMounted(() => {
      // get initial data from server (1st page)
      onRequest({
        pagination: pagination.value,
        filter: undefined
      })

    })

    return {
      filter,
      loading,
      pagination,
      columns,
      rows,

      onRequest

    }

  }

}
</script>
