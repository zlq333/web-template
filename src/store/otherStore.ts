import { defineStore } from 'pinia';

interface OtherState {
  name: string;
}

export const useOtherStore = defineStore('other', {
  state: () => {
    return { name: '' } as OtherState;
  },
  actions: {
    setName(data: string) {
      this.name = data;
    }
  }
});
