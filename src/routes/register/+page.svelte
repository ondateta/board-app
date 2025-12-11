<script lang="ts">
	import type { ActionData } from './$types';

    let { form } = $props();
</script>

<svelte:head>
	<title>Sign Up - Trellone</title>
	<meta name="description" content="Create a free account to start organizing your life." />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				Create your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Or
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
					sign in to your existing account
				</a>
			</p>
		</div>
		<form class="mt-8 space-y-6" method="POST">
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="name" class="sr-only">Name</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
						placeholder="Full Name"
						value={form?.data?.name ?? ''}
					/>
				</div>
				<div>
					<label for="email-address" class="sr-only">Email address</label>
					<input
						id="email-address"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
						placeholder="Email address"
						value={form?.data?.email ?? ''}
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
						placeholder="Password"
					/>
				</div>
			</div>

			{#if form?.errors}
				<div class="text-sm text-red-600">
					{#each Object.values(form.errors) as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Sign up
				</button>
			</div>
		</form>
	</div>
</div>