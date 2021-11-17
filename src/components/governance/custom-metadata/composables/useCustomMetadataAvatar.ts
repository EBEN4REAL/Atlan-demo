import { ref, watch, computed, Ref } from 'vue'
import { message } from 'ant-design-vue'
import { useTypedefStore } from '~/store/typedef'
import { Types } from '~/services/meta/types'


// composables
import useUploadImage from '~/composables/image/uploadImage'


interface avatarOptions {
  logoType: string
  imageId: string | null
  emoji: string | null
}




export default function useCustomMetadataAvatar(metadata) {
  // data
  const popOverVisible = ref(false)
  const isUpdating = ref(false)
  const imageResponse = ref({})
  const apiResponse = ref({})
  const store = useTypedefStore()
  const form: Ref<avatarOptions> = ref({
    logoType: 'image',
    imageId: null,
    emoji: null,
  })


  // image uploader ======================================================
  const {
    data: imageUploadData,
    error: imageUploadError,
    isLoading: isUploading,
    upload,
  } = useUploadImage()

  watch(
    [imageUploadData, imageUploadError],
    ([newImage, newError]) => {
      if (newImage) {
        console.log(newImage);

        imageResponse.value = newImage
        isUploading.value = false
        popOverVisible.value = false
        form.value.logoType = 'image'
        form.value.imageId = newImage.id
        form.value.emoji = null
        message.success('Image uploaded.')
      }
      if (newError) {
        message.error(' Error updating image.')
      }
    }
  )

  // methods
  const handleUploadImage = (payload: { file: File }) => {
    if (!popOverVisible.value) return
    const { file } = payload
    isUploading.value = true
    upload(file)
  }
  // End of image uploader -------------------------------------------------------


  // Emoji Update ========== 
  const handleEmojiSelect = ({ native }) => {
    form.value.logoType = 'emoji'
    form.value.emoji = native
    form.value.imageId = null
    popOverVisible.value = false
  }
  // End of Emoji update --------------


  // API updater  ===================================================================
  const updateBM = () => {

    isUpdating.value = true
    const tempBM = { ...metadata.value }
    if (!tempBM.options) tempBM.options = {}
    tempBM.options.logoType = form.value.logoType
    tempBM.options.imageId = form.value.imageId
    tempBM.options.emoji = form.value.emoji
    const { data, error } = Types.updateCustomMetadata(
      {
        businessMetadataDefs: [tempBM],
      },
      {
        options: {
          params: { type: 'BUSINESS_METADATA' },
        },
      }
    )

    watch(
      () => data.value,
      () => {
        if (
          data.value?.businessMetadataDefs
            ?.length
        ) {
          store.updateCustomMetadata(data.value.businessMetadataDefs[0])

          message.success('Metadata updated.')
          isUpdating.value = false
        }
      }
    )
    watch(error, () => {
      message.error('Error updating, try again.')
      isUpdating.value = false
    })
  }
  // End of API updater  --------------------------------------------------------





  // Form watcher 
  watch(form, () => {
    console.log("BOUT TO UPDATE", metadata.value);

    updateBM()
  }, { deep: true })




  const imageUrl = computed(
    () =>
      `${window.location.origin}/api/service/images/${metadata.value.options.imageId}?ContentDisposition=inline&name=${metadata.value.options.imageId}`
  )


  return {
    popOverVisible,
    isUploading,
    imageUrl,
    isUpdating,
    handleUploadImage,
    handleEmojiSelect,
  }
}