<script>
    import { enhance } from '$app/forms';
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded shadow-md w-96">
        <h1 class="mb-4 text-2xl font-bold text-center">Register</h1>
        <form method="POST" use:enhance class="flex flex-col gap-4">
            <input name="username" placeholder="Username" class="p-2 border rounded" required />
            <input type="password" name="password" placeholder="Password" class="p-2 border rounded" required />
            <button class="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">Sign Up</button>
        </form>
        <p class="mt-4 text-center">Already have an account? <a href="/login" class="text-blue-500">Login</a></p>
    </div>
</div>
