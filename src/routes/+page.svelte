<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Trellone - Organize anything, together.</title>
	<meta name="description" content="Free Kanban boards to manage your projects and tasks. Simple, fast, and effective." />
	<meta name="keywords" content="kanban, trello clone, project management, task organizer, productivity, sveltekit" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50">
	<header class="bg-white shadow">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">Trellone</h1>
			<div>
				{#if data.user}
					<span class="mr-4 text-gray-700">Hello, {data.user.name}</span>
					<form action="/logout" method="POST" class="inline">
						<button type="submit" class="text-sm font-semibold text-gray-900 hover:text-blue-600">
							Sign out
						</button>
					</form>
				{:else}
					<a href="/login" class="mr-4 text-sm font-semibold text-gray-900 hover:text-blue-600">
						Log in
					</a>
					<a
						href="/register"
						class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						Sign up
					</a>
				{/if}
			</div>
		</div>
	</header>
	<main>
		<div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
			{#if data.user}
				<div class="px-4 py-6 sm:px-0">
					<div class="rounded-lg border-4 border-dashed border-gray-200 p-10 text-center h-96">
						<h2 class="text-2xl font-bold text-gray-700">Your Boards</h2>
						<p class="mt-2 text-gray-500">You don't have any boards yet.</p>
						<button
							class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
						>
							Create new board
						</button>
					</div>
				</div>
			{:else}
				<div class="px-4 py-6 sm:px-0">
					<div class="text-center">
						<h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
							Organize your work.
						</h2>
						<p class="mt-6 text-lg leading-8 text-gray-600">
							Collaborate, manage projects, and reach new productivity peaks.
						</p>
						<div class="mt-10 flex items-center justify-center gap-x-6">
							<a
								href="/register"
								class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
							>
								Get started
							</a>
							<a href="/login" class="text-sm font-semibold leading-6 text-gray-900">
								Learn more <span aria-hidden="true">→</span>
							</a>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>
