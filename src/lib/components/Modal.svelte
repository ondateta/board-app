<script lang="ts">
    import { X } from 'lucide-svelte';
    import { fade, scale } from 'svelte/transition';

    let { isOpen = $bindable(false), title, children, onClose } = $props();

    function close() {
        isOpen = false;
        if (onClose) onClose();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') close();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
    <!-- Backdrop -->
    <div 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={close}
        role="button"
        tabindex="-1"
    >
        <!-- Modal Content -->
        <div 
            class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative flex flex-col max-h-[90vh]"
            transition:scale={{ duration: 200, start: 0.95 }}
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div class="flex items-center justify-between p-4 border-b">
                <h3 id="modal-title" class="text-lg font-semibold text-gray-900">{title}</h3>
                <button 
                    onclick={close}
                    class="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div class="p-4 overflow-y-auto">
                {@render children()}
            </div>
        </div>
    </div>
{/if}
