/**
 * Sierra Leone locations data
 */

export const sierraLeoneDistricts = [
  "Freetown", // Most active district
  "Bombali",
  "Bonthe",
  "Kailahun",
  "Kambia",
  "Kenema",
  "Koinadugu",
  "Moyamba",
  "Pujehun",
  "Port Loko",
  "Tonkolili",
] as const;

export const sierraLeoneAreas = [
  "Freetown Central",
  "Freetown East", 
  "Freetown West",
  "Aberdeen",
  "Hill Station",
  "Wilberforce",
  "Congo Town",
  "Juba Hill",
  "Lumley",
  "Goderich",
  "Kissy",
  "Fourah Bay",
  "Murray Town",
  "Regent",
  "Leicester",
  "Makeni", // Bombali
  "Kabala", // Koinadugu
  "Koidu Town", // Kono
  "Bo", // Bo
  "Magburaka", // Tonkolili
] as const;

export type SierraLeoneDistrict = typeof sierraLeoneDistricts[number];
export type SierraLeoneArea = typeof sierraLeoneAreas[number];

export function getRandomSierraLeoneLocation(): string {
  const allLocations = [...sierraLeoneDistricts, ...sierraLeoneAreas];
  return allLocations[Math.floor(Math.random() * allLocations.length)];
}

export function getSierraLeoneLocations(): string[] {
  return [...sierraLeoneDistricts, ...sierraLeoneAreas];
}
