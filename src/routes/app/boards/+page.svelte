<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import { Plus, User, Clock } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';

  let { data, form } = $props<{ data: PageData, form: ActionData }>();

  let isCreateModalOpen = $state(false);

  // Close modal on success
  $effect(() => {
    if (form?.success) {
      isCreateModalOpen = false;
    }
  });
</script>

<div class="h-full overflow-y-auto bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-5xl">
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <User size={24} />
                </div>
                <h1 class="text-2xl font-bold text-gray-800">Your Workspaces</h1>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!-- Create Board Button -->
            <button 
                onclick={() => isCreateModalOpen = true}
                class="group flex flex-col items-center justify-center h-32 bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 cursor-pointer"
            >
                <Plus size={24} class="text-gray-500 group-hover:text-gray-700 mb-2 transition-colors" />
                <span class="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Create new board</span>
            </button>

            <!-- Board List -->
            {#each data.boards as board}
                <a 
                    href="/app/board/{board.id}" 
                    class="block h-32 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group border border-gray-200"
                >
                    <!-- Color strip/header -->
                    <div class="h-2 bg-blue-500 w-full absolute top-0 left-0"></div>
                    
                    <div class="p-4 pt-6 h-full flex flex-col">
                        <h3 class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                            {board.title}
                        </h3>
                        <div class="mt-auto flex items-center gap-1 text-xs text-gray-400">
                             <Clock size={12} />
                             <span>Updated {new Date(board.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>

<Modal bind:isOpen={isCreateModalOpen} title="Create Board">
    <form method="POST" action="?/create" use:enhance class="flex flex-col gap-4">
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Board Title</label>
            <input 
                type="text" 
                id="title"
                name="title" 
                placeholder="e.g., Project Management" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                autofocus
            />
            {#if form?.errors?.title}
                <p class="text-red-500 text-xs mt-1">{form.errors.title[0]}</p>
            {/if}
        </div>

        <div class="bg-gray-50 -mx-4 -mb-4 px-4 py-3 flex justify-end gap-2 mt-4 border-t">
            <button 
                type="button" 
                onclick={() => isCreateModalOpen = false}
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Create Board
            </button>
        </div>
    </form>
</Modal>