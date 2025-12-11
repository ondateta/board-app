<script lang="ts">
    import { goto } from '$app/navigation';

    let username = '';
    let password = '';
    let confirmPassword = '';
    let error = '';

    async function handleSubmit() {
        if (password !== confirmPassword) {
            error = 'Passwords do not match';
            return;
        }

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            goto('/app');
        } else {
            error = data.error;
        }
    }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 class="text-2xl font-bold text-center">Register</h1>
        {#if error}
            <p class="text-red-500 text-center">{error}</p>
        {/if}
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" id="username" bind:value={username} class="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" bind:value={password} class="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" bind:value={confirmPassword} class="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <button type="submit" class="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Register
            </button>
        </form>
        <div class="text-center">
            <p class="text-sm">Already have an account? <a href="/login" class="text-blue-600 hover:underline">Login</a></p>
        </div>
    </div>
</div>
