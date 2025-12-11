<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Trellone - Organize anything, together.</title>
	<meta name="description" content="Free Kanban boards to manage your projects and tasks. Simple, fast, and effective." />
	<meta name="keywords" content="kanban, trello clone, project management, task organizer, productivity, sveltekit" />
	<meta property="og:image" content="/images/og-home.svg" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50">
	<header class="bg-white shadow">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">Trellone</h1>
			<div>
				{#if data.user}
					<a href="/app/boards" class="mr-4 text-sm font-semibold text-gray-900 hover:text-blue-600">
						Dashboard
					</a>
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
					<div class="text-center py-20">
						<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							Welcome back, {data.user.name || 'User'}!
						</h2>
						<p class="mt-6 text-lg leading-8 text-gray-600">
							Ready to get organized?
						</p>
						<div class="mt-10 flex items-center justify-center gap-x-6">
							<a
								href="/app/boards"
								class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
							>
								Go to Dashboard
							</a>
						</div>
					</div>
				</div>
			{:else}
				<div class="px-4 py-6 sm:px-0">
					<div class="text-center py-20">
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
								Log in <span aria-hidden="true">→</span>
							</a>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>