<script lang="ts">
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Item from "$lib/components/ui/item";
	import * as InputGroup from "$lib/components/ui/input-group";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Field from "$lib/components/ui/field";
	import * as Dialog from "$lib/components/ui/dialog";
	import type { PageServerData } from "./$types";
	import PlusIcon from "phosphor-svelte/lib/PlusIcon";
	import { buttonVariants, Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { page } from "$app/state";
	import { cn } from "cn";
	import { type Org } from "$lib/server/db/schema";
	import { invalidate, invalidateAll } from "$app/navigation";
	import { toast } from "svelte-sonner";

	let { data }: { data: PageServerData } = $props();

	let windowsCommand = $state("");

	function generateWindowsCommand() {
		windowsCommand = `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
		Invoke-RestMethod -Uri ${page.url.host + "/install.ps1"} | Invoke-Expression`;
	}

	type NewOrg = {
		name: string;
	};

	let newOrg = $state<NewOrg | null>(null);

	let creating = $state(false);
	let switching = $state(false);
	let valid = $derived(newOrg && newOrg.name.length > 2);

	async function createOrg(value: NewOrg) {
		const response = await fetch("/api/orgs", {
			method: "POST",
			body: JSON.stringify({
				name: value.name,
			}),
		});
		if (response.ok) {
			invalidate("orgs");
		} else {
			const data = await response.json();
			throw Error(data.message);
		}
	}

	async function switchOrg(id: string) {
		const response = await fetch("/api/auth/switch-org", {
			method: "POST",
			body: JSON.stringify({
				orgId: id,
			}),
		});
		if (response.ok) {
			invalidateAll();
		} else {
			const data = await response.json();
			throw Error(data.message);
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Organizations</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="flex flex-row w-full gap-2 items-end justify-between">
			<Dialog.Root
				onOpenChange={(open) => {
					if (open) {
						newOrg = {
							name: "",
						};
					}
				}}
			>
				<Dialog.Trigger
					class={cn(buttonVariants({ variant: "outline" }), "w-fit")}
				>
					<PlusIcon class="size-5" />
					Create Organization
				</Dialog.Trigger>
				<Dialog.Content>
					{#if newOrg}
						<Dialog.Header>
							<Dialog.Title>Create Organization</Dialog.Title>
							<Dialog.Description
								>You will be the owner</Dialog.Description
							>
						</Dialog.Header>
						<Field.Set>
							<Field.Group>
								<Field.Field>
									<Field.Label>Name</Field.Label>
									<Input bind:value={newOrg.name} />
								</Field.Field>
							</Field.Group>
						</Field.Set>
						<Dialog.Footer>
							<Button
								disabled={creating || !valid}
								onclick={() => {
									creating = true;
									createOrg(newOrg!)
										.catch((e) => toast.error(e.message))
										.finally(() => (creating = false));
								}}>Create</Button
							>
						</Dialog.Footer>
					{/if}
				</Dialog.Content>
			</Dialog.Root>
		</div>
		<ScrollArea
			class="min-w-xl min-h-100 border rounded-lg"
		>
			<div class="w-full h-fit p-4 grid grid-cols-2 gap-4">
				{#each data.orgs as org (org.id)}
					<Item.Root
						variant="muted"
						class={data.currentOrgId === org.id
							? "border-primary border-2"
							: ""}
					>
						<Item.Content>
							<Item.Title>{org.name}</Item.Title>
							<Item.Description>You are {org.role}</Item.Description>
						</Item.Content>
						<Item.Actions>
							<Button
								variant="outline"
								size="sm"
								disabled={switching}
								onclick={() => {
									switching = true;
									switchOrg(org.id)
										.catch((e) => toast.error(e.message))
										.finally(() => (switching = false));
								}}>Login</Button
							>
						</Item.Actions>
					</Item.Root>
				{:else}
					<div class="align-middle text-center place-self-center">
						You're not a part of any organizations yet...
					</div>
				{/each}
			</div>
		</ScrollArea>
	</Card.Content>
</Card.Root>
