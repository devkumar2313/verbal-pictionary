import { defineStore } from "pinia";

export const useWordsStore = defineStore("words", () => {
  const categoryStore = useCategoryStore();
  const lastUsedCategories = ref<string>(
    JSON.stringify(categoryStore.enabledCategories),
  );

  const words = ref<string[]>(useWords(categoryStore.enabledCategories));

  watch(categoryStore.enabledCategories, (filters) => {
    // Don't update words if the filters haven't changed
    if (JSON.stringify(filters) === lastUsedCategories.value) {
      return;
    }

    lastUsedCategories.value = JSON.stringify(filters);
    words.value = useWords(filters);
  });

  function getNextWords(amount: number = 5) {
    if (amount > words.value.length) {
      throw new Error("Not enough words left");
    }

    const nextWords = words.value.slice(0, amount);
    words.value = words.value.slice(amount);
    return nextWords;
  }

  return {
    words,
    getNextWords,
  };
});
