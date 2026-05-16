/**
 * Mock Data para Strike & Beat
 * Centraliza toda la informacion estatica para facilitar la dinamizacion y el paso a backend.
 */

export interface EventInfo {
  title: string;
  date: string;
  locationName: string;
  locationAddress: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutSecondaryText: string;
  aboutImage: string;
  doorsOpen: string;
  locationLogistics?: string;
  weighInDate?: string;
  weighInDoors?: string;
  weighInTime?: string;
  weighInIsFree?: boolean;
  totalFights?: number;
  totalArtists?: number;
  totalBars?: number;
  hasBars?: boolean;
  breakTimes?: string;
  totalBreaks?: number;
  firstFightTime?: string;
  infoImage?: string;
  locationLogisticsTitle?: string;
  weighInTitle?: string;
  weighInText?: string;
  weighInNotice?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  contactDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactHours?: string;
  contactAssociationTitle?: string;
  contactAssociationText?: string;
  artistsTitle?: string;
  artistsDescription?: string;
  fightsTitle?: string;
  fightsDescription?: string;
  themePrimaryColor?: string;
  themeNeonColor?: string;
  marqueeSpeed?: number;
  contactHeroImage?: string;
  ticketsHeroImage?: string;
  cardFightsText?: string;
  cardArtistsText?: string;
  cardBarsText?: string;
}

export interface Fighter {
  id: string;
  nameA: string;
  imageA: string;
  aliasA: string;
  nameB: string;
  imageB: string;
  aliasB: string;
  category: string;
  rounds: string;
  rules: string;
  isFeatured: boolean;
  badgeText?: string;
  descriptionA?: string;
  descriptionB?: string;
  videoUrl?: string;
  slug?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  profileLink: string;
  instagramUrl?: string;
  spotifyUrl?: string;
  spotifyEmbedUrl?: string;
  youtubeUrl?: string;
  subtitle?: string;
  description?: string;
  videoUrl?: string;
  heroImage?: string;
  slug?: string;
}

export interface Ticket {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  stock: number | null;
  managementFees: number;
  soldCount?: number;
  totalCapacity?: number | null;
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  opacity: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order?: number;
}

export const eventData: EventInfo = {
  title: "STRIKE & BEAT",
  date: "15 JUNIO 2024",
  locationName: "Pabellón Arroyo Vallejo",
  locationAddress: "Calle de la Victoria, 12, 28005 Madrid.",
  heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg0VWvA2skJ8W53npl0ev84Xq3QCI-sPfymiVDGbJET27co9VH3ORf3TyRp8MaGs9b59qUggy4so5n2v51cQgc42oJrjbTwBIGDJ82zGwtd9xhSMSyLqe2NktaVEa6pJoF_OCtzKrXGt6pkTPpcXYXVoTyY5feqG9-G-aGhBTTzI4dtgerVL2_Iwx7bI-AuRyVnLZjqotnQi9UzOw6kJAtkawwm_aIzK36GvjLm2rK6m9CRSIly_mO5OT-ha_fkuhhvk8MrHsF6uo",
  aboutTitle: "El Evento",
  aboutText: "STRIKE & BEAT no es solo un espectáculo; es un golpe contra la exclusión. Todo lo recaudado será destinado a la Asociación Caminando, apoyando proyectos de integración social y deportiva en barrios vulnerables.",
  aboutSecondaryText: "Unimos la energía del ring con la potencia del escenario urbano para crear una noche de pura resistencia y solidaridad.",
  aboutImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfE-HPZlwJMUKaBeFgU-FM3Q4pwTNO2eMNKcpXLDIObs1ELhtXyeILqNg0qaeseqpbWS6bJ1XFfva585kgsz4hs3MzoASjwYw2PIez7rUgs16bizskOVhCOmJT5Q4n_eqJeNH_CcAc2fjeRwpCI3_qsmYVY-SNGJl_jHUT9S1CKKWtJXHPgKnYd2u6FHo8A7xatMhnjITNeSJaTlvzrML-5AsnR4EKbiupKkr4LgnTBSEoPKGTto1J-kKkaX4152zEskKHVdDp1b8",
  doorsOpen: "18:00 hrs",
  locationLogistics: "AFORO: 2,500 ESPECTADORES\nCOMIDA Y BEBIDA: 2 BARRAS COMPLETAS + SNACKS\nINSTALACIONES: ASEOS + PUESTOS DE MERCH\nPARKING: APARCAMIENTO PÚBLICO ADYACENTE",
  weighInDate: "14 JUNIO 2024",
  weighInDoors: "10:00 AM",
  weighInTime: "11:00 AM",
  weighInIsFree: true,
  totalFights: 10,
  totalArtists: 3,
  hasBars: true,
  breakTimes: "02",
  firstFightTime: "17:35H",
};

