<script>
    import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <h1 class="text-6xl font-bold mb-4">{$page.status}</h1>
    <p class="text-xl mb-8">{$page.error?.message || 'Something went wrong'}</p>
    <a href="/" class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        Go Home
    </a>
</div>
