import { ref } from "vue";
export default function useModal() {
  const modalVisible = ref(false);

  const closeModal = () => {
    modalVisible.value = false;
  };
  const openModal = () => {
    modalVisible.value = true;
  };
  return {
    modalVisible,
    closeModal,
    openModal,
  };
}
