import { computed, defineComponent, Ref, ref, watch } from "vue";
import LangSelector from "/@/components/LangSelector/LangSelector.vue";
import About from "/@/components/About/About.vue";
import { useNow } from "/@/composables/useNow";
import { useTimeClass } from "/@/composables/useTimeClass";
import { useWeather } from "/@/composables/useWeather";

function twoDigits(num: number) {
  return ("0" + num).slice(-2);
}

function useTimerFromDate(date: Ref<Date>) {
  return {
    timer: computed(() => {
      const dateVal = date.value;
      const hours = twoDigits(dateVal.getHours());
      const minutes = twoDigits(dateVal.getMinutes());
      const seconds = twoDigits(dateVal.getSeconds());
      return `${hours}:${minutes}:${seconds}`;
    }),
  };
}

function useAstre(now: Ref<Date>) {
  const position = ref(`position${now.value.getHours()}`);
  watch(now, (current, old) => {
    const previousHour = old.getHours();
    const currentHour = current.getHours();

    if (currentHour === previousHour) return;

    if ([6, 19].includes(currentHour)) {
      position.value = "position222";
      setTimeout(() => {
        position.value = "position111";
      }, 2000);
      setTimeout(() => {
        position.value = currentHour === 19 ? "position19" : "position6";
      }, 4000);
    } else {
      position.value = `position${currentHour}`;
    }
  });
  return { position };
}

export default defineComponent({
  components: {
    LangSelector,
    About,
  },
  setup() {
    const { now } = useNow();
    const { timer } = useTimerFromDate(now);
    const { position: astrePosition } = useAstre(now);

    const { className: timeClassName } = useTimeClass(now);
    const { className: weatherClassName } = useWeather();

    const city = ref("");
    const cityNotEmpty = computed(() => city.value.length > 0);

    const zip = ref("");
    return {
      astrePosition,
      timeClassName,
      weatherClassName,

      timer,
      city,
      cityNotEmpty,
      zip,
    };
  },
});
