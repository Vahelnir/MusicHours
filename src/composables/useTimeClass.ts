import { computed, Ref } from "vue";
import { useNow } from "./useNow";

const periods = [
  {
    label: "night",
    check: (hour: number) => hour <= 5 || hour >= 20,
  },
  {
    label: "sunset",
    check: (hour: number) => [6, 7, 18, 19].includes(hour),
  },
  {
    label: "day",
    check: () => true,
  },
];
const className = "time--";

export function useTimeClass(now: Ref<Date>) {
  if (!now) {
    now = useNow().now;
  }
  const currentTimeLabel = computed(() => {
    const currentDate = now.value;
    const period = periods.find(({ check }) => check(currentDate.getHours()));
    if (!period) {
      throw new Error("No period found, that should not have happenned !");
    }
    return period.label;
  });
  return {
    className: computed(() => `${className}${currentTimeLabel.value}`),
  };
}
