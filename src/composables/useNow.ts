import { ref, computed, onUnmounted } from "vue";

export function useNow() {
  const now = ref(new Date());
  let intervalHandler: NodeJS.Timeout;
  let timeoutHandler: NodeJS.Timeout;

  function start() {
    intervalHandler = setInterval(() => (now.value = new Date()), 1000);
  }

  function remove() {
    clearInterval(intervalHandler);
    clearTimeout(timeoutHandler);
  }

  const SYNC_MS = 1000;
  const offset =
    SYNC_MS -
    (now.value.getTime() - Math.floor(now.value.getTime() / SYNC_MS) * SYNC_MS);
  timeoutHandler = setTimeout(start, offset);

  onUnmounted(remove);
  return {
    now: computed(() => now.value),
  };
}
