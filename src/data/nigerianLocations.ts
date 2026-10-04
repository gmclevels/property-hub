export interface NigerianStateData {
  state: string;
  capital: string;
  majorCities: string[];
  prominentAreas: string[];
  lgas: string[];
}

export const NIGERIAN_STATES: NigerianStateData[] = [
  {
    state: 'FCT - Abuja',
    capital: 'Abuja Municipal',
    majorCities: ['Abuja', 'Gwagwalada', 'Kuje', 'Bwari', 'Abaji', 'Kwali'],
    prominentAreas: [
      'Maitama',
      'Asokoro',
      'Wuse 2',
      'Wuse 1',
      'Gwarinpa',
      'Guzape',
      'Jabi',
      'Utako',
      'Lugbe',
      'Kubwa',
      'Gwagwalada Phase 1',
      'Gwagwalada University Rd',
      'Kado',
      'Mpape',
      'Lokogoma',
      'Dawaki',
      'Apo'
    ],
    lgas: ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji']
  },
  {
    state: 'Lagos',
    capital: 'Ikeja',
    majorCities: ['Lagos Island', 'Ikeja', 'Lekki', 'Epe', 'Ikorodu', 'Badagry'],
    prominentAreas: [
      'Lekki Phase 1',
      'Ikoyi',
      'Victoria Island (VI)',
      'Banana Island',
      'Chevron / Orchid',
      'Ajah',
      'Sangotedo',
      'Ikeja GRA',
      'Maryland',
      'Magodo Phase 2',
      'Surulere',
      'Yaba',
      'Gbagada',
      'Ogba',
      'Alausa'
    ],
    lgas: ['Eti-Osa', 'Ikeja', 'Lagos Island', 'Lagos Mainland', 'Ibeju-Lekki', 'Surulere', 'Kosofe', 'Alimosho', 'Oshodi-Isolo', 'Ikorodu']
  },
  {
    state: 'Enugu',
    capital: 'Enugu',
    majorCities: ['Enugu', 'Nsukka', 'Oji River', 'Udi', 'Awgu'],
    prominentAreas: [
      'Independence Layout',
      'GRA Enugu',
      'New Haven',
      'Trans-Ekulu',
      'Ogui Road',
      'Achara Layout',
      'Emene',
      'Abakpa Nike',
      'Centenary City',
      'Golf Estate'
    ],
    lgas: ['Enugu North', 'Enugu South', 'Enugu East', 'Nsukka', 'Udi', 'Oji River']
  },
  {
    state: 'Rivers',
    capital: 'Port Harcourt',
    majorCities: ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Eleme', 'Oyigbo'],
    prominentAreas: [
      'Old GRA',
      'New GRA Phase 2',
      'Peter Odili Road',
      'Trans-Amadi',
      'Woji',
      'Rumuola',
      'D-Line',
      'Ada George',
      'Rumuokoro',
      'Eliozu'
    ],
    lgas: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Oyigbo']
  },
  {
    state: 'Oyo',
    capital: 'Ibadan',
    majorCities: ['Ibadan', 'Ogbomoso', 'Oyo', 'Iseyin', 'Saki'],
    prominentAreas: [
      'Bodija',
      'Iyaganku GRA',
      'Oluyole Estate',
      'Jericho',
      'Samonda',
      'Ring Road',
      'Akobo',
      'Alalubosa GRA',
      'Agodi'
    ],
    lgas: ['Ibadan North', 'Ibadan South-West', 'Ibadan North-West', 'Ibadan South-East', 'Oluyole']
  },
  {
    state: 'Edo',
    capital: 'Benin City',
    majorCities: ['Benin City', 'Uromi', 'Auchi', 'Ekpoma'],
    prominentAreas: ['GRA Benin', 'Airport Road', 'Ugbowo', 'Sapele Road', 'Ikpoba Hill'],
    lgas: ['Oredo', 'Ikpoba-Okha', 'Egor', 'Esan North-East']
  },
  {
    state: 'Anambra',
    capital: 'Awka',
    majorCities: ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia'],
    prominentAreas: ['GRA Awka', 'Ifite Awka', 'Upper Iweka Onitsha', 'GRA Onitsha', 'Nnewi Industrial Zone'],
    lgas: ['Awka South', 'Onitsha North', 'Onitsha South', 'Nnewi North']
  },
  {
    state: 'Delta',
    capital: 'Asaba',
    majorCities: ['Asaba', 'Warri', 'Sapele', 'Ughelli', 'Agbor'],
    prominentAreas: ['GRA Asaba', 'Okpanam Road', 'Nnebisi Road', 'GRA Warri', 'Airport Road Warri'],
    lgas: ['Oshimili South', 'Warri South', 'Uvwie', 'Ughelli North']
  },
  {
    state: 'Imo',
    capital: 'Owerri',
    majorCities: ['Owerri', 'Orlu', 'Okigwe'],
    prominentAreas: ['New Owerri', 'Aladinma', 'World Bank Housing Estate', 'Ikenegbu', 'GRA Owerri'],
    lgas: ['Owerri Municipal', 'Owerri West', 'Owerri North']
  },
  {
    state: 'Abia',
    capital: 'Umuahia',
    majorCities: ['Umuahia', 'Aba', 'Ohafia'],
    prominentAreas: ['GRA Umuahia', 'Faulks Road Aba', 'Aba Town', 'Umungasi'],
    lgas: ['Aba South', 'Aba North', 'Umuahia North']
  },
  {
    state: 'Akwa Ibom',
    capital: 'Uyo',
    majorCities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron'],
    prominentAreas: ['Ewet Housing Estate', 'Shelter Afrique', 'Osongama Estate', 'Oron Road'],
    lgas: ['Uyo', 'Eket', 'Ikot Ekpene']
  },
  {
    state: 'Cross River',
    capital: 'Calabar',
    majorCities: ['Calabar', 'Ikom', 'Ogoja'],
    prominentAreas: ['State Housing Estate', 'Satellite Town', 'Marina Resort Axis', 'Federal Housing'],
    lgas: ['Calabar Municipal', 'Calabar South']
  },
  {
    state: 'Kaduna',
    capital: 'Kaduna',
    majorCities: ['Kaduna', 'Zaria', 'Kafanchan'],
    prominentAreas: ['Barnawa', 'Malali', 'GRA Kaduna', 'Millennium City', 'Ungwan Rimi'],
    lgas: ['Kaduna North', 'Kaduna South', 'Chikun', 'Zaria']
  },
  {
    state: 'Kano',
    capital: 'Kano',
    majorCities: ['Kano'],
    prominentAreas: ['Nasarawa GRA', 'Bompai', 'Farm Centre', 'Tarauni', 'Sharada'],
    lgas: ['Nasarawa', 'Fagge', 'Dala', 'Kano Municipal']
  },
  {
    state: 'Plateau',
    capital: 'Jos',
    majorCities: ['Jos', 'Bukuru', 'Pankshin'],
    prominentAreas: ['Rayfield', 'Lamingo', 'Anglo Jos', 'Tudun Wada', 'Old Airport Road'],
    lgas: ['Jos North', 'Jos South']
  },
  {
    state: 'Kwara',
    capital: 'Ilorin',
    majorCities: ['Ilorin', 'Offa'],
    prominentAreas: ['GRA Ilorin', 'Tanke', 'Fate', 'Adewole Estate', 'Mandate Estate'],
    lgas: ['Ilorin South', 'Ilorin West', 'Ilorin East']
  },
  {
    state: 'Ogun',
    capital: 'Abeokuta',
    majorCities: ['Abeokuta', 'Sagamu', 'Ijebu-Ode', 'Ota'],
    prominentAreas: ['Ibara GRA', 'Oke-Mosan', 'Arepo', 'Magboro', 'Mowe-Ibafo'],
    lgas: ['Abeokuta South', 'Obafemi Owode', 'Ado-Odo/Ota']
  },
  {
    state: 'Ondo',
    capital: 'Akure',
    majorCities: ['Akure', 'Ondo Town', 'Owo'],
    prominentAreas: ['Alagbaka GRA', 'Ijapo Estate', 'Oba Ile', 'Oda Road'],
    lgas: ['Akure South', 'Akure North']
  },
  {
    state: 'Niger',
    capital: 'Minna',
    majorCities: ['Minna', 'Suleja', 'Bida', 'Kontagora'],
    prominentAreas: ['GRA Minna', 'Suleja Town', 'Bosso', 'Tunga', 'Maitumbi'],
    lgas: ['Chanchaga', 'Suleja', 'Bosso']
  },
  {
    state: 'Benue',
    capital: 'Makurdi',
    majorCities: ['Makurdi', 'Gboko', 'Otukpo'],
    prominentAreas: ['High Level', 'Wurukum', 'North Bank', 'Old GRA', 'Judges Quarters'],
    lgas: ['Makurdi', 'Gboko', 'Otukpo']
  },
  {
    state: 'Kogi',
    capital: 'Lokoja',
    majorCities: ['Lokoja', 'Okene', 'Kabba'],
    prominentAreas: ['GRA Lokoja', 'Ganaja Village', 'Lokongoma Phase 1', 'Phase 2'],
    lgas: ['Lokoja', 'Okene']
  },
  // Remaining states for completeness
  { state: 'Adamawa', capital: 'Yola', majorCities: ['Yola', 'Mubi'], prominentAreas: ['Jimeta', 'Karewa GRA'], lgas: ['Yola North', 'Yola South'] },
  { state: 'Bauchi', capital: 'Bauchi', majorCities: ['Bauchi', 'Azare'], prominentAreas: ['GRA Bauchi', 'Fadaman Mada'], lgas: ['Bauchi', 'Katagum'] },
  { state: 'Bayelsa', capital: 'Yenagoa', majorCities: ['Yenagoa', 'Brass'], prominentAreas: ['Amarata', 'Kpansia', 'Etegwe'], lgas: ['Yenagoa', 'Southern Ijaw'] },
  { state: 'Borno', capital: 'Maiduguri', majorCities: ['Maiduguri', 'Biu'], prominentAreas: ['GRA Maiduguri', 'Pompomari'], lgas: ['Maiduguri', 'Jere'] },
  { state: 'Ebonyi', capital: 'Abakaliki', majorCities: ['Abakaliki', 'Afikpo'], prominentAreas: ['Mile 50', 'GRA Abakaliki', 'Presco'], lgas: ['Abakaliki', 'Afikpo North'] },
  { state: 'Ekiti', capital: 'Ado-Ekiti', majorCities: ['Ado-Ekiti', 'Ikere'], prominentAreas: ['GRA Ado', 'Adebayo', 'Fajuyi'], lgas: ['Ado-Ekiti', 'Ikere'] },
  { state: 'Gombe', capital: 'Gombe', majorCities: ['Gombe', 'Kaltungo'], prominentAreas: ['GRA Gombe', 'Federal Lowcost'], lgas: ['Gombe', 'Akko'] },
  { state: 'Jigawa', capital: 'Dutse', majorCities: ['Dutse', 'Hadejia'], prominentAreas: ['Takur Commercial', 'GRA Dutse'], lgas: ['Dutse', 'Hadejia'] },
  { state: 'Katsina', capital: 'Katsina', majorCities: ['Katsina', 'Daura'], prominentAreas: ['GRA Katsina', 'Kofar Kaura'], lgas: ['Katsina', 'Daura'] },
  { state: 'Kebbi', capital: 'Birnin Kebbi', majorCities: ['Birnin Kebbi', 'Yauri'], prominentAreas: ['GRA Birnin Kebbi', 'Gwadangaji'], lgas: ['Birnin Kebbi'] },
  { state: 'Nasarawa', capital: 'Lafia', majorCities: ['Lafia', 'Keffi', 'Karu'], prominentAreas: ['Mararaba', 'Karu Extension', 'GRA Lafia', 'Masaka'], lgas: ['Karu', 'Lafia', 'Keffi'] },
  { state: 'Osun', capital: 'Osogbo', majorCities: ['Osogbo', 'Ile-Ife', 'Ede'], prominentAreas: ['GRA Osogbo', 'Ogo-Oluwa', 'Ring Road'], lgas: ['Osogbo', 'Ife Central'] },
  { state: 'Sokoto', capital: 'Sokoto', majorCities: ['Sokoto'], prominentAreas: ['Runjin Sambo', 'GRA Sokoto'], lgas: ['Sokoto North', 'Sokoto South'] },
  { state: 'Taraba', capital: 'Jalingo', majorCities: ['Jalingo', 'Wukari'], prominentAreas: ['GRA Jalingo', 'Mile Six'], lgas: ['Jalingo', 'Wukari'] },
  { state: 'Yobe', capital: 'Damaturu', majorCities: ['Damaturu', 'Potiskum'], prominentAreas: ['GRA Damaturu', 'Nayi-Nawa'], lgas: ['Damaturu', 'Potiskum'] },
  { state: 'Zamfara', capital: 'Gusau', majorCities: ['Gusau'], prominentAreas: ['GRA Gusau', 'Samaru'], lgas: ['Gusau'] }
];

export const ALL_STATE_NAMES = NIGERIAN_STATES.map((s) => s.state);

export const POPULAR_LOCATIONS = [
  { state: 'FCT - Abuja', area: 'Gwagwalada' },
  { state: 'FCT - Abuja', area: 'Maitama' },
  { state: 'FCT - Abuja', area: 'Guzape' },
  { state: 'FCT - Abuja', area: 'Gwarinpa' },
  { state: 'Lagos', area: 'Lekki Phase 1' },
  { state: 'Lagos', area: 'Ikeja GRA' },
  { state: 'Enugu', area: 'Independence Layout' },
  { state: 'Rivers', area: 'Peter Odili Road' },
  { state: 'Oyo', area: 'Bodija' }
];
