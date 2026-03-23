export interface BloodCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

export const bloodCenters: BloodCenter[] = [
  {
    id: "1",
    name: "Hemocentro do Estado do RS (HEMORGS)",
    address: "Av. Bento Gonçalves, 3722 - Partenon",
    city: "Porto Alegre",
    phone: "(51) 3336-6755",
    hours: "Seg-Sex: 8h-17h",
    lat: -30.0568,
    lng: -51.1747,
  },
  {
    id: "2",
    name: "Banco de Sangue - Hospital de Clínicas",
    address: "Rua Ramiro Barcelos, 2350",
    city: "Porto Alegre",
    phone: "(51) 3359-8604",
    hours: "Seg-Sex: 8h-16h",
    lat: -30.0392,
    lng: -51.2089,
  },
  {
    id: "3",
    name: "Hemocentro Regional de Caxias do Sul",
    address: "Rua Ernesto Alves, 2260",
    city: "Caxias do Sul",
    phone: "(54) 3214-3250",
    hours: "Seg-Sex: 7h30-12h",
    lat: -29.1685,
    lng: -51.1794,
  },
  {
    id: "4",
    name: "Hemocentro Regional de Passo Fundo",
    address: "Rua Teixeira Soares, 640",
    city: "Passo Fundo",
    phone: "(54) 3316-7200",
    hours: "Seg-Sex: 7h30-13h",
    lat: -28.2618,
    lng: -52.4069,
  },
  {
    id: "5",
    name: "Hemocentro Regional de Pelotas",
    address: "Av. Duque de Caxias, 250",
    city: "Pelotas",
    phone: "(53) 3225-3033",
    hours: "Seg-Sex: 7h30-12h30",
    lat: -31.7649,
    lng: -52.3371,
  },
  {
    id: "6",
    name: "Hemocentro Regional de Santa Maria",
    address: "Rua Floriano Peixoto, 1750",
    city: "Santa Maria",
    phone: "(55) 3221-5422",
    hours: "Seg-Sex: 7h30-12h30",
    lat: -29.6842,
    lng: -53.8069,
  },
];
