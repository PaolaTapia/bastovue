import { defineStore } from "pinia";
import { api } from "src/boot/axios";
// import router from "src/router";

export interface IAnimal {
  idSenasa: string;
  typeAnimal: string;
  weight: number;
  paddock: string;
  typeDevice: string;
  numberDevice: string;
  is_active?: boolean;
}

export const useAnimalStore = defineStore("animal", {
  state: () => ({
    animalData: [
      {
        idSenasa: "",
        typeAnimal: "",
        weight: 0,
        paddock: "",
        typeDevice: "",
        numberDevice: "",
        is_active: true,
      },
    ],
    loading: false,
  }),
  getters: {
    animals: (state) => state,
  },
  actions: {
    //get
    async getAnimals(): Promise<any> {
      let data = {};
      this.loading = true;
      await api
        .get(`/animals`)
        .then((res) => {
          // update pinia state
          this.animals.animalData = res.data.animals;
          data = {
            animalsStore: res.data.animals,
          };
        })
        .catch((error) => error.response.data);
      this.loading = false;
      return data;
    },
  },
});
