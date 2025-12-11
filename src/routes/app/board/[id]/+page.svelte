<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<div class="h-full flex flex-col bg-blue-500 text-white">
  <!-- Board Header -->
  <div class="p-4 bg-black/20 flex justify-between items-center">
    <h1 class="text-xl font-bold">{data.board.title}</h1>
    <form action="?/deleteBoard" method="POST" use:enhance onsubmit={() => confirm('Are you sure?')}>
        <button class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">Delete Board</button>
    </form>
  </div>

  <!-- Lists Container -->
  <div class="flex-1 overflow-x-auto p-4 flex items-start space-x-4">
    {#each data.board.lists as list}
      <div class="bg-gray-100 text-gray-800 rounded-lg w-72 flex-shrink-0 p-3 flex flex-col max-h-full">
        <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">{list.title}</h3>
            <form action="?/deleteList" method="POST" use:enhance>
                <input type="hidden" name="listId" value={list.id} />
                <button class="text-gray-400 hover:text-red-500">&times;</button>
            </form>
        </div>
        
        <!-- Cards -->
        <div class="flex-1 overflow-y-auto space-y-2 min-h-0 mb-2">
            {#each list.cards as card}
                <div class="bg-white p-2 rounded shadow-sm group relative">
                    {card.title}
                     <form action="?/deleteCard" method="POST" use:enhance class="absolute top-1 right-1 hidden group-hover:block">
                        <input type="hidden" name="cardId" value={card.id} />
                        <button class="text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow">&times;</button>
                    </form>
                </div>
            {/each}
        </div>

        <!-- Add Card Form -->
        <form action="?/createCard" method="POST" use:enhance>
            <input type="hidden" name="listId" value={list.id} />
            <input 
                type="text" 
                name="title" 
                placeholder="Add a card..." 
                class="w-full px-2 py-1 rounded border mb-1 focus:outline-blue-500"
                required
            />
            <button class="text-gray-500 hover:bg-gray-200 px-2 py-1 rounded w-full text-left text-sm">
                + Add Card
            </button>
        </form>
      </div>
    {/each}

    <!-- Add List Form -->
    <div class="w-72 flex-shrink-0 bg-white/30 p-3 rounded-lg">
      <form action="?/createList" method="POST" use:enhance>
        <input 
            type="text" 
            name="title" 
            placeholder="Enter list title..." 
            class="w-full px-2 py-1 rounded border mb-2 focus:outline-blue-500 text-gray-800"
            required
        />
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded w-full">
            Add List
        </button>
      </form>
    </div>
  </div>
</div>
