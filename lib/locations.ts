/**
 * Sierra Leone locations — kept inline because this file is imported by
 * convex/auth.ts which runs under the Convex tsconfig (no resolveJsonModule,
 * no @/ alias). Frontend components that need the grouped structure can
 * import @/data/locations.json directly.
 */

export type LocationDistrict = {
  name: string;
  areas: string[];
};

export const sierraLeoneDistricts: LocationDistrict[] = [
  {
    name: "Western Area",
    areas: [
      "Freetown Central", "Freetown East", "Freetown West",
      "Aberdeen", "Hill Station", "Wilberforce", "Congo Town",
      "Juba Hill", "Lumley", "Goderich", "Kissy", "Fourah Bay",
      "Murray Town", "Regent", "Leicester", "Brookfields",
      "New England", "Tengbeh Town", "Cline Town", "East End", "Kroo Bay",
    ],
  },
  {
    name: "Bombali",
    areas: ["Makeni", "Bombali Sebora", "Paki Masabong", "Safroko Limba"],
  },
  {
    name: "Bo",
    areas: ["Bo Town", "Kakua", "Tikonko", "Valunia"],
  },
  {
    name: "Bonthe",
    areas: ["Bonthe Town", "Sherbro Island", "Mattru Jong"],
  },
  {
    name: "Kailahun",
    areas: ["Kailahun Town", "Kenema Highway", "Pendembu"],
  },
  {
    name: "Kambia",
    areas: ["Kambia Town", "Gbinleh-Dixon", "Magbema"],
  },
  {
    name: "Kenema",
    areas: ["Kenema Town", "Nongowa", "Small Bo", "Tunkia"],
  },
  {
    name: "Koinadugu",
    areas: ["Kabala", "Diang", "Mongo", "Neya"],
  },
  {
    name: "Kono",
    areas: ["Koidu Town", "Gbense", "Nimikoro", "Sandor"],
  },
  {
    name: "Moyamba",
    areas: ["Moyamba Town", "Bagruwa", "Bumpe Ngao", "Kagboro"],
  },
  {
    name: "Port Loko",
    areas: ["Port Loko Town", "Bureh-Kasseh-Maconteh", "Kaffu Bullom", "Lokomasama"],
  },
  {
    name: "Pujehun",
    areas: ["Pujehun Town", "Barri", "Gallinas-Perri", "Kpaka"],
  },
  {
    name: "Tonkolili",
    areas: ["Magburaka", "Gbonkolenken", "Kholifa Mabang", "Yoni"],
  },
];

/** All district names + all area names as a flat list */
export function getSierraLeoneLocations(): string[] {
  return [
    ...sierraLeoneDistricts.map((d) => d.name),
    ...sierraLeoneDistricts.flatMap((d) => d.areas),
  ];
}

/** Structured list of districts with their child areas */
export function getSierraLeoneDistricts(): LocationDistrict[] {
  return sierraLeoneDistricts;
}

export function getRandomSierraLeoneLocation(): string {
  const all = getSierraLeoneLocations();
  return all[Math.floor(Math.random() * all.length)];
}
