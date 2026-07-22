export interface Cover {
  id: string;
  name: string;
  src: string;
}

// Toutes les couvertures illustrées (source unique, réutilisée par le coverflow accueil)
export const ALL_COVERS: Cover[] = [
  { id: "espagne",     name: "Espagne",     src: "/covers/Espagne.png" },
  { id: "italie",      name: "Italie",      src: "/covers/Italie.png" },
  { id: "provence",    name: "Provence",    src: "/covers/Provence.png" },
  { id: "miami",       name: "Miami",       src: "/covers/Miami.png" },
  { id: "marrakech",   name: "Marrakech",   src: "/covers/Marrakech.png" },
  { id: "marrakech-2", name: "Marrakech 2", src: "/covers/marrakech2.png" },
  { id: "montenegro",  name: "Monténégro",  src: "/covers/Montenegro.png" },
  { id: "bali",        name: "Bali",        src: "/covers/bali 1.png" },
  { id: "paris",       name: "Paris",       src: "/covers/paris.png" },
  { id: "perou",       name: "Pérou",       src: "/covers/Perou.png" },
  { id: "mykonos",     name: "Mykonos",     src: "/covers/mykonos.png" },
  { id: "brazil",      name: "Brésil",      src: "/covers/brazil.png" },
  { id: "mexique",     name: "Mexique",     src: "/covers/mexique.png" },
  { id: "mexique-2",   name: "Mexique 2",   src: "/covers/mexique1.png" },
  { id: "mexique-3",   name: "Mexique 3",   src: "/covers/mexique2.png" },
  { id: "mexique-4",   name: "Mexique 4",   src: "/covers/mexique3.png" },
  { id: "canada",      name: "Canada",      src: "/covers/canada.png" },
  { id: "amor",        name: "Amor",        src: "/covers/amor.png" },
  { id: "japon-1",     name: "Japon",       src: "/covers/japon1.png" },
  { id: "japon-2",     name: "Japon 2",     src: "/covers/japon2.png" },
  { id: "japon-3",     name: "Japon 3",     src: "/covers/japon3.png" },
  { id: "grece-1",     name: "Grèce",       src: "/covers/Grece1.png" },
  { id: "grece-2",     name: "Grèce 2",     src: "/covers/Grece2.png" },
  { id: "allemagne",   name: "Allemagne",   src: "/covers/Allemagne.png" },
  { id: "berlin",      name: "Berlin",      src: "/covers/Berlin.png" },
  { id: "germany",     name: "Germany",     src: "/covers/germany.png" },
  { id: "argentine-1", name: "Argentine",   src: "/covers/Argentine1.png" },
  { id: "argentine-2", name: "Argentine 2", src: "/covers/Argentine2.png" },
  { id: "belgique",    name: "Belgique",    src: "/covers/Belgique.png" },
  { id: "namibie-1",   name: "Namibie 1",   src: "/covers/namibie1.png" },
  { id: "colombie",    name: "Colombie",    src: "/covers/colombie.png" },
  { id: "egypte",      name: "Égypte",      src: "/covers/egypt.png" },
  { id: "turquie",     name: "Turquie",     src: "/covers/turquie.png" },
  { id: "istanbul",    name: "Istanbul",    src: "/covers/istanbul.png" },
];
