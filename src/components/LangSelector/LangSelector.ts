import { defineComponent, ref } from "vue";
import { useLangs } from "/@/composables/useLangs";

export default defineComponent({
  setup() {
    const { available_langs } = useLangs();
    const selectedLang = ref("");
    return {
      available_langs,
      selectedLang,
      selectLang(lang: string) {
        selectedLang.value = lang;
      },
    };
  },
});