export const fighters: Fighter[] = [
  {
    id: "fight-1",
    nameA: "R. EL LOBO",
    imageA: "https://lh3.googleusercontent.com/aida-public/AB6AXuASjEWn-loHuq2yTE5pPsyYiySj17FIj097qgeTdosqCeIBA5zQ25W578ObeMsoeQ1hWOIrJhiyUhLz6hgbq94Wf4uapg_Y6uTY8HEOh5dNJjoS0_hcPn2w9uszlSoUSZqDnRUgNnNGN9Ih3qFYgRkJX37NEx2wl6CNr5QkH7dHU00EhbTqMwgOFH-FLH942Oz3Sr_q3he0vkbUlAfPqwwZrHJaAWzAEc7KV-BpJylczH2C9FQEONDwmmVtz7Y2_coNjiJLPtkZ7NQ",
    aliasA: "EL LOBO",
    nameB: "MARC THE TANK",
    imageB: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvJ2fRR9b9OuYmgXdB2tEU_kHo8NqLh6DTRIZJ56WQLKtXeDSYMytqG0eb9WHc_k8rkhC45MBEZAeC3cZbEeA0zxQxRLdgL_iSAkVvpQC9JfLkkKwrHTUWNtv-goffK_t0DAbZRF-5GEPAhy3iiO2XW2-mRxTSl7WwNj6qlN8wnis_qyfnPw_Im4TXbAgMHHrPG74Mj24-F1cLC4DUSppqpeudSKM1ULD2iAAjWSS2rf-XFT-Zq848hhBeAgQhBy2gUieCLBgIzpg",
    aliasB: "THE TANK",
    category: "PESO PESADO",
    rounds: "5 ROUNDS",
    rules: "BOXEO PRO",
    isFeatured: true
  },
  {
    id: "fight-2",
    nameA: "SARAY LA JEFA",
    imageA: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5nkwc3uPf56OqvVhy5dPZSnL3_O2nAW7Byf5z8Y05UdcZuwyT0UY1NWEUeXP0ihxmswsHNH9ptnqQyaJQZRpl70kd0p0udwaG44rx8xgJ9rhyScLpLInOqeYYNC8qZXSNXhdatckKJRExz3ynhGcIbyAJmYCOCYtjGU1aLOCSqvlPRcgyMHl5-TaUSMi_ZErFdx3KDwz5kRNtf04UCSQI6hLMwixhxIDJKRR1Y_UIWA5X0q78YO3sU9IpRW20Hl21z6XdKX6uA-I",
    aliasA: "LA JEFA",
    nameB: "LUNA X",
    imageB: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrJcO7EjTupvjQrLEKESCNcJYUu2ovQ9Ju-wFdWO4tuBsL7GrsM0VnIWg6oMrJuwRevxaPu93PKVgdXKvtLTRpeq4VZz2FfKAktdGlCaxl-7aCodB3ETwH61a7WCKWs5l51_6NqVAe6YIOALQ8Xu9QPLeIx1wOyJQSniwNX3WM0hynkquP-3H_EpONzuO8KgwW-QhP02X8xXPjuYpTuP5SL8c-qdINUxSLfoVQ5vls5345NG0gfYYjKJggILwrD5Shkxs6SKMftx0",
    aliasB: "X",
    category: "PESO PLUMA",
    rounds: "3 ROUNDS",
    rules: "BOXEO AMATEUR",
    isFeatured: true
  }
];

