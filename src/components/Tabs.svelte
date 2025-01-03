<script lang="ts">
  import { marked } from 'marked';
  import type { Checklist, EmergencyChecklist, AircraftChecklists, ChecklistItem } from '$lib/types';
  import { onMount } from 'svelte';
  import { emergencyChecklists } from '$lib/checklists'

  export let checklists: AircraftChecklists[];
  let activeAircraft: string | null = null;
  let activeChecklist: Checklist | null = null;
  let markdownContent: string | Promise<string> | null = null;
  let referrer: {file: string, type: string | null} | null = null;
  let globalPublicPages: ChecklistItem[] = checklists.find(checklist => checklist.aircraft === 'carrier')?.checklists || [];
  let emergencyRelatedChecklists: ChecklistItem[] = [];
  let emergenciesShowChecklists: EmergencyChecklist[] = [];
  let secondTime:{ value: number, page: string | null, type: string | null } = { value: 0, page: null, type: null };

  $: hasRelatedChecklists = !!(activeChecklist?.related?.length || (activeChecklist?.showEmergencies && emergencyChecklists.find(item => item.aircraft === activeAircraft)?.checklists?.length) || (activeAircraft && activeChecklist && activeChecklist.type === 'emergency'));

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
    referrer = {file:'aircraft', type: null};
    filterHiddenEmergChecklists();
  };

  const handleChecklistClick = async (checklist: Checklist) => {
    emergencyRelatedChecklists = []
    emergenciesShowChecklists = []

    console.log(`in \nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n checklist:`,checklist,`\n activeCheck`,activeChecklist)
    
    switch (true) {
      case (referrer && referrer.type !== 'page' && referrer.type !== 'emergency-page' && checklist.type !== 'page' && activeChecklist !== null):
        console.log('first case')
        if (secondTime.page !== null && secondTime.value === 2) {
          referrer = {file: secondTime.page, type: secondTime?.type }
          secondTime.value = 0
        } else if (!secondTime.page && secondTime.value === 2) {
          if (activeAircraft !== null) {
           referrer = {file: 'aircraft', type: null }
           secondTime.value = 0
           secondTime.type = null
          } else {
            referrer = null
            secondTime.type = null
            secondTime.value = 0   
          }
        } else {
          referrer = {file: activeChecklist.file, type: activeChecklist.type }
          secondTime.value += 1
        }
        break
      case (referrer && (referrer.type === 'page' || referrer.type === 'emergency-page') && checklist.type !== 'page' && activeChecklist !== null):
        console.log('second case')
        referrer = {file: activeChecklist.file, type: activeChecklist.type }
        secondTime.value += 1
        break
      case (!referrer && secondTime.page !== null && checklist.type === 'global'):
        console.log('no referrer and page to global')
        referrer = {file: secondTime.page, type: secondTime.type}
        secondTime.value += 1
        break
      case (!referrer && secondTime.type !== null && secondTime.page !== null):
        console.log('is this still needed')
        referrer = {file: secondTime.page, type: secondTime.type}
        if (checklist.type === 'page') {
          secondTime = {page: checklist.file, type: checklist.type, value: 0}
        }
        break
      case (referrer && referrer.file === 'aircraft' && secondTime.value === 0 && checklist.type !== 'page'):
        console.log('fuck me')
        secondTime.value += 1
        break
      case (referrer && secondTime.value > 0 && !secondTime.page && checklist.type === 'page'):
        console.log('really?')
        secondTime.page = checklist.file
        secondTime.type = checklist.type
        secondTime.value = 0
        break
      case (referrer && referrer.file === 'aircraft' && checklist.type === 'page' && secondTime.value === 0 && !secondTime.page):
        console.log('what the fuck')
        secondTime.page = checklist.file
        secondTime.type = checklist.type
        break
      case (referrer && checklist.type === 'page' && activeChecklist && activeChecklist.type !== 'page' && activeChecklist.type !== 'emergency-page'):
        secondTime = { value: 0, page: checklist.file, type: checklist.type}
        referrer = {file: activeChecklist.file, type: activeChecklist.type}
        break
      default:
        console.log('default Checklist')
        break
      }

      activeChecklist = checklist
      markdownContent = await fetchMarkdown(checklist.file)
      console.log(`out \nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n checklist:`,checklist,`\n activeCheck:`,activeChecklist)
  };

  const handleEmergencyChecklistClick = async (checklist: EmergencyChecklist) => {

    const related = await filterEmergRelatedChecklists(checklist)

    console.log(`in emerg\nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n checklist:`,checklist,`\n activeCheck`,activeChecklist)

    switch(true) {
      case ( referrer && (referrer.type === 'aircraft' || referrer.type === 'emergency') && checklist.type === 'emergency' && activeChecklist !== null):
        console.log('math part')
        if (secondTime.page !== null && secondTime.value === 2) {
          referrer = {file: secondTime.page, type: secondTime?.type }
          secondTime.page = null
          secondTime.type = null
          secondTime.value = 0
        } else if (!secondTime.page && secondTime.value === 2) {
          secondTime.value = 0
          if (activeChecklist){
            if (activeChecklist !== checklist) referrer = {file: activeChecklist.file, type: activeChecklist.type}
          } else {
            if (activeAircraft !== null) {
              referrer = {file: 'aircraft', type: null }
            } else {
              referrer = null  
            }
          }
        } else {
          referrer = {file: activeChecklist.file, type: activeChecklist.type}
          secondTime.value += 1
        }  
        break
      case (!referrer && secondTime.value === 0 && secondTime.page === null):
        console.log('no ref sectime 0 sectime page null')
        secondTime.value += 1
        break
      case (referrer && referrer.file === 'aircraft' && secondTime.value === 0):
        if (activeChecklist){
          if (activeChecklist !== checklist) referrer = {file: activeChecklist.file, type: activeChecklist.type}
        } 
        console.log('first checklist load')
        if (checklist.type === 'emergency-page') {
          secondTime = {page: checklist.file, type: checklist.type, value: 0}
        } else {
          secondTime.value += 1
        }
        break
      case (referrer && referrer.file === 'aircraft' && secondTime.value === 1 && activeChecklist !== null):
        console.log('second checklist load')
        referrer = {file: activeChecklist.file, type: activeChecklist.type}
        secondTime.value += 1
        break
      case (referrer && secondTime.value > 0 && activeChecklist && activeChecklist !== checklist):
        console.log('emer pages secondTime > 0')
        referrer = {file: activeChecklist.file, type: activeChecklist.type}
        secondTime.value += 1
        break
      default:
        console.log('default Emerg')
        break
    }

    activeChecklist = checklist;
    markdownContent = await fetchMarkdown(checklist.file);
    console.log(`out emerg\nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n checklist:`,checklist,`\n activeCheck`,activeChecklist)
  };

  const handleGlobalPageClick = async (page: Checklist) => {
    secondTime.page = page.file
    secondTime.type = page.type
    secondTime.value = 0
    activeChecklist = page;
    markdownContent = await fetchMarkdown(page.file);
    console.log(`global\nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n activeCheck`,activeChecklist)
  };

  const handleBackClick = async () => {
    emergencyRelatedChecklists = []

    console.log(`in back\nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n activeCheck`,activeChecklist)

    switch (true){
      case (referrer && referrer.file === 'aircraft'):
        console.log('referrer is aircraft')
        if (!activeChecklist) activeAircraft = null
        referrer = null
        activeChecklist = null
        markdownContent = null
        secondTime = { page: null, type: null, value: 0 }; 
        filterHiddenEmergChecklists()
        break
      case (referrer && secondTime.value > 0):
        console.log('referrer and secondTime.value > 0', referrer)
        const referrerChecklist = await findChecklist(referrer.file)
        console.log(referrerChecklist);
        if (referrerChecklist) {
          console.log('found referrer checklist')
          activeChecklist = referrerChecklist;
          markdownContent = await fetchMarkdown(referrerChecklist.file);
          secondTime.value -= 1
          if (secondTime.value === 0){
            if (secondTime.page !== null) {
              console.log('loading secondTime.page')
              activeChecklist = await findChecklist(secondTime.page);
              markdownContent = await fetchMarkdown(secondTime.page);
              filterHiddenEmergChecklists(); 
              if (activeAircraft) {
                referrer = { file: 'aircraft', type: null }
              } else {
                referrer = null; 
              }
            } else {
              console.log('secondTime page null')
              if (activeAircraft) {
                referrer = { file: 'aircraft', type: null }
              } else {
                referrer = null;
              } 
            }
          } else {
            if (referrer.type === 'emergency-page') {
              if (activeAircraft){
                secondTime = { page: referrer.file, type: referrer.type, value: 0 };
                referrer = { file: 'aircraft', type: null }
                filterHiddenEmergChecklists(); 
              } else {
                referrer = null;
              }
            }
          }
        }
        break;
      case (!referrer && secondTime.page !== null && secondTime.value > 0):
        console.log('no ref but secondTime')
        activeChecklist = await findChecklist(secondTime.page);
        markdownContent = await fetchMarkdown(secondTime.page);
        referrer = null; 
        secondTime = { page: null, type: null, value: 0 };
        break
      case (!referrer && secondTime.page !== null && secondTime.value === 0):
        console.log('no ref but secondTime & secondTime  value 0')
        if (activeChecklist && activeChecklist.for) {
          const getList = await findChecklist(activeChecklist.for)
          if (getList) {
            console.log('getList found')
            secondTime = { page: activeChecklist.for, type: getList.type, value: 0 }; 
            activeChecklist = getList; 
            markdownContent = await fetchMarkdown(getList.file); 
            if (activeAircraft) {
              referrer = { file: 'aircraft', type: null }
            } else {
              referrer = null; 
            }
          } else {
            console.log('getList not found')
            if (activeAircraft) {
              referrer = { file: 'aircraft', type: null }
              secondTime = { page: null, type: null, value: 0 }; 
              activeChecklist = null
              markdownContent = null; 
            } else {
              referrer = null;
              activeChecklist = null
              markdownContent = null;
              secondTime = { page: null, type: null, value: 0 };  
            }
          }
        } else {
          if (activeAircraft) {
            referrer = { file: 'aircraft', type: null }
          } else {
            referrer = null; 
          }
        }
        
        break
      case (referrer && referrer.file !== 'aircraft' && secondTime.value === 0 && !secondTime.page):
        activeChecklist = await findChecklist(referrer.file)
        markdownContent = await fetchMarkdown(referrer.file); 
        if (activeAircraft) {
          referrer = { file: 'aircraft', type: null }
        } else {
          referrer = null; 
        }
        break
      default:
        console.log('default back')
        activeAircraft = null
        activeChecklist = null
        markdownContent = null
        referrer = null; 
        secondTime = { page: null, type: null, value: 0 }; 
        break;   
    }    
    console.log(`out back\nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n activeCheck`,activeChecklist)
  };

