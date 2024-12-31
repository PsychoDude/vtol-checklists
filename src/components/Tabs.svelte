<script lang="ts">
  import { marked } from 'marked';
  import type { Checklist, EmergencyChecklist } from '$lib/types';
  import { onMount } from 'svelte';
  import { emergencyChecklists, globalPages } from '$lib/checklists'


  export let checklists: { aircraft: string; checklists: Checklist[] }[] = [] as any;
  export let globalCarrierChecklists: Checklist[] = [] as any;


  let activeAircraft: string | null = null;
  let activeChecklist: Checklist | null = null;
  let markdownContent: string | Promise<string> | null = null;
  let referrer: string | null = null; 

const fetchMarkdown = async (file: string): Promise<string> => { 
    try {
      const response = await fetch(`/checklists/${file}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
      }
      const text = await response.text();
      let html = await marked(text);
      html = html.replace(/<img([^>]*?)>/g, (match, attributes) => {
        return `<img ${attributes} class="w-full" />`;
      });
      return html;
    } catch (error) {
      console.error('Error fetching markdown:', error);
      return '<p>Failed to load checklist.</p>';
    }
};

  const handleAircraftClick = (aircraft: string) => {
    activeAircraft = aircraft;
    activeChecklist = null;
    markdownContent = null;
    referrer = null;
  };

  const handleChecklistClick = async (checklist: Checklist) => {
    referrer = activeChecklist?.file || null
    activeChecklist = checklist;
    markdownContent = await fetchMarkdown(checklist.file);
  };

  const handleGlobalChecklistClick = async (checklist: Checklist) => {
    switch (true) {
      case (activeChecklist?.type === 'page' && activeAircraft === null):
        referrer = activeChecklist?.file || null
        break;
      case (activeChecklist?.type !== 'global' && activeAircraft !== null):
        referrer = activeChecklist?.file || null
        break;
      default:
        break;
    }
    
    activeChecklist = checklist;
    markdownContent = await fetchMarkdown(checklist.file);
  };

  const handleEmergencyChecklistClick = async (checklist: EmergencyChecklist) => {
    activeChecklist = checklist;
    markdownContent = await fetchMarkdown(checklist.file);
  };

  const handleGlobalPageClick = async (page: Checklist) => {
    activeChecklist = page;
    console.log(page)
    markdownContent = await fetchMarkdown(page.file);
  };

  const handleBackClick = async () => {
    console.log(referrer, activeChecklist?.file)
      if (referrer && referrer === activeChecklist?.file) {
      console.log('same referrer')
      referrer = null;
      activeChecklist = null;
    } else if (activeChecklist && referrer && activeAircraft === null) {
      console.log('different referrer')
      activeChecklist = findChecklist(referrer)
      markdownContent = await fetchMarkdown(referrer);
    } else  if (referrer && referrer !== activeChecklist?.name) {
      activeChecklist = findChecklist(referrer)
      markdownContent = await fetchMarkdown(referrer);
    } else{
      activeAircraft = null;
      activeChecklist = null;
      referrer = null;
    }
  };

  async function goBack(referrer: string | null) {
    if (referrer !== null) {
      activeChecklist = findChecklist(referrer)
      markdownContent = await fetchMarkdown(referrer);
    } else {
      activeAircraft = null;
    }
  }

function findChecklist(filename: string): Checklist | null {
  const fixedGlobalChecklists = { aircraft: 'All', checklists: globalCarrierChecklists };
  const fixedGlobalPages = { aircraft: 'All', checklists: globalPages };
  const allChecklists = checklists.concat(fixedGlobalChecklists).concat(fixedGlobalPages);

  for (const aircraftChecklists of allChecklists) { //Iterate through the array of objects
    for (const checklist of aircraftChecklists.checklists) { //Access checklists property of each object
      if (checklist.file === filename) {
        return checklist;
      }
    }
  }
  return null;
}

  function isGlobalChecklist(checklist: Checklist): checklist is Checklist {
    return (checklist as Checklist).type === 'global';
  }

  onMount(() => {
    // Initially, do not load the first aircraft and checklist
  });

</script>

<div class="container mx-auto p-4">
  {#if !activeAircraft && !activeChecklist}
    <!-- Aircraft selection -->
    <div class="flex space-x-4">
      {#each checklists as { aircraft }}
        <button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded" on:click={() => handleAircraftClick(aircraft)}>
          {aircraft}
        </button>
      {/each}

      {#each globalPages as globalpage}
        <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleGlobalPageClick(globalpage)}>
          {globalpage.name}
        </button>  
      {/each}
    </div>
  {:else if !activeChecklist}
    <!-- Checklist selection for the chosen aircraft -->
    <div class="mb-4">
      <button class="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded mb-4" on:click={handleBackClick}>
        Back to Aircraft
      </button>
      <h2 class="text-2xl font-bold mb-2">{activeAircraft} Checklists</h2>
      <div class="flex flex-col space-y-2">
        {#each checklists.find(item => item.aircraft === activeAircraft)?.checklists || [] as checklist}
        {#if checklist.hidden !== true}
          <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleChecklistClick(checklist)}>
            {checklist.name}
          </button>
          {/if}
        {/each}

        
        {#each (emergencyChecklists.find(item => item.aircraft === activeAircraft)?.checklists || []) as emergencychecklist}
        <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
            {emergencychecklist.name}
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Display of the selected checklist -->
    <div class="mb-4">
      <button class="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded mb-4" on:click={handleBackClick}>
        Back to Checklists
      </button>
      <h2 class="text-2xl font-bold mb-2">{activeChecklist.name}</h2>
      <div class="space-y-4">{@html markdownContent}</div>
      {#if activeChecklist.related !== undefined || (isGlobalChecklist(activeChecklist) && activeAircraft) || activeChecklist.showGlobal === true || activeChecklist.type === 'emergency' || activeChecklist.showEmergencies}
        <!-- Display related checklists -->

        <div class="mt-4">
          <h3 class="uppercase font-bold mb-3">Related Checklists:</h3>

          <div class="flex flex-col space-y-2">
            {#if activeChecklist.related}
             
            {#each activeChecklist.related as relatedFile}
            
            {#each checklists.find(c => c.aircraft === activeAircraft)?.checklists || [] as relatedChecklist}
            
            {#if relatedChecklist.file === relatedFile}
            
            <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleChecklistClick(relatedChecklist)}>
              {relatedChecklist.name}
            </button>
            
            {/if}
            {/each}
            {/each}
            {/if}

            {#if isGlobalChecklist(activeChecklist) && activeAircraft && referrer !== null}
                <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => goBack(referrer)}>
                  Previous {activeAircraft} Checklist
                </button>
            {/if}
            
            {#each globalCarrierChecklists as checklist}
              {#if activeChecklist?.showGlobal === true || (isGlobalChecklist(activeChecklist)&& checklist !== activeChecklist && !checklist.related ) }
              <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleGlobalChecklistClick(checklist)}>
                {checklist.name}
              </button>
              {/if}
            {/each}

            {#if activeChecklist.type === 'emergency'}
              {#each (emergencyChecklists.find(item => item.aircraft === activeAircraft)?.checklists || []) as emergencychecklist}
                {#if emergencychecklist !== activeChecklist}
                <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
                  {emergencychecklist.name}
                </button>
                {/if}
              {/each}
            {:else if activeAircraft && activeChecklist.showEmergencies}
            {#each (emergencyChecklists.find(item => item.aircraft === activeAircraft)?.checklists || []) as emergencychecklist}
              <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
                {emergencychecklist.name}
              </button>
            {/each}
            {/if}
          </div>
        </div>
      {:else if activeChecklist?.type === 'page' && activeChecklist?.for === 'carrier'}
      <div class="flex flex-col space-y-2">
        {#each globalCarrierChecklists as checklist}
        <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleGlobalChecklistClick(checklist)}>
          {checklist.name}
        </button>
        {/each}
      </div>
      {/if}
    </div>
    
  {/if}
</div>