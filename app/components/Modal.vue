<template>
  <UModal v-model:open="open" :ui="{ content: 'sm:max-w-md', overlay: 'bg-black/40' }">
    <template #content>
      <UCard :ui="{ body: 'flex flex-col gap-4 relative' }">
      
      <!-- Modal Header -->
      <div class="flex items-start justify-between select-none">
        <div class="space-y-1.5 pr-4">
          <h3 class="text-lg font-semibold text-neutral-900 leading-none tracking-tight">
            Download Laporan
          </h3>
          <p class="text-sm text-neutral-500 leading-normal">
            Pilih periode data untuk setiap dashboard yang ingin dimasukkan ke dalam laporan sebelum mengunduh file.
          </p>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          class="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 p-1 rounded-md shrink-0 cursor-pointer"
          @click="open = false"
          aria-label="Close"
        />
      </div>

      <!-- Form White Container with Border -->
      <div class="border border-neutral-200 rounded-lg p-4 bg-white shadow-xs space-y-4">
        <template v-for="(section, idx) in sections" :key="section.title">
          <!-- Divider between sections -->
          <div v-if="idx > 0" class="border-t border-neutral-100 my-2"></div>
          
          <div class="space-y-2">
            <h4 class="text-sm font-semibold text-neutral-900 tracking-wide select-none">
              {{ section.title }}
            </h4>
            <div class="space-y-2.5">
              <div v-for="item in section.items" :key="item.label" class="flex items-center justify-between gap-4">
                <span class="text-sm font-medium text-neutral-600">{{ item.label }}</span>
                <USelect
                  v-model="item.model.value"
                  :items="timeframeOptions"
                  class="w-36 shrink-0"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Action Button -->
      <UButton
        color="primary"
        size="lg"
        :loading="isDownloading"
        class="w-full justify-center"
        @click="handleDownload"
      >
        Download PDF
      </UButton>

      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
// Modal open state bound as a model
const open = defineModel<boolean>({ default: false })
const isDownloading = ref(false)

// Select options state matching the mockup design
const growthLagging = ref('This Month')
const growthLeading = ref('Last Month')
const retentionLagging = ref('This Month')
const retentionLeading = ref('Last Month')
const serviceLagging = ref('This Month')
const serviceLeading = ref('Last Month')

const timeframeOptions = ['This Month', 'Last Month', 'This Quarter', 'This Year']

// Group items into data-driven structures to eliminate template duplication
const sections = [
  {
    title: 'Growth Dashboard',
    items: [
      { label: 'Lagging Indicator', model: growthLagging },
      { label: 'Leading Indicator', model: growthLeading }
    ]
  },
  {
    title: 'Retention Dashboard',
    items: [
      { label: 'Lagging Indicator', model: retentionLagging },
      { label: 'Leading Indicator', model: retentionLeading }
    ]
  },
  {
    title: 'Service and Quality Dashboard',
    items: [
      { label: 'Lagging Indicator', model: serviceLagging },
      { label: 'Leading Indicator', model: serviceLeading }
    ]
  }
]

// Simulates a premium download delay with a loading spinner
const handleDownload = () => {
  isDownloading.value = true
  setTimeout(() => {
    isDownloading.value = false
    open.value = false
  }, 1500)
}
</script>
