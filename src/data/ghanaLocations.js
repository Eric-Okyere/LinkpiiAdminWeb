// Ghana's 16 regions, and a curated list of towns (district/municipal
// capitals) per region, used to populate the Region -> Town cascading
// dropdowns on the post forms. Source: Ghana's 261 MMDAs (Metropolitan,
// Municipal & District Assemblies) as of the 2018 regional reorganization
// (Wikipedia: "Districts of Ghana", cross-checked against
// "List of Ghanaian regions by area"). Ghana periodically creates new
// districts, so treat this as "good enough for a dropdown", not a legal
// register - if a seller's actual town is missing, the form still lets
// them keep whatever free-text value they already had (see the post
// forms' "custom option" fallback) and "Location" stays a free-text field
// for the exact street/area.

const RAW_TOWNS_BY_REGION = {
  "Ahafo": [
    "Goaso", "Kukuom", "Kenyasi", "Hwidiem", "Duayaw Nkwanta", "Bechem",
  ],
  "Ashanti": [
    "Adansi Asokwa", "Fomena", "New Edubiase", "Boamang", "Kodie", "Tepa",
    "Adugyama", "Mankranso", "Akrofuom", "Jacobu", "Manso Nkwanta",
    "Manso Adubia", "Konongo", "Agogo", "Juaso", "Asokore Mampong",
    "Asokwa", "Twedie", "Nyinahin", "Nkawie", "Barekese", "Bekwai",
    "Asiwa", "Kuntanase", "Ejisu", "Ejura", "Juaben", "Kumasi",
    "Mamponteng", "Kwadaso", "Mampong", "Tutuka", "Obuasi", "Offinso",
    "Akomadan", "Oforikrom", "Old Tafo", "Drobonso", "Nsuta", "Effiduase",
    "Kumawu", "Agona", "Suame",
  ],
  "Bono": [
    "Banda Ahenkro", "Berekum", "Jinijini", "Dormaa Ahenkro", "Wamfie",
    "Nkrankwanta", "Sampa", "Drobo", "Sunyani", "Odumase", "Nsawkaw",
    "Wenchi",
  ],
  "Bono East": [
    "Atebubu", "Kintampo", "Jema", "Busunya", "Nkoranza", "Yeji", "Prang",
    "Kajaji", "Kwame Danso", "Techiman", "Tuobodom",
  ],
  "Central": [
    "Abura-Dunkwa", "Nsaba", "Agona Swedru", "Ajumako", "Breman Asikuma",
    "Assin Foso", "Assin Bereku", "Nsuaem Kyekyewere", "Kasoa",
    "Awutu Breku", "Cape Coast", "Winneba", "Esakyir", "Potsin", "Afransi",
    "Apam", "Elmina", "Saltpond", "Twifo Praso", "Hemang",
    "Dunkwa-on-Offin", "Diaso",
  ],
  "Eastern": [
    "Kukurantumi", "Kibi", "Achiase", "Akropong", "Aburi", "Ofoase",
    "Manso", "Atimpoku", "Anyinam", "Kwabeng", "Coaltar", "Akim Oda",
    "New Abirem", "Akim Swedru", "Akwatia", "Begoro", "Osino", "Kade",
    "Donkorkrom", "Tease", "Abetifi", "Mpraeso", "Nkawkaw",
    "Krobo Odumase", "Effiduase", "Koforidua", "Nsawam", "Adukrom",
    "Suhum", "Asesewa", "Adeiso", "Asamankese", "Somanya",
  ],
  "Greater Accra": [
    "Lartebiokorshie", "Darkuman", "Dansoman", "Accra", "Ada Foah", "Sege",
    "Adenta", "Ashaiman", "Kokomlemle", "Nima", "Accra New Town",
    "Dzorwulu", "Sowutuom", "Abokobi", "Amomole", "Ngleshie Amanfro",
    "Amasaman", "Osu", "Kpone", "Nungua", "La", "Madina", "Teshie",
    "Prampram", "Tesano", "Dodowa", "Tema", "Tema Community 18", "Weija",
  ],
  "North East": [
    "Bunkpurugu", "Chereponi", "Nalerigu", "Yagaba", "Walewale", "Yunyoo",
  ],
  "Northern": [
    "Gushegu", "Karaga", "Kpandai", "Kumbungu", "Sang", "Nanton",
    "Bimbilla", "Wulensi", "Saboba", "Sagnarigu", "Savelugu", "Tamale",
    "Tatale", "Tolon", "Yendi", "Zabzugu",
  ],
  "Oti": [
    "Nkonya Ahenkro", "Likpe-Mate", "Jasikan", "Kadjebi", "Dambai",
    "Chinderi", "Kete Krachi", "Kpassa", "Nkwanta",
  ],
  "Savannah": [
    "Bole", "Buipe", "Salaga", "Daboya", "Kpalbe", "Sawla", "Damongo",
  ],
  "Upper East": [
    "Bawku", "Zebilla", "Binduri", "Zuarungu", "Bolgatanga", "Bongo",
    "Sandema", "Fumbisi", "Garu", "Navrongo", "Paga", "Nangodi", "Pusiga",
    "Tongo", "Tempane",
  ],
  "Upper West": [
    "Issa", "Jirapa", "Lambussie", "Lawra", "Nadowli", "Nandom", "Tumu",
    "Gwollu", "Funsi", "Wa", "Wechiau",
  ],
  "Volta": [
    "Adaklu Waya", "Ve Golokwati", "Kpetoe", "Ave-Dakpa", "Akatsi",
    "Anloga", "Adidome", "Ho", "Dzolokpuita", "Hohoe", "Keta", "Dzodze",
    "Denu", "Kpando", "Anfoega", "Battor Dugame", "Kpeve", "Sogakope",
  ],
  "Western": [
    "Agona Ahanta", "Manso Amenfi", "Asankragua", "Kwesimintsim",
    "Nkroful", "Half Assini", "Mpohor", "Axim", "Prestea",
    "Sekondi-Takoradi", "Shama", "Tarkwa", "Wassa-Akropong", "Daboase",
  ],
  "Western North": [
    "Enchi", "Sefwi Adabokrom", "Essam-Debiso", "Bibiani", "Sefwi Bodi",
    "Juaboso", "Sefwi Akontombra", "Sefwi Wiawso", "Dadieso",
  ],
};

// Sort + dedupe once at module load so every consumer gets a clean,
// alphabetical list without re-sorting on every render.
const sortUnique = (list) =>
  Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));

export const TOWNS_BY_REGION = Object.fromEntries(
  Object.entries(RAW_TOWNS_BY_REGION).map(([region, towns]) => [region, sortUnique(towns)])
);

export const GHANA_REGIONS = sortUnique(Object.keys(RAW_TOWNS_BY_REGION));

// Flat, deduped list of every region + town, for free-text location
// search/autocomplete (e.g. the Order KIA search bar) where there's no
// separate region/town selection step.
export const ALL_GHANA_LOCATIONS = sortUnique([
  ...GHANA_REGIONS,
  ...Object.values(TOWNS_BY_REGION).flat(),
]);

// Builds the <select> option list for a dropdown that must also keep
// showing an existing free-text value that was typed before this list
// existed (or that simply isn't in it) - so opening an old listing to
// edit it never silently blanks the field.
export const withCustomOption = (currentValue, options) => {
  const trimmed = (currentValue || "").trim();
  if (!trimmed || options.includes(trimmed)) return options;
  return [trimmed, ...options];
};