export const artists: Artist[] = [
  {
    id: "artist-1",
    name: "MC VOLTAJE",
    genre: "RAP / HARDCORE",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3CW79rAfa6ah19NmGAui9oCk6_aK5Y5sDgge4Ew5i-5WWnm4f1ayKBOQWTY6ahFX0iWwozySk8YNEl_O1JFFLJiJalkHaOu6V6iwhDHnamfxQsEoJnsiB4vkGPSzgSYWNMmBswXCRJAmRp32othrThMgYh0mjU6o5xmcvwXVEOQi3mGsGxtd8g2Oosicbyet5-9rMx8XwlAnaT3zTruNJo3wHU2hP0E4Avp_iiJi8JmkT6wyBAz8w6AAG7R-476up7VgEXz9ab2U",
    profileLink: "/artistas"
  },
  {
    id: "artist-2",
    name: "K-OS URBANO",
    genre: "DRILL / TRAP",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC25J-6cQCBtUtVembf3DrSldvCxk7vo-7221amGSPWZFkGk81hVfgDOXsbMrqStJwLWW9c3wmBh6gENOKCM7FloD5M0LD6n1v286x3hdU-iqQUUB-p8n5Px0TOkMKCcGoSPzg_-ykpOvpchYvA7kCSFqoH-cQZqnCKrOhtK2_xk0scIVPEqk1oVK6xsqv42hDVz7fyZDBw7lAMeBKoLgMTu4dzybHXEoR8RZvkODE6qAjzJ1XV8SXqIYqf15XLP7k22YxeMastDpQ",
    profileLink: "/artistas"
  },
  {
    id: "artist-3",
    name: "NEBULOSA",
    genre: "R&B / SOUL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDed1o9V-Vh_arOZ2ByoC8Xv1-uzIe4KAPQwN9gUFmWidwogSF_3750X9ilEFpuZGYs5e7KH6EYq3nhcLtoV0WFUHJwzlwprh3W-Wf9MqNFG8Bo_q3Ne3uQWQ-OprcKBUWDnPQSSKuVZTLNTnMqw4w0OjQrAATPt4oxI2kOm-xfz_k24ul4CuU5NulYqyixm1OJuIYsmWCAbTM1Feqko1kFykRGaFDrWo2EZdLEwuRBOY91Cw5bb-k9_rP8wPldNW2tOXsuayzIKqk",
    profileLink: "/artistas"
  }
];

export const tickets: Ticket[] = [
  {
    id: "ticket-pista",
    priceId: "price_pista_placeholder",
    name: "Entrada Pista",
    description: "Acceso directo a pie de ring. Vive la vibracion de cada golpe.",
    price: 15,
    stock: null,
    managementFees: 2.5
  },
  {
    id: "ticket-grada",
    priceId: "price_grada_placeholder",
    name: "Entrada Grada",
    description: "Vision panoramica del octagono y el escenario principal.",
    price: 20,
    stock: 233,
    managementFees: 2.5
  }
];

export const sponsors: Sponsor[] = [
  { id: "sp-1", name: "SPONSOR_01", opacity: 50 },
  { id: "sp-2", name: "SPONSOR_02", opacity: 50 },
  { id: "sp-3", name: "SPONSOR_03", opacity: 50 },
  { id: "sp-4", name: "SPONSOR_04", opacity: 50 }
];

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "¿A qué hora abren las puertas?",
    answer: "Las puertas abren a las 18:00 hrs. Te recomendamos llegar temprano para evitar filas y disfrutar del pre-show.",
    sort_order: 1
  },
  {
    id: "faq-2",
    question: "¿Hay límite de edad?",
    answer: "El evento es apto para mayores de 18 años. Se requerirá identificación oficial con fotografía en la entrada.",
    sort_order: 2
  },
  {
    id: "faq-3",
    question: "¿Qué incluye la entrada VIP?",
    answer: "La entrada VIP incluye acceso preferencial sin filas, zona exclusiva cerca del octágono/escenario, barra libre premium y acceso al after-party oficial.",
    sort_order: 3
  }
];
