<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import { Button } from "$lib/components/ui/button";
	import PrinterIcon from "phosphor-svelte/lib/PrinterIcon";
	import ComputerTowerIcon from "phosphor-svelte/lib/ComputerTowerIcon";
	import { ButtonGroup } from "$lib/components/ui/button-group";

	let { children } = $props();
</script>

<div class="w-screen h-screen flex flex-col gap-2 items-center">
	<div class="border-b p-2 w-full flex gap-2 items-center">
		<ButtonGroup>
			<Button size="lg" variant="outline" href="/machines">
				<ComputerTowerIcon class="size-5" />
				Machines
			</Button>
			<Button size="lg" variant="outline" href="/templates">
				<PrinterIcon class="size-5" />
				Templates
			</Button>
		</ButtonGroup>
	</div>
	<div class="flex-1 flex flex-col justify-center items-center">
		{@render children?.()}
	</div>
</div>
