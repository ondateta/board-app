<script lang="ts">
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import { Plus, X, MoreHorizontal } from 'lucide-svelte';
    import type { PageData } from './$types';

    let { data } = $props();

    // State
    // data.lists comes from server. We initialize local state from it.
    // We map it to ensure 'cards' property exists if it was 'items' (but we fixed server).
    let lists = $state(data.lists.map(l => ({ ...l, cards: l.cards || [] })));

    const flipDurationMs = 200;

    function handleListDndConsider(e: CustomEvent<any>) {
        lists = e.detail.items;
    }

    async function handleListDndFinalize(e: CustomEvent<any>) {
        lists = e.detail.items;
        // Persist list order
        for (let i = 0; i < lists.length; i++) {
            await fetch(`/api/lists/${lists[i].id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position: i })
            });
        }
    }

    function handleCardDndConsider(e: CustomEvent<any>, listId: string) {
        const listIndex = lists.findIndex(l => l.id === listId);
        lists[listIndex].cards = e.detail.items;
    }

    async function handleCardDndFinalize(e: CustomEvent<any>, listId: string) {
        const listIndex = lists.findIndex(l => l.id === listId);
        lists[listIndex].cards = e.detail.items;

        // Persist card order and list_id
        const cards = lists[listIndex].cards;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            await fetch(`/api/cards/${card.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    position: i,
                    list_id: listId
                })
            });
        }
    }

    let newListTitle = $state('');
    let isCreatingList = $state(false);

    async function createList() {
        if (!newListTitle.trim()) return;
        
        try {
            const res = await fetch('/api/lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ board_id: data.board.id, title: newListTitle })
            });
            
            if (res.ok) {
                const newList = await res.json();
                newList.cards = [];
                lists = [...lists, newList];
                newListTitle = '';
                isCreatingList = false;
            }
        } catch (e) {
            console.error('Error creating list:', e);
        }
    }

    let creatingCardInListId = $state<string | null>(null);
    let newCardTitle = $state('');

    async function createCard(listId: string) {
        if (!newCardTitle.trim()) return;

        try {
            const res = await fetch('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ list_id: listId, title: newCardTitle })
            });

            if (res.ok) {
                const newCard = await res.json();
                const listIndex = lists.findIndex(l => l.id === listId);
                lists[listIndex].cards = [...lists[listIndex].cards, newCard];
                newCardTitle = '';
                creatingCardInListId = null;
            }
        } catch (e) {
            console.error('Error creating card:', e);
        }
    }
</script>

<div class="h-full flex flex-col">
    <div class="bg-white/50 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-800">{data.board.title}</h1>
    </div>

    <div class="flex-1 overflow-x-auto p-4">
        <div class="flex h-full gap-4 items-start" use:dndzone={{items: lists, flipDurationMs, type: 'list', dropTargetStyle: {}}} onconsider={handleListDndConsider} onfinalize={handleListDndFinalize}>
            {#each lists as list (list.id)}
                <div class="flex-shrink-0 w-72 bg-gray-100 rounded-lg flex flex-col max-h-full shadow-sm border border-gray-200" animate:flip={{duration: flipDurationMs}}>
                    <div class="p-3 font-semibold text-gray-700 flex justify-between items-center cursor-grab active:cursor-grabbing">
                        <span>{list.title}</span>
                        <button class="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto min-h-[50px] px-2 pb-2" use:dndzone={{items: list.cards, flipDurationMs, type: 'card', dropTargetStyle: {}}} onconsider={(e) => handleCardDndConsider(e, list.id)} onfinalize={(e) => handleCardDndFinalize(e, list.id)}>
                        {#each list.cards as card (card.id)}
                            <div class="bg-white p-3 rounded mb-2 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:bg-gray-50" animate:flip={{duration: flipDurationMs}}>
                                {card.title}
                            </div>
                        {/each}
                    </div>

                    <div class="p-2">
                        {#if creatingCardInListId === list.id}
                            <div class="bg-white p-2 rounded shadow-sm border border-gray-200 mb-2">
                                <textarea 
                                    bind:value={newCardTitle} 
                                    placeholder="Enter a title for this card..." 
                                    class="w-full text-sm resize-none focus:outline-none"
                                    rows="2"
                                    autofocus
                                ></textarea>
                                <div class="flex items-center gap-2 mt-2">
                                    <button onclick={() => createCard(list.id)} class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700">Add Card</button>
                                    <button onclick={() => { creatingCardInListId = null; newCardTitle = ''; }} class="text-gray-500 hover:text-gray-700"><X size={20}/></button>
                                </div>
                            </div>
                        {:else}
                            <button onclick={() => creatingCardInListId = list.id} class="w-full text-left p-2 text-gray-600 hover:bg-gray-200 rounded flex items-center gap-2 text-sm font-medium transition-colors">
                                <Plus size={16} /> Add a card
                            </button>
                        {/if}
                    </div>
                </div>
            {/each}

            <!-- Add List Section -->
            <div class="flex-shrink-0 w-72">
                {#if isCreatingList}
                    <div class="bg-gray-100 p-2 rounded-lg border border-gray-200 shadow-sm">
                        <input 
                            bind:value={newListTitle} 
                            placeholder="Enter list title..." 
                            class="w-full px-2 py-1.5 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-sm mb-2"
                            autofocus
                        />
                        <div class="flex items-center gap-2">
                            <button onclick={createList} class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700">Add List</button>
                            <button onclick={() => { isCreatingList = false; newListTitle = ''; }} class="text-gray-500 hover:text-gray-700"><X size={20}/></button>
                        </div>
                    </div>
                {:else}
                    <button onclick={() => isCreatingList = true} class="w-full bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white p-3 rounded-lg flex items-center gap-2 font-medium transition-colors border border-white/20 text-gray-800">
                        <Plus size={20} /> Add another list
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    /* Custom scrollbar for horizontal scrolling if needed */
    ::-webkit-scrollbar {
        height: 8px;
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(107, 114, 128, 0.8);
    }
</style>