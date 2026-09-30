<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import * as Field from "$lib/components/ui/field";
	import * as Card from "$lib/components/ui/card";

	let email = $state("");
	let password = $state("");
</script>

<div class="w-screen h-screen flex flex-col items-center justify-center">
	<form method="POST">
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-center">Login</Card.Title>
			</Card.Header>
			<Card.Content>
				<Field.Set class="w-2xs">
					<Field.Group>
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
								placeholder="••••••••"
							/>
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</Card.Content>
			<Card.Footer>
				<Button type="submit">Login</Button>
				<Button href="/register" variant="link">Register</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
