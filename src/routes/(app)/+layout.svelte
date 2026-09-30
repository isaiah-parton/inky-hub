<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import { Button } from "$lib/components/ui/button";
	import PrinterIcon from "phosphor-svelte/lib/PrinterIcon";
	import ComputerTowerIcon from "phosphor-svelte/lib/ComputerTowerIcon";
	import ArrowLeftIcon from "phosphor-svelte/lib/ArrowLeftIcon";
	import UsersThreeIcon from "phosphor-svelte/lib/UsersThreeIcon";
	import { ButtonGroup } from "$lib/components/ui/button-group";

	let { children } = $props();
</script>

<div class="w-screen h-screen flex flex-col gap-2 items-center">
	<div class="border-b p-2 w-full flex gap-2 items-center">
		<Button size="lg" variant="outline" href="/">
			<ArrowLeftIcon class="size-5" />
			Back
		</Button>
		<ButtonGroup>
			<Button size="lg" variant="outline" href="/machines">
				<ComputerTowerIcon class="size-5" weight="duotone" />
				Machines
			</Button>
			<Button size="lg" variant="outline" href="/templates">
				<PrinterIcon class="size-5" weight="duotone" />
				Templates
			</Button>
			<Button size="lg" variant="outline" href="/orgs">
				<UsersThreeIcon class="size-5" weight="duotone" />
				Organizations
			</Button>
		</ButtonGroup>
	</div>
	<div class="flex-1 flex flex-col justify-center items-center">
		{@render children?.()}
	</div>
</div>
