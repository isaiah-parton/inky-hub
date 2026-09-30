<script lang="ts">
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Item from "$lib/components/ui/item";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Dialog from "$lib/components/ui/dialog";
	import type { PageServerData } from "./$types";
	import WindowsLogoIcon from "phosphor-svelte/lib/WindowsLogoIcon";
	import AppleLogoIcon from "phosphor-svelte/lib/AppleLogoIcon";
	import LinuxLogoIcon from "phosphor-svelte/lib/LinuxLogoIcon";
	import { buttonVariants } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { page } from "$app/state";

	let { data }: { data: PageServerData } = $props();

	let windowsCommand = $state("");

	function generateWindowsCommand() {
		windowsCommand = `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
		Invoke-RestMethod -Uri ${page.url.host + "/install.ps1"} | Invoke-Expression`
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Machines</Card.Title>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: "outline" })}
				>Add machine</Dialog.Trigger
			>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Add machine</Dialog.Title>
				</Dialog.Header>
				<Tabs.Root>
					<Tabs.List class="w-full">
						<Tabs.Trigger value="windows">
							<WindowsLogoIcon class="size-5" weight="duotone" />
							Windows
						</Tabs.Trigger>
						<Tabs.Trigger value="mac" disabled>
							<AppleLogoIcon class="size-5" weight="duotone" />
							MacOS
						</Tabs.Trigger>
						<Tabs.Trigger value="linux" disabled>
							<LinuxLogoIcon class="size-5" weight="duotone" />
							Linux
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="windows">
						Run this command in an elevated terminal
						<Input readonly value={""}/>
					</Tabs.Content>
				</Tabs.Root>
				<Dialog.Footer></Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Card.Header>
	<Card.Content>
		<ScrollArea class="min-w-xl min-h-100 border rounded-lg">
			{#each data.machines as machine (machine.id)}
				<Item.Root>
					<Item.Title>{machine.hostname}</Item.Title>
					<Item.Description
						>{machine.printers.length} printers installed</Item.Description
					>
				</Item.Root>
			{:else}
				<div class="align-middle text-center place-self-center">
					No machines connected yet...
				</div>
			{/each}
		</ScrollArea>
	</Card.Content>
</Card.Root>
