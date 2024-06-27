<template>
    <UButton
        :icon="'i-heroicons-exclamation-triangle-20-solid'"
        color="gray"
        variant="ghost"
        aria-label="Theme"
        @click="openSlideover"
    />
</template>

<script setup lang="ts">
import WarningsSlideover from "./WarningsSlideover.vue";

const slideover = useSlideover();
function openSlideover() {
    slideover.open(WarningsSlideover);
}
</script>
