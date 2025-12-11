<script lang="ts">
    import { page } from '$app/stores';
    import { LayoutDashboard, LogOut } from 'lucide-svelte';
    let { children } = $props();
</script>

<div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div class="p-4 border-b border-gray-200">
            <h1 class="text-xl font-bold text-indigo-600 flex items-center gap-2">
                <LayoutDashboard class="w-6 h-6" />
                Kanban
            </h1>
        </div>
        
        <nav class="flex-1 p-4 space-y-1">
            <a href="/app" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md {$page.url.pathname === '/app' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}">
                <LayoutDashboard class="w-4 h-4" />
                Boards
            </a>
            <!-- Add more links here later -->
        </nav>

        <div class="p-4 border-t border-gray-200">
            <div class="flex items-center gap-3 mb-4 px-4">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {$page.data.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div class="text-sm">
                    <p class="font-medium text-gray-900">{$page.data.user?.username || 'User'}</p>
                </div>
            </div>
            
            <form action="/api/auth/logout" method="POST">
                <button type="submit" class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                    <LogOut class="w-4 h-4" />
                    Logout
                </button>
            </form>
        </div>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 p-4 flex items-center justify-between">
         <h1 class="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <LayoutDashboard class="w-6 h-6" />
            Kanban
        </h1>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0">
        {@render children()}
    </main>
</div>