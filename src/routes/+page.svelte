<script lang="ts">
  import Tabs from '$components/Tabs.svelte';
  import { checklists, globalChecklists } from '$lib/checklists';
</script>

<Tabs {checklists} {globalChecklists} />
