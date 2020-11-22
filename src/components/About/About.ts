import { defineComponent, ref } from "vue";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useNow } from "/@/composables/useNow";
import { useTimeClass } from "/@/composables/useTimeClass";

function useModal() {
  const showModal = ref(false);
  return {
    showModal,
    open_modal() {
      showModal.value = true;
    },
    close_modal() {
      showModal.value = false;
    },
  };
}

export default defineComponent({
  setup() {
    const { now } = useNow();
    const { suffixStyle } = useTimeClass(now);
    const { showModal, open_modal, close_modal } = useModal();
    return {
      suffixStyle,
      showModal,
      open_modal,
      close_modal,
      faInfoCircle,
    };
  },
});
