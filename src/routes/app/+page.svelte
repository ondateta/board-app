<script lang="ts">
    import { enhance } from '$app/forms';
    import { Plus } from 'lucide-svelte';
    import type { ActionData, PageData } from './$types';

    let { data, form } = $props();

    let isModalOpen = $state(false);
    let creating = $state(false);

    function openModal() {
        isModalOpen = true;
    }

    function closeModal() {
        isModalOpen = false;
    }
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Your Boards</h1>
        <button 
            onclick={openModal}
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
            <Plus size={20} />
            <span>Create Board</span>
        </button>
    </div>

    {#if data.boards.length === 0}
        <div class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No boards</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new board.</p>
            <div class="mt-6">
                <button 
                    onclick={openModal}
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <Plus size={16} class="mr-2"/>
                    Create Board
                </button>
            </div>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Create New Board Card (Inline option) -->
             <button 
                onclick={openModal}
                class="group relative block w-full h-32 border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer"
            >
                <Plus class="mx-auto h-8 w-8 text-gray-400 group-hover:text-gray-500" />
                <span class="mt-2 block text-sm font-semibold text-gray-900">Create new board</span>
            </button>

            {#each data.boards as board (board.id)}
                <a href="/app/board/{board.id}" class="block h-32 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all p-6 flex flex-col justify-between group">
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 truncate">{board.title}</h3>
                    <div class="text-xs text-gray-500">Created {new Date(board.created_at * 1000).toLocaleDateString()}</div>
                </a>
            {/each}
        </div>
    {/if}
</div>

<!-- Modal -->
{#if isModalOpen}
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div 
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                aria-hidden="true"
                onclick={closeModal}
            ></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!-- Modal panel -->
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                            <Plus class="h-6 w-6 text-indigo-600" />
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create Board</h3>
                            <div class="mt-2">
                                <form 
                                    method="POST" 
                                    action="?/createBoard" 
                                    use:enhance={() => {
                                        creating = true;
                                        return async ({ update, result }) => {
                                            creating = false;
                                            await update();
                                            if (result.type === 'success') {
                                                closeModal();
                                            }
                                        };
                                    }}
                                    id="create-board-form"
                                >
                                    <div class="mb-4">
                                        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Board Title</label>
                                        <input 
                                            type="text" 
                                            name="title" 
                                            id="title" 
                                            required
                                            placeholder="e.g., Marketing Campaign"
                                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        />
                                    </div>
                                    {#if form?.message}
                                        <p class="text-red-500 text-sm mb-2">{form.message}</p>
                                    {/if}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button 
                        type="submit" 
                        form="create-board-form"
                        disabled={creating}
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create'}
                    </button>
                    <button 
                        type="button" 
                        onclick={closeModal}
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}