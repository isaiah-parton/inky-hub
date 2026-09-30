<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
    import type { PageData } from "./$types";

	let {data}: {data: PageData} = $props();
</script>

<div class="w-screen h-screen flex flex-col items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>
				Welcome to Inky
			</Card.Title>
			<Card.Description>
				You're logged in as <span class="font-bold">{data.user.name}</span>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Button href="/machines">Go to dashboard</Button>
			<Button href="/logout" variant="link">Logout</Button>
		</Card.Content>
	</Card.Root>
</div>
