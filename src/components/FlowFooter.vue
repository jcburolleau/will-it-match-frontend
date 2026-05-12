<script setup lang="ts">
const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
</script>

<template>
  <footer
    class="flex justify-between px-10 py-4 font-mono text-[10px] uppercase tracking-[0.16em]"
    style="border-top: 1px solid var(--hair); color: var(--muted)"
  >
    <span>Will it Match · v0.4</span>
    <span>Bound on local · {{ today }}</span>
  </footer>
</template>
