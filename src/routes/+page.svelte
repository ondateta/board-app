<script>
    import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
    <div class="text-center">
        <h1 class="text-5xl font-bold mb-4">Kanban Board</h1>
        <p class="text-xl mb-8">Organize your work, manage projects, and boost productivity.</p>
        
        <div class="space-x-4">
            {#if $page.data.user}
                <a href="/app" class="px-6 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 transition">
                    Go to Dashboard
                </a>
            {:else}
                <a href="/login" class="px-6 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 transition">
                    Login
                </a>
                <a href="/register" class="px-6 py-3 border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-blue-600 transition">
                    Register
                </a>
            {/if}
        </div>
    </div>
</div>