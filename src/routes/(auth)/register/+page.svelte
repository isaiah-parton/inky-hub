<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import * as Field from "$lib/components/ui/field";
	import * as Card from "$lib/components/ui/card";

	let username = $state("");
	let email = $state("");
	let password = $state("");
	let passwordAgain = $state("");

	const emailRe =
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

	let valid = $derived(
		emailRe.test(email) &&
			password.length > 3 &&
			password === passwordAgain &&
			username.length > 3,
	);
</script>

<div class="w-screen h-screen flex flex-col items-center justify-center">
	<form method="POST">
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-center">Create an account</Card.Title>
			</Card.Header>
			<Card.Content>
				<Field.Set class="w-2xs">
					<Field.Group>
						<Field.Field>
							<Field.Label>Username</Field.Label>
							<Input
								name="username"
								bind:value={username}
								placeholder="Printer Enthusiast"
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label>Email</Field.Label>
							<Input
								name="email"
								bind:value={email}
								placeholder="user@example.com"
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label>Password</Field.Label>
							<Input
								name="password"
								bind:value={password}
								type="password"
								placeholder="••••••••"
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label>Repeat password</Field.Label>
							<Input bind:value={passwordAgain} type="password" />
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</Card.Content>
			<Card.Footer>
				<Button type="submit" disabled={!valid}>Register</Button>
				<Button href="/login" variant="link">Login instead</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
