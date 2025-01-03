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
  let emergenciesHiddenChecklists: EmergencyChecklist[] = [];
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

  async function findChecklist(filename: string): Promise<Checklist | null> {
    const combinedChecklists: Checklist[] = [
        ...checklists.flatMap(aircraft => aircraft.checklists),
        ...emergencyChecklists.flatMap(aircraft => aircraft.checklists)
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
      if (activeChecklist && activeChecklist.type === 'emergency-page') {
        emergenciesHiddenChecklists = [];
        const hiddenLists = properchecklists.filter((checklist) => checklist.hidden);
        if (hiddenLists) for (let i = 0;i < hiddenLists.length; i++) {
          emergenciesHiddenChecklists.push(hiddenLists[i])
        }
      }
      const lists = properchecklists.filter((checklist) => !checklist.hidden);
      if (lists) for (let i = 0;i < lists.length; i++) {
        emergenciesShowChecklists.push(lists[i])
      }
    }
    return 
  };

  const filterEmergRelatedChecklists = async (checklist: Checklist) => {
    const emergencyRelatedChecklists = [];
    if (checklist.type !== 'emergency' && checklist.type !== 'emergency-page') return
    if (checklist.related){
      for (let i = 0; i < checklist.related.length; i++) {
        const relatedChecklist = await findChecklist(checklist.related[i]);
        if (relatedChecklist && emergencyRelatedChecklists) {
          emergencyRelatedChecklists.push(relatedChecklist);
        }
      }
    }
    return
  }

  const handleAircraftClick = (aircraft: string) => {
    activeAircraft = aircraft;
    activeChecklist = null;
    markdownContent = null;
    referrer = {file:'aircraft', type: null};
    filterHiddenEmergChecklists();
  };

  const handleChecklistClick = async (checklist: Checklist) => {
    console.log(`in \nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n checklist:`,checklist,`\n activeCheck`,activeChecklist)
    emergencyRelatedChecklists = []
    emergenciesShowChecklists = []

    switch (true) {
      case (referrer !== null):
        switch (true){
          case (checklist.type === 'page' && activeChecklist !== null):
            secondTime = {page: checklist.file, type: checklist.type, value: 0}
            referrer = {file: activeChecklist.file, type: activeChecklist.type}
            break
          case ((checklist.type === 'aircraft' || checklist.type === 'global') && activeChecklist !== null):
            switch (true) {
              case (secondTime.value === 2 && secondTime.page !== null):
                referrer = {file: secondTime.page, type: checklist.type} 
                secondTime.value = 1
                break
              case (secondTime.value === 2 && !secondTime.page):
                referrer = {file: activeChecklist.file, type: activeChecklist.type}
                secondTime.value = 1
                break
              default:
                referrer = {file: activeChecklist.file, type: activeChecklist.type}
                secondTime.value += 1
                break
            }
            break
          default:
            console.log('default with ref no activeChecklist')
            secondTime.value += 1
            break
        }
        break
      default:
        switch (true){
          case (activeChecklist && activeChecklist.for === 'carrier'):
            referrer = {file: activeChecklist.file, type: activeChecklist.type}
          break
          default:
            console.log('default no ref not carrier', 'activeChecklist:\n',activeChecklist)
            break
        }
        break
    }
    
    // switch (true) {
    //   case (referrer && referrer.type !== 'page' && referrer.type !== 'emergency-page' && checklist.type !== 'page' && activeChecklist !== null):
    //     if (secondTime.page !== null && secondTime.value === 2) {
    //       referrer = {file: secondTime.page, type: secondTime?.type }
    //       secondTime.value = 0
    //     } else if (!secondTime.page && secondTime.value === 2) {
    //       referrer = {file: activeChecklist.file, type: activeChecklist.type}
    //       secondTime.value = 0
    //     } else {
    //       referrer = {file: activeChecklist.file, type: activeChecklist.type }
    //       secondTime.value += 1
    //     }
    //     break
    //   case (referrer && (referrer.type === 'page' || referrer.type === 'emergency-page') && checklist.type !== 'page' && activeChecklist !== null):
    //     referrer = {file: activeChecklist.file, type: activeChecklist.type }
    //     secondTime.value += 1
    //     break
    //   case (!referrer && secondTime.page !== null && checklist.type === 'global'):
    //     referrer = {file: secondTime.page, type: secondTime.type}
    //     secondTime.value += 1
    //     break
    //   case (!referrer && secondTime.type !== null && secondTime.page !== null):
    //     referrer = {file: secondTime.page, type: secondTime.type}
    //     if (checklist.type === 'page') {
    //       secondTime = {page: checklist.file, type: checklist.type, value: 0}
    //     }
    //     break
    //   case (referrer && referrer.file === 'aircraft' && secondTime.value === 0 && checklist.type !== 'page'):
    //     secondTime.value += 1
    //     break
    //   case (referrer && secondTime.value > 0 && !secondTime.page && checklist.type === 'page'):
    //     secondTime.page = checklist.file
    //     secondTime.type = checklist.type
    //     secondTime.value = 0
    //     break
    //   case (referrer && referrer.file === 'aircraft' && checklist.type === 'page' && secondTime.value === 0 && !secondTime.page):
    //     secondTime.page = checklist.file
    //     secondTime.type = checklist.type
    //     break
    //   case (referrer && checklist.type === 'page' && activeChecklist && activeChecklist.type !== 'page' && activeChecklist.type !== 'emergency-page'):
    //     secondTime = { value: 0, page: checklist.file, type: checklist.type}
    //     referrer = {file: activeChecklist.file, type: activeChecklist.type}
    //     break
    //   default:
    //     break
    //   }

      activeChecklist = checklist
      markdownContent = await fetchMarkdown(checklist.file)
      filterHiddenEmergChecklists()
      console.log(`out \nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n checklist:`,checklist,`\n activeCheck`,activeChecklist)
  };

  const handleEmergencyChecklistClick = async (checklist: EmergencyChecklist) => {
    const related = await filterEmergRelatedChecklists(checklist)

    switch (true) {
      case (referrer !== null):
        switch (true){
          case (checklist.type === 'emergency-page' && activeChecklist !== null):
            secondTime = {page: checklist.file, type: checklist.type, value: 0}
            referrer = {file: activeChecklist.file, type: activeChecklist.type}
            break
          case (checklist.type === 'emergency' && activeChecklist !== null):
            switch (true) {
              case (secondTime.value === 2 && secondTime.page !== null):
                referrer = {file: secondTime.page, type: checklist.type} 
                secondTime.value = 1
                break
              case (secondTime.value === 2 && !secondTime.page):
                referrer = {file: activeChecklist.file, type: activeChecklist.type}
                secondTime.value = 1
                break
              default:
                referrer = {file: activeChecklist.file, type: activeChecklist.type}
                secondTime.value += 1
                break
            }
            break
          default:
            console.log('default with ref no activeChecklist')
            secondTime.value += 1
            break
        }
        break
      default:
        switch (true){
          default:
            console.log('default no ref not carrier', 'activeChecklist:\n',activeChecklist)
            break
        }
        break
    }

    // switch(true) {
    //   case ( referrer && (referrer.type === 'aircraft' || referrer.type === 'emergency'|| referrer.type === 'emergency-page') && checklist.type === 'emergency' && activeChecklist !== null):
    //     if (secondTime.page !== null && secondTime.value === 2) {
    //       referrer = {file: secondTime.page, type: secondTime?.type }
    //       secondTime.page = null
    //       secondTime.type = null
    //       secondTime.value = 0
    //     } else if (!secondTime.page && secondTime.value === 2) {
    //       secondTime.value = 0
    //       if (activeChecklist){
    //         if (activeChecklist !== checklist) referrer = {file: activeChecklist.file, type: activeChecklist.type}
    //       } else {
    //         if (activeAircraft !== null) {
    //           referrer = {file: 'aircraft', type: null }
    //         } else {
    //           referrer = null  
    //         }
    //       }
    //     } else {
    //       referrer = {file: activeChecklist.file, type: activeChecklist.type}
    //       secondTime.value += 1
    //     }  
    //     break
    //   case (!referrer && secondTime.value === 0 && secondTime.page === null):
    //     secondTime.value += 1
    //     break
    //   case (referrer && referrer.file === 'aircraft' && secondTime.value === 0):
    //     if (activeChecklist){
    //       if (activeChecklist !== checklist) referrer = {file: activeChecklist.file, type: activeChecklist.type}
    //     } 
    //     if (checklist.type === 'emergency-page') {
    //       secondTime = {page: checklist.file, type: checklist.type, value: 0}
    //     } else {
    //       secondTime.value += 1
    //     }
    //     break
    //   case (referrer && referrer.file === 'aircraft' && secondTime.value === 1 && activeChecklist !== null):
    //     referrer = {file: activeChecklist.file, type: activeChecklist.type}
    //     secondTime.value += 1
    //     break
    //   case (referrer && secondTime.value > 0 && activeChecklist && activeChecklist !== checklist):
    //     referrer = {file: activeChecklist.file, type: activeChecklist.type}
    //     secondTime.value += 1
    //     break
    //   default:
    //     break
    // }

    activeChecklist = checklist;
    markdownContent = await fetchMarkdown(checklist.file);
    filterHiddenEmergChecklists()
  };

  const handleGlobalPageClick = async (page: Checklist) => {
    secondTime.page = page.file
    secondTime.type = page.type
    secondTime.value = 0
    activeChecklist = page;
    markdownContent = await fetchMarkdown(page.file);
    filterHiddenEmergChecklists()
  };

  const handleBackClick = async () => {
    console.log(`in back\nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n activeCheck`,activeChecklist)
    emergencyRelatedChecklists = []

    switch (true) {
      case (!referrer):
        activeAircraft = null
        referrer = null
        activeChecklist = null
        markdownContent = null
        secondTime = { page: null, type: null, value: 0 }; 
        filterHiddenEmergChecklists()
        break
      case (referrer && secondTime.value === 2):
        switch (true){
          case (referrer.file === 'aircraft' && activeAircraft !== null):
            activeChecklist = null
            markdownContent = null
            secondTime = { page: null, type: null, value: 0 };
            filterHiddenEmergChecklists()
            break
          case (referrer.type === 'page' || referrer.type === 'emergency-page'):
            switch (true) {
              case (secondTime.page !== null):
                activeChecklist = await findChecklist(referrer.file)
                markdownContent = await fetchMarkdown(referrer.file)
                referrer = {file: secondTime.page, type: secondTime.page}
                secondTime.value -= 1
                filterHiddenEmergChecklists()
                activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
                break
                }
              break
          default:
            activeChecklist = await findChecklist(referrer.file)
            markdownContent = await fetchMarkdown(referrer.file)
            activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
            secondTime.value -= 1
            filterHiddenEmergChecklists()
            activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
            break
        }
        break
      case (referrer && secondTime.value === 1):
        switch (true){
          case (referrer.file === 'aircraft' && activeAircraft !== null):
            activeChecklist = null
            markdownContent = null
            secondTime = { page: null, type: null, value: 0 };
            filterHiddenEmergChecklists()
            break
          case (referrer.type === 'page' || referrer.type === 'emergency-page'):
            switch (true) {
              case (secondTime.page !== null && secondTime.page !== referrer.file):
                activeChecklist = await findChecklist(referrer.file)
                markdownContent = await fetchMarkdown(referrer.file)
                referrer = {file: secondTime.page, type: secondTime.type}
                secondTime.value -= 1
                filterHiddenEmergChecklists()
                activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
                break
              case (secondTime.page !== null && secondTime.page === referrer.file):
                const theList = await findChecklist(referrer.file)
                if (theList) {
                  console.log('fired')
                  switch (true) {
                    case (theList.for !== undefined):
                      if (theList.type === 'page' || theList.type === 'emergency-page'){ 
                        const forList = await findChecklist(theList.for)
                        if (forList) {
                          referrer = {file: forList.file, type: forList.type}
                        } else {
                          activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
                        }
                        secondTime = {page: theList.file, type: theList.type, value: 0}
                        activeChecklist = theList
                        markdownContent = await fetchMarkdown(theList.file)
                        filterHiddenEmergChecklists()
                        activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
                      } else if (theList.for === 'carrier') {
                        secondTime = {page: theList.file, type: theList.type, value: 0}
                        activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
                        activeChecklist = theList
                        markdownContent = await fetchMarkdown(theList.file)
                        filterHiddenEmergChecklists()
                        activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
                      } else {
                        console.log('wtf else?')
                      }
                      break
                    default:
                      console.log('here right?')
                      console.log(activeChecklist && activeChecklist.for !== undefined)
                      activeChecklist = await findChecklist(referrer.file)
                      markdownContent = await fetchMarkdown(referrer.file)
                      activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
                      secondTime.value -= 1
                      filterHiddenEmergChecklists()
                      activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
                      break
                  }
                }
                break
              default:
                break
            }
            break
          case (referrer.type === 'aircraft' && secondTime.page === null):
            activeChecklist = await findChecklist(referrer.file)
            markdownContent = await fetchMarkdown(referrer.file)
            activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
            secondTime.value -= 1
            filterHiddenEmergChecklists()
            activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
            break
          default:
            console.log('default somewhere')
            activeChecklist = await findChecklist(referrer.file)
            markdownContent = await fetchMarkdown(referrer.file)
            activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
            secondTime.value -= 1
            filterHiddenEmergChecklists()
            activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
            break
        }
        break
      case (referrer && secondTime.value === 0):
        switch (true) {
          case (referrer.type === 'page' || referrer.type === 'emergency-page'):
            switch (true) {
              case (secondTime.page !== null):
                activeChecklist = await findChecklist(referrer.file)
                markdownContent = await fetchMarkdown(referrer.file)
                switch (true) {
                  case (secondTime.page === referrer.file):
                    activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
                    break
                  default:
                    referrer = {file: secondTime.page, type: secondTime.type}
                    activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
                    break
                }
                filterHiddenEmergChecklists()
                activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
                break
              case (secondTime.page === null && activeChecklist && activeChecklist.for !== undefined ):
                console.log('BOOM')
                break
              default:
                activeChecklist = await findChecklist(referrer.file)
                markdownContent = await fetchMarkdown(referrer.file)
                activeAircraft ? referrer = {file: 'aircraft', type: null} : referrer = null
                filterHiddenEmergChecklists()
                activeChecklist && (activeChecklist.type === 'emergency' || activeChecklist.type === 'emergency-page') ? filterEmergRelatedChecklists(activeChecklist) : null
                break
            }
            break
          case (referrer.file === 'aircraft' && activeChecklist !== null):
            activeChecklist = null
            markdownContent = null
            secondTime = {page: null, type: null, value: 0}
            filterHiddenEmergChecklists()
            break
          default:
            activeAircraft = null
            activeChecklist = null
            markdownContent = null
            secondTime = {page: null, type: null, value: 0}
            break
        }
        break
      default:
        console.log('default back :(')
    }

    // switch (true){
    //   case (referrer && referrer.file === 'aircraft'):
    //     if (!activeChecklist) activeAircraft = null
    //     activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //     activeChecklist = null
    //     markdownContent = null
    //     secondTime = { page: null, type: null, value: 0 }; 
    //     filterHiddenEmergChecklists()
    //     break
    //   case (referrer && secondTime.value > 0):
    //     const oldChecklist = activeChecklist
    //     const referrerChecklist = await findChecklist(referrer.file)

    //     if (referrerChecklist) {
    //       activeChecklist = referrerChecklist;
    //       markdownContent = await fetchMarkdown(referrerChecklist.file);
    //       filterHiddenEmergChecklists();
    //       filterEmergRelatedChecklists(activeChecklist)
    //       secondTime.value -= 1
    //       if (secondTime.value === 0){
    //         if (activeChecklist.for !== undefined && secondTime.page !== null) {
    //           console.log('mf')
    //           const getList = await findChecklist(activeChecklist.for)
    //           if (getList) {
    //             if (getList.type === 'page' || getList.type === 'emergency-page') {
    //             referrer = { file: getList.file, type: getList.type }
    //             secondTime = { page: getList.file, type: getList.type, value: 0 }
    //             } else {
    //               activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //               secondTime = {page: null, type: null, value: 0  };
    //             }
    //           } else {
    //             activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //             secondTime.value = 0; 
    //           }
    //         } else if (activeChecklist.for === undefined && secondTime.page === null) {
    //           activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //         }
    //       } else if  (!secondTime.page && secondTime.value === 1) {
    //           secondTime.value = 0;
    //           activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //       } else if (secondTime.page !== null && secondTime.value === 1 && secondTime.type === 'emergency-page') {
    //         referrer = {file: secondTime.page, type: secondTime.type};
    //         secondTime.value = 0;
    //       } else{
    //         if (referrer.type === 'emergency-page' || referrer.type === 'page') {
    //           if (activeAircraft){
    //             secondTime = { page: referrer.file, type: referrer.type, value: 0 };
    //             referrer = { file: 'aircraft', type: null }
    //           } else {
    //             referrer = null;
    //           }
    //         } else {
    //           if (secondTime.page !== null && referrer.file === oldChecklist?.file ) {
    //             activeAircraft ? referrer = { file: 'aircraft', type: null } : referrer = null;
    //             activeChecklist = await findChecklist(secondTime.page)
    //             markdownContent = await fetchMarkdown(secondTime.page);
    //             filterHiddenEmergChecklists();
    //             if (activeChecklist) filterEmergRelatedChecklists(activeChecklist)
    //           } else if (secondTime.page !== null){
    //             referrer = {file: secondTime.page, type: secondTime.type};
    //             secondTime = { page: null, type: null, value: 0 };
    //           } else {
    //             referrer = null;
    //           }
    //         }
    //       }
    //     }
    //     break;
    //   case (!referrer && secondTime.page !== null && secondTime.value > 0):
    //     activeChecklist = await findChecklist(secondTime.page);
    //     markdownContent = await fetchMarkdown(secondTime.page);
    //     filterHiddenEmergChecklists();
    //     if (activeChecklist) filterEmergRelatedChecklists(activeChecklist) 
    //     referrer = null; 
    //     secondTime = { page: null, type: null, value: 0 };
    //     break
    //   case (!referrer && secondTime.page !== null && secondTime.value === 0):
    //     if (activeChecklist && activeChecklist.for) {
    //       const getList = await findChecklist(activeChecklist.for)
    //       if (getList) {
    //         secondTime = { page: activeChecklist.for, type: getList.type, value: 0 }; 
    //         activeChecklist = getList; 
    //         markdownContent = await fetchMarkdown(getList.file);
    //         filterEmergRelatedChecklists(activeChecklist) 
    //         activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //       } else {
    //         if (activeAircraft) {
    //           referrer = { file: 'aircraft', type: null }
    //           secondTime = { page: null, type: null, value: 0 }; 
    //           activeChecklist = null
    //           markdownContent = null; 
    //         } else {
    //           referrer = null;
    //           activeChecklist = null
    //           markdownContent = null;
    //           secondTime = { page: null, type: null, value: 0 };  
    //         }
    //       }
    //     } else {
    //       activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //     }
    //     filterHiddenEmergChecklists();
    //     break
    //   case (referrer && referrer.file !== 'aircraft' && secondTime.value === 0 && !secondTime.page):
    //     activeChecklist = await findChecklist(referrer.file)
    //     markdownContent = await fetchMarkdown(referrer.file); 
    //     filterHiddenEmergChecklists();
    //     if (activeChecklist) filterEmergRelatedChecklists(activeChecklist)
    //     activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //     break
    //   case (referrer && activeChecklist && secondTime.page === activeChecklist.file && secondTime.value === 0):
    //     console.log('shit for brains')
    //     if (activeChecklist.for !== undefined) {
    //       const getList = await findChecklist(activeChecklist.for)
    //       if (getList) {
    //         activeChecklist = await findChecklist(referrer.file)
    //         markdownContent = await fetchMarkdown(referrer.file);
    //         if (activeChecklist && activeChecklist.for === 'carrier') {
    //           activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //           if (referrer) secondTime =  {page: referrer.file, type: referrer.type, value: 0 }
    //           break
    //         } else {
    //           referrer = { file: getList.file, type: getList.type  }
    //           if (getList.type === 'page' || getList.type === 'emergency-page') {
    //             secondTime = { page: getList.file, type: getList.type, value: 0}
    //           } else if (getList.type === 'carrier') {
    //             activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //             secondTime = { page: null, type: null, value: 0}
    //           } else {
    //             secondTime = { page: null, type: null, value: 0}
    //           }
    //         }
    //         filterHiddenEmergChecklists();
    //         if (activeChecklist) filterEmergRelatedChecklists(activeChecklist)
    //       } else if (activeChecklist && activeChecklist.for === 'aircraft') {
    //         activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //         secondTime = { page: null, type: null, value: 0 }
    //         activeChecklist = null
    //         markdownContent = null
    //         filterHiddenEmergChecklists();
    //       }
    //     } else {
    //       activeChecklist = await findChecklist(referrer.file)
    //       markdownContent = await fetchMarkdown(referrer.file);
    //       secondTime = { page: null, type: null, value: 0 }; 
    //       filterHiddenEmergChecklists();
    //       if (activeChecklist) filterEmergRelatedChecklists(activeChecklist)
    //       activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //     }
    //     break
    //   case (referrer && secondTime.page !== null && secondTime.value === 0 && secondTime.page === referrer.file):
    //     activeChecklist = await findChecklist(referrer.file);
    //     markdownContent = await fetchMarkdown(referrer.file);
    //     filterHiddenEmergChecklists();
    //     if (activeChecklist) {
    //       filterEmergRelatedChecklists(activeChecklist)
    //       if (activeChecklist.for !== undefined) {
    //         const getList = await findChecklist(activeChecklist.for);
    //         if (getList) {
    //           referrer = { file: getList.file, type: getList.type }
    //         } else {
    //           referrer = null; 
    //           secondTime = { page: null, type: null, value: 0 }; 
    //         }
    //       }
    //     }
    //     activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //     break
    //   case (!referrer && !secondTime.page && activeChecklist !== null):
    //     activeChecklist = null
    //     markdownContent = null
    //     activeAircraft ? referrer = { file: 'aircraft', type: null }  : referrer = null
    //     secondTime = { page: null, type: null, value: 0 };
    //     filterHiddenEmergChecklists() 
    //     break
    //   default: 
    //     activeAircraft = null
    //     activeChecklist = null
    //     markdownContent = null
    //     referrer = null; 
    //     secondTime = { page: null, type: null, value: 0 };
    //     filterHiddenEmergChecklists()
    //     break;   
    // }
    console.log(`out back\nreferrer:`,referrer,`\n secondTime:`,secondTime,`\n activeCheck`,activeChecklist)
  };

  onMount(() => {
    // Initially, do not load the first aircraft and checklist
  });

