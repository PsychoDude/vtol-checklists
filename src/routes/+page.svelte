<script lang="ts">
  import Tabs from '$components/Tabs.svelte';
  import { checklists, globalCarrierChecklists } from '$lib/checklists';
</script>

<Tabs {checklists} {globalCarrierChecklists} />
