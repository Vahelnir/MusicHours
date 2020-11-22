import { ref } from "vue";

export function useWeather() {
  const className = ref("weather--normal");
  return { className };
}
