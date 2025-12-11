<script>
    import { enhance } from '$app/forms';
    export let form;
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded shadow-md w-96">
        <h1 class="mb-4 text-2xl font-bold text-center">Login</h1>
        {#if form?.message}
            <p class="mb-4 text-red-500 text-center">{form.message}</p>
        {/if}
        <form method="POST" use:enhance class="flex flex-col gap-4">
            <input name="username" placeholder="Username" class="p-2 border rounded" required />
            <input type="password" name="password" placeholder="Password" class="p-2 border rounded" required />
            <button class="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">Sign In</button>
        </form>
        <p class="mt-4 text-center">Don't have an account? <a href="/register" class="text-blue-500">Register</a></p>
    </div>
</div>
