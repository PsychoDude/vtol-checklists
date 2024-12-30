import { c as create_ssr_component, e as each, v as validate_component } from "../../chunks/ssr.js";
import "marked";
import { e as escape } from "../../chunks/escape.js";
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { checklists: checklists2 = [] } = $$props;
  let { globalChecklists: globalChecklists2 = [] } = $$props;
  if ($$props.checklists === void 0 && $$bindings.checklists && checklists2 !== void 0) $$bindings.checklists(checklists2);
  if ($$props.globalChecklists === void 0 && $$bindings.globalChecklists && globalChecklists2 !== void 0) $$bindings.globalChecklists(globalChecklists2);
  return `<div class="container mx-auto p-4">${` <div class="flex space-x-4">${each(checklists2, ({ aircraft }) => {
    return `<button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded">${escape(aircraft)} </button>`;
  })} ${each(globalChecklists2, (checklist) => {
    return `<button class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded">${escape(checklist.name)} </button>`;
  })}</div>`}</div>`;
});
const checklists = [
  {
    aircraft: "F-45A",
    checklists: [
      {
        type: "aircraft",
        name: "Startup",
        file: "f45-startup.md",
        related: ["f45-takeoff-runway.md"],
        hidden: false,
        showGlobal: false
      },
      {
        type: "aircraft",
        name: "Takeoff (RWY)",
        file: "f45-takeoff-runway.md",
        hidden: false,
        showGlobal: false
      },
      {
        type: "aircraft",
        name: "Landing (RWY)",
        file: "f45-landing-runway.md",
        hidden: false,
        showGlobal: false
      },
      {
        type: "aircraft",
        name: "Takeoff (CARRIER)",
        file: "f45-takeoff-CATOBAR.md",
        hidden: false,
        showGlobal: false
      },
      {
        type: "aircraft",
        name: "Landing (CARRIER)",
        file: "f45-landing-CATOBAR-preface.md",
        related: ["f45-landing-CATOBAR.md"],
        hidden: false,
        showGlobal: true
      },
      {
        type: "aircraft",
        name: "Landing Carrier - CASE I",
        file: "f45-landing-CATOBAR.md",
        hidden: true,
        showGlobal: true
      }
    ]
  }
];
const globalChecklists = [
  { type: "global", name: "Wave Off", file: "wave-off.md" },
  {
    type: "global",
    name: "LSO Guidance",
    file: "lso-guidance.md",
    related: ["wave-off.md"]
  }
];
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Tabs, "Tabs").$$render($$result, { checklists, globalChecklists }, {}, {})}`;
});
export {
  Page as default
};
