<template>
  <div class="q-pa-md">
    <q-table :rows="rows" :columns="columns" row-key="idSenasa" v-model:selected="selected"
      v-model:pagination="pagination" :visible-columns="visibleColumns" :loading="loading" :filter="filter"
      @request="onRequest" binary-state-sort>
      <!-- selection="multiple"  -->

      <template v-slot:top-left>
        <h2>
          Animals
        </h2>
        <q-space />
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn color="primary" class="q-mx-md" label="New Animal" :to="{ name: 'FormAnimal' }" />
        <!-- <q-btn color="negative" label="Delete Selected" @click="onDeleteMany(selected)" /> -->
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="mode_edit" color="secondary" @click="onEdit(props.row._id)" dense class="q-mx-md">
          </q-btn>
          <q-btn icon="delete" color="negative" @click="onDelete(props.row._id)" dense></q-btn>
        </q-td>

      </template>
    </q-table>

    <div class="q-mt-md">
      Selected: {{ selected }}
    </div>

  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
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
  { name: 'actions', label: 'Actions' }
];
const originalRows = [];

export default {
  name: "Animal",
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let selected = ref([]);
    let rows = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 6,
      rowsNumber: 5
    });
    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    function fetchFromServer(startRow, count, filter, sortBy, descending) {
      const data = filter
        ? originalRows.filter(row => row.typeAnimal.toUpperCase().includes(filter.toUpperCase()))
        : originalRows.splice(0, originalRows.length); //   no originalRows.slice(), copia originalRows
      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === "desc"
          ? (descending
            ? (a, b) => (a.typeAnimal > b.typeAnimal ? -1 : a.typeAnimal < b.typeAnimal ? 1 : 0)
            : (a, b) => (a.typeAnimal > b.typeAnimal ? 1 : a.typeAnimal < b.typeAnimal ? -1 : 0))
          : (descending
            ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
            : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy])));
        data.sort(sortFn);
      }
      return data.slice(startRow, startRow + count);
    }
    // emulate 'SELECT count(*) FROM ...WHERE...'
    function getRowsNumberCount(filter) {
      if (!filter) {
        return originalRows.length;
      }
      let count = 0;
      originalRows.forEach(treat => {
        if (treat.typeAnimal.toUpperCase().includes(filter.toUpperCase())) {
          ++count;
        }
      });
      return count;
    }

    async function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;
      loading.value = true;
      await AnimalStore.getAnimals()
        .then(res => {
          res.animalsStore.map((item) => {
            !originalRows.includes(item) && originalRows.push(item);
          });
        })
        .catch((err) => { console.log(err); });
      // update rowsCount with appropriate value
      pagination.value.rowsNumber = getRowsNumberCount(filter);
      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;
      // fetch data from "server"
      const returnedData = fetchFromServer(startRow, fetchCount, filter, sortBy, descending);
      // clear out existing data and add new
      rows.value.splice(0, rows.value.length, ...returnedData);
      // console.log("rows filter", rows);
      // don't forget to update local pagination object
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
      // ...and turn of loading indicator
      loading.value = false;
    }
    onMounted(() => {
      // get initial data from server (1st page)
      onRequest({
        pagination: pagination.value,
        filter: undefined
      });
    })

    const onEdit = (_id) => {
      router.push({ name: 'FormAnimal', params: { _id } });
    }

    const onDeleteMany = (selected) => {
      let idsSeleted = ref([]);
      selected.map(
        (item) => {
          idsSeleted.value.push(item._id)
        }
      )
      console.log('idsSeleted', JSON.stringify(idsSeleted))

    }

    const onDelete = async (props) => {
      try {
        $q.dialog({
          title: 'Borrar',
          message: '¿Seguro deseas borrar?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await AnimalStore.removeAnimal(props)
            .then(async (res) => {
              $q.notify({
                color: 'Primary',
                textColor: 'white',
                icon: 'check',
                message: 'Borrado'
              });
              onRequest({
                pagination: pagination.value,
                filter: undefined
              });
            })
            .catch((err) => { console.log(err); });
        })
      } catch (error) {
        $q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'times',
          message: 'Error al borrar'
        });
      }
    }

    return {
      onDeleteMany,
      onEdit,
      onDelete,
      selected,
      filter,
      loading,
      pagination,
      columns,
      rows,
      onRequest,
    };
  },
}
</script>