</script>

<div class="container mx-auto p-4">
  {#if !activeAircraft && !activeChecklist}
    <!-- Aircraft selection -->
    <div class="flex space-x-4">
      <div class="grid grid-cols-3 gap-4">
        {#each checklists as checklist}
        {#if checklist.hidden !== true}
        <button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded h-70" on:click={() => handleAircraftClick(checklist.aircraft)}>
          {checklist.aircraft}
        </button>
        {/if}  
        {/each}
        
        {#each globalPublicPages as globalPage}
        {#if globalPage.hidden !== true && globalPage.type === 'page' && globalPage.showGlobal }
        <button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded h-70" on:click={() => handleGlobalPageClick(globalPage)}>
          {globalPage.name}
        </button>
        {/if}  
        {/each}
      </div>
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
            {#each emergenciesShowChecklists as emergencychecklist (emergencychecklist)}
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
            {#each emergenciesShowChecklists as emergencychecklist (emergencychecklist)}
              {#if emergencychecklist !== activeChecklist && emergencychecklist.type !== 'emergency-page'}
              <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
                {`${emergencychecklist.name} (${activeAircraft})`}
              </button>
              {/if}
            {/each}
            {#each emergenciesHiddenChecklists as emergencychecklist (emergencychecklist)}
              {#if emergencychecklist !== activeChecklist}
                <button class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded" on:click={() => handleEmergencyChecklistClick(emergencychecklist)}>
                  {`${emergencychecklist.name} (${activeAircraft})`}
                </button>
              {/if}
            {/each}
          {:else if (activeAircraft && activeChecklist && activeChecklist.type === 'emergency-page')}
            {#each emergenciesHiddenChecklists as emergencychecklist (emergencychecklist)}
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