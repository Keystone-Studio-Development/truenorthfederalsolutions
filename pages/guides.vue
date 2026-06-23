<template>
  <div>
    <!-- Page Header -->
    <UPageHero class="relative isolate overflow-hidden bg-primary-700 md:min-h-125"
               title="Guides & Templates"
               description="Downloadable guides and templates to help you with federal contracting — available as PDFs for download."
               :ui="{
                title: 'text-4xl sm:text-5xl md:text-6xl font-bold text-white',
                description: 'text-sm sm:text-lg text-white max-w-3xl mx-auto'
              }">
      <NuxtImg src="/capitol-1.jpg"
               alt="Capitol building"
               class="absolute inset-0 -z-10 size-full object-cover brightness-[0.2]" />
      <div class="absolute inset-0 bg-primary-700/40 -z-10"></div>
    </UPageHero>

    <!-- Available Downloads -->
    <UPageSection class="bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-secondary-900 mb-2">Available
            Downloads</h2>
          <p class="text-secondary-600">
            Explore practical guides and editable templates designed to help you
            plan, prepare, and win federal
            contracting opportunities.
          </p>
        </div>

        <div v-if="loading"
             class="text-center py-8 text-secondary-600">
          Loading available guides...
        </div>

        <div v-else>
          <div v-if="files.length === 0"
               class="text-center py-12">
            <UIcon name="i-heroicons-document-text"
                   class="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p class="text-secondary-600">No guides available yet. Check back
              soon!</p>
          </div>

          <div v-else
               class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard v-for="file in files"
                   :key="file.url"
                   variant="outline"
                   class="flex flex-col bg-white"
                   :ui="{ body: 'flex-1 flex flex-col' }">
              <div class="flex-1">
                <h4
                    class="text-lg font-semibold text-secondary-900 mb-2 truncate">
                  {{ file.name }}</h4>
                <p class="text-secondary-600 text-sm">{{ file.description ||
                  'PDF — Click download to save a copy.' }}</p>
              </div>

              <template #footer>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-secondary-500">PDF</span>
                  <a :href="file.url"
                     :download="downloadName(file)">
                    <UButton size="sm"
                             trailing-icon="i-heroicons-arrow-down-tray"
                             class="bg-primary-700 text-white hover:bg-primary-800 cursor-pointer">
                      Download
                    </UButton>
                  </a>
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- CTA Section -->
    <CTA title="Need Custom Guidance?"
         description="Our experts can provide personalized guidance tailored to your specific situation and goals." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const files = ref([])
const loading = ref(true)

function downloadName(file) {
  // Derive the real filename (with extension) from the URL so the saved file
  // always keeps its .pdf extension, regardless of the friendly display name.
  const last = (file.url || '').split('/').pop() || ''
  try {
    return decodeURIComponent(last)
  } catch {
    return last
  }
}

async function loadGuides() {
  loading.value = true
  try {
    const res = await $fetch('/guides/index.json')
    files.value = res?.files || []
  } catch (e) {
    files.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => loadGuides())

definePageMeta({
  title: 'Guides & Templates - True North Federal Solutions',
  description: 'Downloadable federal contracting guides and templates.'
})
</script>
