 <script lang="ts">
	import MoonIcon from "phosphor-svelte/lib/MoonIcon";
	import SunIcon from "phosphor-svelte/lib/SunIcon";
	import { resetMode, setMode } from "mode-watcher";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { cn } from "cn";

	type Props = {
		class?: string;
	};

	let {class: className} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(buttonVariants({ variant: "outline", size: "icon" }), className)}
	>
		<SunIcon
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
		/>
		<MoonIcon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setMode("light")}
			>Light</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => setMode("dark")}
			>Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
