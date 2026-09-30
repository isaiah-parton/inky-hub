<script lang="ts">
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Item from "$lib/components/ui/item";
	import * as InputGroup from "$lib/components/ui/input-group";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Field from "$lib/components/ui/field";
	import * as Dialog from "$lib/components/ui/dialog";
	import type { PageServerData } from "./$types";
	import WindowsLogoIcon from "phosphor-svelte/lib/WindowsLogoIcon";
	import AppleLogoIcon from "phosphor-svelte/lib/AppleLogoIcon";
	import LinuxLogoIcon from "phosphor-svelte/lib/LinuxLogoIcon";
	import DownloadIcon from "phosphor-svelte/lib/DownloadIcon";
	import CopyIcon from "phosphor-svelte/lib/CopyIcon";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/state";
	import { cn } from "cn";

	let { data }: { data: PageServerData } = $props();

	let windowsCommand = $state("");
	let joinCode = $derived(data.joinCode);

	function generateWindowsCommand() {
		windowsCommand = `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
		Invoke-RestMethod -Uri ${page.url.host + "/install.ps1"} | Invoke-Expression`;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Machines</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<Field.Group class="flex flex-row w-full items-end justify-between">
			<Field.Field class="w-fit">
				<Field.Label>Use this code to connect clients</Field.Label>
				<div class="flex flex-row min-w-full">
					<div
						class="flex-1 border border-r-0 rounded-none rounded-l px-2 font-mono content-center"
					>
						{joinCode.code}
					</div>
					<Button
						variant="outline"
						class="rounded-none rounded-r"
						onclick={() =>
							navigator.clipboard.writeText(joinCode.code)}
					>
						<CopyIcon />
						Copy
					</Button>
				</div>
			</Field.Field>
			<Field.Field class="w-fit">
				<Dialog.Root>
					<Dialog.Trigger
						class={cn(
							buttonVariants({ variant: "outline" }),
							"max-w-fit",
						)}
					>
						<DownloadIcon class="size-5" />
						Download client
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Downloads</Dialog.Title>
						</Dialog.Header>
						<Tabs.Root>
							<Tabs.List class="w-full">
								<Tabs.Trigger value="windows">
									<WindowsLogoIcon
										class="size-5"
										weight="duotone"
									/>
									Windows
								</Tabs.Trigger>
								<Tabs.Trigger value="mac" disabled>
									<AppleLogoIcon
										class="size-5"
										weight="duotone"
									/>
									MacOS
								</Tabs.Trigger>
								<Tabs.Trigger value="linux" disabled>
									<LinuxLogoIcon
										class="size-5"
										weight="duotone"
									/>
									Linux
								</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="windows">
								Run this command in an elevated terminal
								<Input readonly value={""} />
							</Tabs.Content>
						</Tabs.Root>
						<Dialog.Footer></Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</Field.Field>
		</Field.Group>
		<ScrollArea class="min-w-xl min-h-100 border rounded-lg relative">
			<div class="p-4 grid grid-cols-2 w-full h-fit">
				{#each data.machines as machine (machine.id)}
					<Item.Root>
						<Item.Title>{machine.hostname}</Item.Title>
						<Item.Description
							>{machine.printers.length} printers installed</Item.Description
						>
					</Item.Root>
				{/each}
			</div>
			{#if data.machines.length === 0}
				<div
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-md"
				>
					No machines connected
				</div>
			{/if}
		</ScrollArea>
	</Card.Content>
</Card.Root>