async function findChecklist(filename: string): Promise<Checklist | null> {
  const combinedChecklists: Checklist[] = [
      ...checklists.flatMap(aircraft => aircraft.checklists),
      ...emergencyChecklists.flatMap(emergency => emergency.checklists)
  ];
  for (const checklist of combinedChecklists) {
    if (checklist.file === filename) {
      return checklist;
    }
  }
  return null;
}

  const filterHiddenEmergChecklists = () => {
    emergenciesShowChecklists = [];
    const properchecklists = emergencyChecklists.find((checklist) => checklist.aircraft === activeAircraft)?.checklists;
    if (properchecklists) {
      const lists = properchecklists.filter((checklist) => !checklist.hidden);
      if (lists) for (let i = 0;i < lists.length; i++) {
        emergenciesShowChecklists.push(lists[i])
      }
    } 
  };

  const filterEmergRelatedChecklists = async (checklist: Checklist) => {
    if (checklist.related){
      for (let i = 0; i < checklist.related.length; i++) {
        const relatedChecklist = await findChecklist(checklist.related[i]);
        if (relatedChecklist && emergencyRelatedChecklists) {
          emergencyRelatedChecklists.push(relatedChecklist);
        }
      }
    }
  }

  onMount(() => {
    // Initially, do not load the first aircraft and checklist
  });

