<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { enhance } from '$app/forms';
  import { Trash2, Plus, X } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';

  export let data;
  
  // Local state for board data to handle DnD updates efficiently
  let board = data.board;
  $: board = data.board; // React to server updates

  // Drag and Drop options
  const flipDurationMs = 200;

  // --- List Reordering ---
  function handleListConsider(e: CustomEvent<DndEvent<any>>) {
    board.lists = e.detail.items;
  }

  async function handleListFinalize(e: CustomEvent<DndEvent<any>>) {
    board.lists = e.detail.items;
    
    // Prepare data for server
    const items = board.lists.map((list: any, index: number) => ({
      id: list.id,
      order: index
    }));

    await updateOrder('updateListOrder', items);
  }

  // --- Card Reordering ---
  function handleCardConsider(listId: string, e: CustomEvent<DndEvent<any>>) {
    const listIndex = board.lists.findIndex((l: any) => l.id === listId);
    if (listIndex !== -1) {
      board.lists[listIndex].cards = e.detail.items;
      board.lists = [...board.lists]; // Trigger reactivity
    }
  }

  async function handleCardFinalize(listId: string, e: CustomEvent<DndEvent<any>>) {
    const listIndex = board.lists.findIndex((l: any) => l.id === listId);
    if (listIndex !== -1) {
      board.lists[listIndex].cards = e.detail.items;
      board.lists = [...board.lists]; // Trigger reactivity

      // Prepare data for server
      // We need to send the new order and ensure listId is correct for all cards in this list
      const items = e.detail.items.map((card: any, index: number) => ({
        id: card.id,
        order: index,
        listId: listId // IMPORTANT: This updates the card's list ownership
      }));

      await updateOrder('updateCardOrder', items);
    }
  }

  // --- Server Sync ---
  async function updateOrder(action: string, items: any[]) {
    const formData = new FormData();
    formData.append('items', JSON.stringify(items));

    await fetch(`?/` + action, {
      method: 'POST',
      body: formData
    });
  }

  // --- UI State ---
  let isCreatingList = false;
  let creatingCardInList: string | null = null;
</script>

<div class="h-full flex flex-col overflow-hidden bg-cover bg-center" style="background-image: url({board.background || ''})">
  <!-- Board Header -->
  <header class="bg-white/90 backdrop-blur-sm border-b px-6 py-3 flex justify-between items-center shadow-sm z-10">
    <h1 class="text-xl font-bold text-gray-800">{board.title}</h1>
    <form action="?/deleteBoard" method="POST" use:enhance on:submit={() => confirm('Are you sure?')}>
        <button type="submit" class="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors flex items-center gap-2">
            <Trash2 size={18} />
            <span class="hidden sm:inline">Delete Board</span>
        </button>
    </form>
  </header>

  <!-- Board Canvas -->
  <div class="flex-1 overflow-x-auto overflow-y-hidden p-6">
    <div 
        use:dndzone={{items: board.lists, flipDurationMs, type: 'list', dropTargetStyle: {}}} 
        on:consider={handleListConsider} 
        on:finalize={handleListFinalize}
        class="flex gap-4 h-full items-start"
    >
      {#each board.lists as list (list.id)}
        <div animate:flip={{duration: flipDurationMs}} class="w-80 flex-shrink-0 bg-gray-100 rounded-xl shadow-md max-h-full flex flex-col">
          <!-- List Header -->
          <div class="p-3 font-semibold text-gray-700 flex justify-between items-center cursor-move handle">
            <span>{list.title}</span>
             <form action="?/deleteList" method="POST" use:enhance>
                <input type="hidden" name="listId" value={list.id} />
                <button type="submit" class="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                </button>
            </form>
          </div>

          <!-- Cards Area -->
          <div 
            class="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar"
            use:dndzone={{items: list.cards, flipDurationMs, type: 'card', dropTargetStyle: {}}}
            on:consider={(e) => handleCardConsider(list.id, e)}
            on:finalize={(e) => handleCardFinalize(list.id, e)}
          >
            {#each list.cards as card (card.id)}
              <div animate:flip={{duration: flipDurationMs}} class="bg-white p-3 rounded-lg shadow-sm mb-2 group border border-gray-200 hover:border-blue-300 cursor-grab active:cursor-grabbing">
                <div class="flex justify-between items-start">
                    <span class="text-sm text-gray-800 break-words">{card.title}</span>
                    <form action="?/deleteCard" method="POST" use:enhance class="opacity-0 group-hover:opacity-100 transition-opacity">
                        <input type="hidden" name="cardId" value={card.id} />
                        <button type="submit" class="text-gray-400 hover:text-red-500">
                            <X size={14} />
                        </button>
                    </form>
                </div>
              </div>
            {/each}
          </div>

          <!-- List Footer (Add Card) -->
          <div class="p-2">
            {#if creatingCardInList === list.id}
               <form 
                 action="?/createCard" 
                 method="POST" 
                 use:enhance={() => {
                   return async ({ update }) => {
                     await update();
                     creatingCardInList = null;
                   };
                 }}
                 class="p-2"
               >
                 <input type="hidden" name="listId" value={list.id} />
                 <textarea 
                    name="title" 
                    placeholder="Enter a title for this card..." 
                    class="w-full p-2 text-sm border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="2"
                    autofocus
                 ></textarea>
                 <div class="flex items-center gap-2">
                    <button type="submit" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">Add Card</button>
                    <button type="button" on:click={() => creatingCardInList = null} class="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                 </div>
               </form>
            {:else}
              <button 
                on:click={() => creatingCardInList = list.id}
                class="flex items-center gap-2 text-gray-500 hover:bg-gray-200 w-full p-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Add a card
              </button>
            {/if}
          </div>
        </div>
      {/each}

        <!-- Add List Button -->
        <div class="w-80 flex-shrink-0">
            {#if isCreatingList}
                <form 
                    action="?/createList" 
                    method="POST" 
                    class="bg-gray-100 p-3 rounded-xl shadow-md"
                    use:enhance={() => {
                        return async ({ update }) => {
                            await update();
                            isCreatingList = false;
                        };
                    }}
                >
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Enter list title..." 
                        class="w-full p-2 text-sm border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        autofocus
                    />
                    <div class="flex items-center gap-2">
                        <button type="submit" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">Add List</button>
                         <button type="button" on:click={() => isCreatingList = false} class="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>
                </form>
            {:else}
                <button 
                    on:click={() => isCreatingList = true}
                    class="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-xl flex items-center gap-2 font-medium transition-colors border border-white/20"
                >
                    <Plus size={18} />
                    Add another list
                </button>
            {/if}
        </div>

    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
</style>