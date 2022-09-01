import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ObjectId } from "mongoose";

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
        weight: 100,
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
    //getById
    async getByIdAnimal(payload: ObjectId): Promise<any> {
      let data = {};
      this.loading = true;
      await api
        .get(`/animals/` + payload)
        .then((res) => {
          // update pinia state
          this.animals.animalData = res.data;
          data = {
            animalsStore: res.data,
          };
        })
        .catch((error) => error.response.data);
      this.loading = false;
      return data;
    },
    //post
    async createAnimal(payload: any): Promise<any> {
      let data = {};
      this.loading = true;
      await api
        .post(`/animals`, payload)
        .then((res) => {
          this.animals.animalData = res.data;
          data = JSON.stringify(this.animals.animalData);
        })
        .catch((error) => error.response.data);
      this.loading = false;
      return data;
    },
    //update
    async updateAnimal(id: ObjectId, payload: any): Promise<any> {
      let data = {};
      this.loading = true;
      await api
        .patch(`/animals/` + id, payload)
        .then((res) => {
          this.animals.animalData = res.data;
          data = JSON.stringify(this.animals.animalData);
        })
        .catch((error) => error.response.data);
      this.loading = false;
      return data;
    },
    //delete
    async removeAnimal(payload: any): Promise<any> {
      let data = {};
      this.loading = true;
      await api
        .delete(`/animals/` + payload)
        .then((res) => {
          this.animals.animalData = res.data;
          data = JSON.stringify(this.animals.animalData);
        })
        .catch((error) => error.response.data);
      this.loading = false;
      return data;
    },
    //deleteMany
    async removeManyAnimal(payload: any): Promise<any> {
      let data = {};
      this.loading = true;
      await api
        .delete(`/animals`, payload)
        .then((res) => {
          this.animals.animalData = res.data;
          data = JSON.stringify(this.animals.animalData);
        })
        .catch((error) => error.response.data);
      this.loading = false;
      return data;
    },
  },
});
