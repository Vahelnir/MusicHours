import { reactive, toRefs } from "vue";

const state = reactive({
  available_langs: ["fr", "en"],
  current_lang: "fr",
});

export function useLangs() {
  return { ...toRefs(state) };
}
