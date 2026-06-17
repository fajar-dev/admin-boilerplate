<template>
  <div class="space-y-6">
    <!-- Header -->
    <Header
      title="My Profile"
      description="Manage your personal profile details and security settings"
    >
    </Header>

    <div class="max-w-2xl bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden">
      <!-- Tabs Header -->
      <div class="border-b border-neutral-200 px-6 pt-4 bg-neutral-50/50">
        <div class="flex gap-6">
          <button 
            class="pb-3 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer focus:outline-hidden"
            :class="activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-900'"
            @click="activeTab = 'info'"
          >
            Informasi
          </button>
          <button 
            class="pb-3 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer focus:outline-hidden"
            :class="activeTab === 'password' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-900'"
            @click="activeTab = 'password'"
          >
            Password
          </button>
        </div>
      </div>

      <!-- Tab Content: Informasi -->
      <div v-if="activeTab === 'info'" class="p-6 space-y-6">
        <!-- Photo Upload Section -->
        <div class="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-neutral-150">
          <div class="relative group cursor-pointer" @click="triggerFileInput">
            <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-200 hover:border-primary/50 transition-colors duration-200 flex items-center justify-center bg-neutral-50 relative">
              <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
              <UIcon v-else name="i-lucide-user" class="w-12 h-12 text-neutral-400" />
              
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <UIcon name="i-lucide-camera" class="w-6 h-6 text-white" />
              </div>

              <div v-if="isUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-white animate-spin" />
              </div>
            </div>
          </div>
          <div class="space-y-1.5 text-center sm:text-left">
            <h3 class="text-sm font-semibold text-neutral-900">Profile Picture</h3>
            <p class="text-xs text-neutral-500 pb-1">Supports JPG or PNG. Max size 2MB.</p>
            <div class="flex gap-2 justify-center sm:justify-start">
              <UButton size="xs" color="neutral" variant="outline" @click="triggerFileInput" icon="i-lucide-upload">Change Photo</UButton>
              <UButton v-if="previewUrl || formInfo.photo" size="xs" color="error" variant="outline" @click="removePhoto" icon="i-lucide-trash">Remove</UButton>
            </div>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileChange" />
          </div>
        </div>

        <UForm :schema="infoSchema" :state="formInfo" @submit="handleInfoSubmit" class="space-y-4">
          <UFormField label="Full Name" name="name">
            <UInput v-model="formInfo.name" placeholder="Enter full name" class="w-full" />
          </UFormField>
          <UFormField label="Email Address" name="email">
            <UInput v-model="formInfo.email" type="email" placeholder="Enter email address" class="w-full" />
          </UFormField>
          
          <div class="flex justify-end pt-2">
            <UButton
              type="submit"
              color="primary"
              :loading="isSavingInfo"
              :disabled="isUploading"
              icon="i-lucide-save"
            >
              Save Information
            </UButton>
          </div>
        </UForm>
      </div>

      <!-- Tab Content: Password -->
      <div v-if="activeTab === 'password'" class="p-6 space-y-6">
        <UForm :schema="passwordSchema" :state="formPassword" @submit="handlePasswordSubmit" class="space-y-4">
          <UFormField name="oldPassword">
            <template #label>
              <div class="flex flex-col gap-0.5">
                <span class="font-medium text-sm text-neutral-900">Current Password</span>
                <span class="text-[10px] text-neutral-400 font-normal">Leave empty if you don't have a password set (e.g. Google Login accounts)</span>
              </div>
            </template>
            <UInput v-model="formPassword.oldPassword" type="password" placeholder="Enter current password" class="w-full" />
          </UFormField>
          <UFormField label="New Password" name="newPassword">
            <UInput v-model="formPassword.newPassword" type="password" placeholder="Minimum 6 characters" class="w-full" />
          </UFormField>
          <UFormField label="Confirm New Password" name="confirmPassword">
            <UInput v-model="formPassword.confirmPassword" type="password" placeholder="Confirm new password" class="w-full" />
          </UFormField>
          
          <div class="flex justify-end pt-2">
            <UButton
              type="submit"
              color="primary"
              :loading="isSavingPassword"
              icon="i-lucide-key-round"
            >
              Change Password
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { userService } from '~/services/user-service'
import type { UpdateProfilePayload, UpdatePasswordPayload } from '~/types/profile'

definePageMeta({
  layout: 'dashboard'
})

const { state: authState, service: authService } = useAuth()
const toast = useToast()

// Active Tab
const activeTab = ref('info')

// Upload state
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)

// Saving state
const isSavingInfo = ref(false)
const isSavingPassword = ref(false)

// Form - Information
const formInfo = reactive<UpdateProfilePayload>({
  name: '',
  email: '',
  photo: null
})

// Form - Password
const formPassword = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Validation Schemas
const infoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address')
})

const passwordSchema = z.object({
  oldPassword: z.string().optional().or(z.literal('')),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Populate profile details
const populateProfile = () => {
  if (authState.user) {
    formInfo.name = authState.user.name
    formInfo.email = authState.user.email
    formInfo.photo = authState.user.photo
    previewUrl.value = authState.user.photo
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Local preview URL
  previewUrl.value = URL.createObjectURL(file)

  isUploading.value = true
  try {
    const response = await userService.uploadPhoto(file)
    if (response.success && response.data?.path) {
      formInfo.photo = response.data.path
      toast.add({
        title: 'Photo uploaded successfully!',
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
    } else {
      toast.add({
        title: 'Failed to upload photo',
        color: 'error',
        icon: 'i-lucide-circle-alert'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Failed to upload photo',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  } finally {
    isUploading.value = false
  }
}

const removePhoto = () => {
  formInfo.photo = null
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleInfoSubmit = async () => {
  isSavingInfo.value = true
  try {
    const response = await authService.updateProfile(formInfo)
    if (response.success) {
      toast.add({
        title: 'Profile updated successfully!',
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
    }
  } finally {
    isSavingInfo.value = false
  }
}

const handlePasswordSubmit = async () => {
  isSavingPassword.value = true

  const payload: UpdatePasswordPayload = {
    newPassword: formPassword.newPassword
  }

  if (formPassword.oldPassword && formPassword.oldPassword.trim() !== '') {
    payload.oldPassword = formPassword.oldPassword
  }

  try {
    const response = await authService.updatePassword(payload)
    if (response.success) {
      toast.add({
        title: 'Password updated successfully!',
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
      // Clear password form fields
      formPassword.oldPassword = ''
      formPassword.newPassword = ''
      formPassword.confirmPassword = ''
    }
  } finally {
    isSavingPassword.value = false
  }
}

// Watch session user changes
watch(() => authState.user, () => {
  populateProfile()
}, { immediate: true })

onMounted(() => {
  populateProfile()
})
</script>
