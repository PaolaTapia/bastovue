
<template>
  <q-page padding>

    <q-form @submit="onSubmit" @reset="onReset" class="row q-col-gutter-md">

      <q-input class="col-5" filled v-model="form.idSenasa" label="Id Senasa *" lazy-rules :rules="[val => val && val.length > 0 || 'Obligatorio',
      val => val.length > 15 && val.length < 17 || '16 caracteres']" />

      <q-select class="col-5" filled v-model="form.typeAnimal" :options="typeAnimalOptions" label="Tipo de Animal *"
        lazy-rules :rules="[val => val && val.length > 0 || 'Obligatorio']" />

      <q-input class="col-5" filled type="number" v-model="form.weight" label="Peso *" lazy-rules :rules="[
        val => val !== null && val !== '' || 'Obligatorio',
        val => val > 50 && val < 1000 || 'Peso entre 50 y 1000Kg'
      ]" />

      <q-input class="col-5" filled v-model="form.paddock" label="Nombre del Potrero *" hint="Ej. Potrero Este"
        lazy-rules :rules="[val => val && val.length > 0 || 'Obligatorio']" />

      <q-select class="col-5" filled v-model="form.typeDevice" :options="typeDeviceOptions"
        label="Tipo de dispositivo *" lazy-rules :rules="[val => val && val.length > 0 || 'Obligatorio']" />

      <q-input class="col-5" filled type="text" v-model="form.numberDevice" label="Nro. de dispositivo *" lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Obligatorio',
          val => val.length > 7 && val.length < 9 || '8 caracteres'
        ]" />


      <div>
        <q-btn class="col-5" label="Guardar" type="submit" color="primary" />
        <q-btn class="col-5 q-ml-sm" label="Cancelar" type="reset" color="primary" flat />
      </div>

    </q-form>

  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue';
import { useAnimalStore } from "../stores/animals/animals-store";
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from "vue-router";
import { json } from 'body-parser';



export default defineComponent({
  name: "FormAnimal",
  setup() {
    const AnimalStore = useAnimalStore();
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();

    const form = ref(
      {
        idSenasa: ref(''),
        typeAnimal: ref(''),
        weight: ref(100),
        paddock: ref(''),
        typeDevice: ref(''),
        numberDevice: ref(''),
        is_active: ref(true)
      }
    );

    onMounted(async () => {
      if (route.params._id) {
        await getAnimal(route.params._id);
      }
    })

    const getAnimal = async (id) => {
      try {
        const res = await AnimalStore.getByIdAnimal(id);
        form.value.idSenasa = res.animalsStore.idSenasa;
        form.value.typeAnimal = res.animalsStore.typeAnimal,
          form.value.weight = res.animalsStore.weight,
          form.value.paddock = res.animalsStore.paddock,
          form.value.typeDevice = res.animalsStore.typeDevice,
          form.value.numberDevice = res.animalsStore.numberDevice,
          form.value.is_active = res.animalsStore.is_active
        // console.log('form.value', form.value)
      } catch (error) {
        console.log(error)
      }
    }
    async function onSubmit() {
      try {
        console.log('route.params._id', route.params._id)
        console.log('form.value', JSON.stringify(form.value))
        if (route.params._id) {
          await AnimalStore.updateAnimal(route.params._id, form.value);
        }
        else {
          await AnimalStore.createAnimal(form.value);
        }
        try {
          async () => { await AnimalStore.getAnimals(); }
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Guardado'
          });
        } catch (error) {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: error
          });
        }

      } catch (error) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Error al guardar'
        });
      }
      router.push('/');
    };

    return {

      model: ref(null),
      typeAnimalOptions: [
        'Vaquillona', 'Toro', 'Novillo'
      ],
      typeDeviceOptions: [
        'COLLAR', 'CARAVANA',
      ],
      form,
      onSubmit,


      onReset() {
        form.value = form
        router.push('/');
      }
    }

  },
})
</script>



