<script lang="ts">
  import { page } from '$app/stores';
  let { children } = $props();
</script>

<svelte:head>
  <title>Dashboard - Trellone</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex flex-col h-screen bg-gray-50">
  <nav class="bg-[#026AA7] text-white px-4 h-12 flex justify-between items-center shrink-0 z-10">
    <a href="/app/boards" class="font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity">
       <!-- Icon placeholder -->
       <span class="tracking-tight">Trellone</span>
    </a>
    <div class="flex gap-4 items-center text-sm">
      <span class="font-medium">{$page.data.user?.name || $page.data.user?.email}</span>
      <form action="/logout" method="POST">
        <button type="submit" class="hover:bg-white/20 px-3 py-1 rounded transition-colors">Logout</button>
      </form>
    </div>
  </nav>
  <main class="flex-1 overflow-hidden relative">
    {@render children()}
  </main>
</div>