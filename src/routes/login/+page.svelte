<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { errorToast } from '$lib/notifications';
	import { goto } from '$app/navigation';

	let isLogin = true;
</script>

<div class="container">
	{#if $page.data.session}
		<p>Welcome back</p>
	{:else}
		<div class="container">
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				<RadioItem bind:group={isLogin} name="login" value={true}>Log In</RadioItem>
				<RadioItem bind:group={isLogin} name="login" value={false}>Sign Up</RadioItem>
			</RadioGroup>
			{#if isLogin}
				<form
					action="/api/users?/login"
					method="POST"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.status === 200) {
								goto('/');
								return;
							}
							errorToast(result.data);
						};
					}}
				>
					<label class="label" for="username">
						<span>Username</span>
						<input
							class="input input-custom"
							type="text"
							id="username"
							name="username"
							placeholder="Username"
						/>
					</label>

					<label class="label" for="password">
						<span>Password</span>
						<input
							class="input input-custom"
							type="password"
							id="password"
							name="password"
							placeholder="Password"
						/>
					</label>

					<button class="btn variant-filled-primary" type="submit">Log In</button>
				</form>
			{:else}
				<form
					action="/api/users?/create"
					method="POST"
					use:enhance={() => {
						return async ({ result, update }) => {
							console.log(result);
						};
					}}
				>
					<label class="label" for="username">
						<span>Username</span>
						<input
							class="input input-custom"
							type="text"
							id="username"
							name="username"
							placeholder="Username"
						/>
					</label>

					<label class="label" for="password">
						<span>Password</span>
						<input
							class="input input-custom"
							type="password"
							id="password"
							name="password"
							placeholder="Password"
						/>
					</label>

					<button class="btn variant-filled-primary" type="submit">Sign In</button>
				</form>
			{/if}
		</div>
	{/if}
</div>
