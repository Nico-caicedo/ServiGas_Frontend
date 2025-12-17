import { ref, computed, onBeforeUnmount } from "vue";


const useCurrentTime = () => {
  const currentTime = ref(new Date());
  const updateCurrentTime = () => {
    currentTime.value = new Date();
  };
  const updateTimeInterval = setInterval(updateCurrentTime, 1000);
  onBeforeUnmount(() => {
    clearInterval(updateTimeInterval);
  });
  return {
    currentTime: computed(() => currentTime.value.toLocaleTimeString())
  };
};


export default useCurrentTime