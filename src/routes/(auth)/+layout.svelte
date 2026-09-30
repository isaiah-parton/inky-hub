<script lang="ts">
	import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";

	let { children } = $props();
</script>

<ThemeSwitcher class="absolute left-2 top-2" />
{@render children?.()}