</script>

<div class="container mx-auto p-4">
  {#if !activeAircraft && !activeChecklist}
    <!-- Aircraft selection -->
    <div class="flex space-x-4">
      {#each checklists as checklist}
        {#if checklist.hidden !== true}
        <button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded" on:click={() => handleAircraftClick(checklist.aircraft)}>
          {checklist.aircraft}
        </button>
        {/if}  
      {/each}

      {#each globalPublicPages as globalPage}
        {#if globalPage.hidden !== true && globalPage.type === 'page' && globalPage.showGlobal }
        <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleGlobalPageClick(globalPage)}>
          {globalPage.name}
        </button>
        {/if}  
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

        
        {#each emergenciesShowChecklists as emergencychecklist}
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
      {#if activeChecklist?.type === 'page' && activeChecklist?.for === 'carrier'}
      <!-- Display Carrier Knowledge/Checklists -->
      <div class="flex flex-col space-y-2">
        {#each checklists as checklist}
        {#if checklist.aircraft === 'carrier' }
          {#each checklist.checklists as subchecklist}
          {#if (subchecklist.type === 'global' && !subchecklist.hidden) || (subchecklist.type === 'page' && subchecklist.hidden)}
          <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleChecklistClick(subchecklist)}>
            {subchecklist.name}
          </button>
          {/if}
          {/each}
        {/if}
        {/each}
      </div>
      {:else if (activeChecklist.related || activeChecklist.showGlobal === true || activeChecklist.type === 'emergency' || activeChecklist.showEmergencies || activeChecklist.type === 'emergency-page') }
        <!-- Display related checklists -->
<div class="mt-4">
  {#if hasRelatedChecklists}
    <h2 class="uppercase font-bold mb-2">Related Checklists:</h2>
  {/if}

  <div class="flex flex-col space-y-2">
    {#if activeChecklist.related && activeChecklist.type !== 'emergency'}
      {#each activeChecklist.related as relatedFile (relatedFile)}
        {#each checklists as aircraftChecklists}
          {#each aircraftChecklists.checklists as relatedChecklist}
            {@const match = relatedChecklist.file === relatedFile}
            {#if match}
              <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleChecklistClick(relatedChecklist)}>
                {relatedChecklist.type === 'global' || (relatedChecklist.type === 'page' && relatedChecklist.for !== 'aircraft') ? relatedChecklist.name : `${relatedChecklist.name} (${activeAircraft})`}
              </button>
            {/if}
          {/each}
        {/each}
      {/each}
    {/if}
    {#if activeChecklist.showEmergencies && activeChecklist.type !== 'emergency' }
      {#each (emergencyChecklists.find(item => item.aircraft === activeAircraft)?.checklists || []) as emergencychecklist (emergencychecklist)}
        {#if emergencychecklist !== activeChecklist}
          <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
            {`${emergencychecklist.name} (${activeAircraft})`}
          </button>
        {/if}
      {/each}
    {:else if (activeAircraft && activeChecklist.type === 'emergency')}
      {#if emergencyRelatedChecklists }{#each emergencyRelatedChecklists as relatedchecklist}
      <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded" on:click={() => handleChecklistClick(relatedchecklist)}>
        {relatedchecklist.type === 'global' || (relatedchecklist.type === 'page' && relatedchecklist.for !== 'aircraft') ? relatedchecklist.file : `${relatedchecklist.name} (${activeAircraft})`}
      </button>
      {/each}
      {/if}
      {#each (emergencyChecklists.find(item => item.aircraft === activeAircraft)?.checklists || []) as emergencychecklist (emergencychecklist)}
      {#if emergencychecklist !== activeChecklist && emergencychecklist.type !== 'emergency-page'}
      <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
        {`${emergencychecklist.name} (${activeAircraft})`}
      </button>
      {/if}
      {/each}
    {:else if (activeAircraft && activeChecklist && activeChecklist.type === 'emergency-page')}
    {#each (emergencyChecklists.find(item => item.aircraft === activeAircraft)?.checklists || []) as emergencychecklist (emergencychecklist)}
      {#if emergencychecklist !== activeChecklist}
      <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
        {`${emergencychecklist.name} (${activeAircraft})`}
      </button>
      {/if}
      {/each}
    {/if}
  </div>
</div>
{/if}
</div>
    
  {/if}
</div>