export interface Cover {
  id: string;
  name: string;
  src: string;
}

// Toutes les couvertures illustrées (source unique, réutilisée par le coverflow accueil)
export const ALL_COVERS: Cover[] = [
  { id: "espagne",     name: "Espagne",     src: "/covers/espagne-v2.png" },
  { id: "montenegro",  name: "Monténégro",  src: "/covers/Montenegro.png" },
  { id: "namibie",     name: "Namibie",     src: "/covers/Namibie.png" },
  { id: "namibie-2",   name: "Namibie 2",   src: "/covers/Namibie2.png" },
  { id: "namibie-3",   name: "Namibie 3",   src: "/covers/Namibie3.png" },
  { id: "angleterre",  name: "Angleterre",  src: "/covers/angleterre.png" },
  { id: "japon-fuji",  name: "Japon",       src: "/covers/japon-fuji.png" },
  { id: "portugal",    name: "Portugal",    src: "/covers/portugal.png" },
  { id: "brazil",      name: "Brésil",      src: "/covers/bresil.png" },
  { id: "argentine-1", name: "Argentine",   src: "/covers/argentine.png" },
];
