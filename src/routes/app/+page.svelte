<script lang="ts">
	let { data, form } = $props();
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-6xl mx-auto">
		<header class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900">My Boards</h1>
			<div class="flex items-center gap-4">
				<span class="text-gray-600">Welcome, {data.user?.username}</span>
				<!-- Logout button (assuming logout logic exists elsewhere or later) -->
                <!-- Ideally this points to a proper logout route or action -->
				<a href="/login" class="text-sm text-red-600 hover:underline">Logout</a>
			</div>
		</header>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
			{#each data.boards as board}
				<a
					href="/app/board/{board.id}"
					class="block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-blue-400 group h-32 flex flex-col justify-between"
				>
					<h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{board.title}</h3>
					<p class="text-xs text-gray-400">Created {new Date(board.createdAt).toLocaleDateString()}</p>
				</a>
			{/each}

             <!-- Empty state or visual placeholder -->
             {#if data.boards.length === 0}
                <div class="col-span-full text-center py-12 text-gray-500">
                    <p>You haven't created any boards yet.</p>
                </div>
             {/if}
		</div>

		<div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
			<h2 class="text-xl font-bold mb-4 text-gray-800">Create New Board</h2>
			<form method="POST" action="?/create" class="flex flex-col gap-4">
				<div>
					<label for="title" class="block mb-2 text-sm font-medium text-gray-900">Board Title</label>
					<input
						type="text"
						id="title"
						name="title"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder="e.g., Project Alpha"
						required
					/>
				</div>
				<button
					type="submit"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none"
				>
					Create Board
				</button>
			</form>
			{#if form?.message}
				<div class="mt-4 p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
					{form.message}
				</div>
			{/if}
		</div>
	</div>
</div>
