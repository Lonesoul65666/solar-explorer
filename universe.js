import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ─── PLANET DATA ────────────────────────────────────────────────────────────
const PLANETS = [
  {
    id:'sun', name:'The Sun', tagline:'Our Star — Burning for 4.6 Billion Years',
    color:'#ffe060', emissive:'#ff8800',
    orbitRadius:0, size:2.5, orbitSpeed:0, rotSpeed:0.018,
    tilt:7.25, ringless:true,
    stats:{
      diameter:'1,392,700 km', distanceFromSun:'0 km (it IS the center)', dayLength:'25 Earth days (equator)',
      yearLength:'N/A', temp:'5,500°C surface / 15M°C core', moons:'8 planets + countless objects'
    },
    surface:'A roiling ball of plasma. No solid surface — just churning gas, magnetic storms, and nuclear fire.',
    surfaceComp:[{label:'Hydrogen (plasma)',color:'#ffcc40',pct:73},{label:'Helium',color:'#ffaa20',pct:25},{label:'Other elements',color:'#ff6600',pct:2}],
    facts:[
      'The Sun contains 99.86% of all the mass in our entire solar system',
      'It fuses 620 million tonnes of hydrogen into helium every single second',
      '1.3 million planet Earths could fit inside the Sun with room to spare',
      'Light from the Sun takes exactly 8 minutes to reach your eyes',
      'The Sun is a middle-aged star — it has another ~5 billion years of fuel left',
      'Its surface temperature is 5,500°C, but the outer atmosphere (corona) reaches 1–3 million°C'
    ],
    moons:[],
    missions:[
      {name:'Parker Solar Probe',year:2018,agency:'NASA',type:'Orbiter',note:'The fastest human-made object ever — reaching 690,000 km/h. Flew through the Sun\'s outer atmosphere (corona) for the first time in 2021, "touching" the Sun itself.'},
      {name:'Solar Orbiter',year:2020,agency:'ESA/NASA',type:'Orbiter',note:'Taking the highest-resolution images of the Sun\'s surface ever captured. Revealed mysterious small flares called "campfires" covering the solar surface.'},
      {name:'SOHO',year:1995,agency:'ESA/NASA',type:'Observatory',note:'Monitors the Sun 24/7 from a point between Earth and Sun. Has discovered over 4,000 comets and provides advance warning of solar storms that could affect Earth.'},
    ],
    pois:[
      {name:'Sunspots',desc:'Dark patches caused by intense magnetic fields that prevent heat from reaching the surface. Some are larger than Earth. They come and go on an 11-year cycle that affects the entire solar system.'},
      {name:'Solar Flares & CMEs',desc:'Massive explosions of energy that can release as much power as a billion nuclear bombs in minutes. Large ones can knock out satellites and electrical grids on Earth.'},
      {name:'The Corona',desc:'The Sun\'s outer atmosphere mysteriously reaches 1–3 million°C — hundreds of times hotter than the surface below it. Scientists still don\'t fully understand why.'},
      {name:'Solar Wind',desc:'A constant stream of charged particles blowing outward at 400–800 km/s. It creates the auroras on Earth and "blows" comet tails away from the Sun.'},
    ],
    atmosphere:{
      composition:[{gas:'H (plasma)',pct:73,color:'#ffdd40'},{gas:'He',pct:25,color:'#ffaa30'},{gas:'C/O/Ne/other',pct:2,color:'#ff8800'}],
      pressure:'28× Earth\'s gravity at surface',temp:'5,500°C surface → 15,000,000°C core',windSpeed:'Solar wind: 400–800 km/s',
    },
    texture:'sun'
  },
  {
    id:'mercury', name:'Mercury', tagline:'The Swift Messenger',
    color:'#b5b5b5', emissive:'#1a1a1a',
    orbitRadius:6, size:0.38, orbitSpeed:4.15, rotSpeed:0.017,
    tilt:0.03, ringless:true,
    stats:{
      diameter:'4,879 km', distanceFromSun:'58M km (avg)', dayLength:'59 Earth days',
      yearLength:'88 Earth days', temp:'-180°C to 430°C', moons:'0'
    },
    surface:'Rocky, covered in craters. No atmosphere to protect it.',
    surfaceComp:[{label:'Silicate Rock',color:'#999',pct:70},{label:'Iron Core',color:'#7a5c3a',pct:30}],
    facts:[
      'Closest planet to the Sun, but NOT the hottest — that\'s Venus!',
      'A year on Mercury is only 88 Earth days long',
      'Has ice in permanently shadowed craters at its poles',
      'The surface temperature swings 600°C between day and night',
      'Has a surprisingly large iron core — makes up 85% of its radius!'
    ],
    moons:[],
    missions:[
      {name:'Mariner 10',year:1974,agency:'NASA',type:'Flyby',note:'First spacecraft to visit Mercury. Mapped 45% of the surface and discovered its magnetic field — surprisingly strong for such a small world.'},
      {name:'MESSENGER',year:2011,agency:'NASA',type:'Orbiter',note:'First Mercury orbiter. Mapped 100% of the surface and confirmed water ice in permanently shadowed polar craters.'},
      {name:'BepiColombo',year:2025,agency:'ESA/JAXA',type:'Orbiter',note:'Joint European-Japanese mission currently en route. Will conduct the most detailed Mercury study ever with two orbiters working in tandem.'},
    ],
    pois:[
      {name:'Caloris Basin',desc:'One of the largest impact craters in the solar system — 1,550 km wide. The impact was so violent it created chaotic terrain on the opposite side of the planet from the shockwaves.'},
      {name:'Pantheon Fossae',desc:'A stunning spider-web pattern of radiating troughs spanning 1,000 km, centered on Apollodorus crater. Unique structure found nowhere else in the solar system.'},
      {name:'Rachmaninoff Crater',desc:'A double-ringed basin showing Mercury\'s youngest known volcanic activity. Orange deposits of lava surround its rim, evidence of past explosive eruptions.'},
    ],
    atmosphere:{
      composition:[{gas:'O₂',pct:42,color:'#60b8ff'},{gas:'Na',pct:29,color:'#ffcc40'},{gas:'H₂',pct:22,color:'#80e0ff'},{gas:'He',pct:6,color:'#a0f0a0'},{gas:'K',pct:1,color:'#ff9060'}],
      pressure:'~10⁻¹⁵ atm (near vacuum)',temp:'-180°C to +430°C',windSpeed:'No significant winds',
    },
    texture: 'mercury'
  },
  {
    id:'venus', name:'Venus', tagline:'The Scorching Twin',
    color:'#e8c97a', emissive:'#3a2a00',
    orbitRadius:9, size:0.95, orbitSpeed:1.62, rotSpeed:-0.004,
    tilt:177.4, ringless:true,
    stats:{
      diameter:'12,104 km', distanceFromSun:'108M km (avg)', dayLength:'243 Earth days',
      yearLength:'225 Earth days', temp:'465°C constant', moons:'0'
    },
    surface:'Covered by thick toxic clouds of sulfuric acid. A volcanic hellscape below.',
    surfaceComp:[{label:'Volcanic Plains',color:'#c8832a',pct:65},{label:'Highlands',color:'#a06020',pct:35}],
    facts:[
      'Hottest planet in the solar system — hotter than Mercury!',
      'A day on Venus is longer than its year',
      'It rotates backwards — the Sun rises in the west',
      'Atmospheric pressure is 90× that of Earth — like being deep underwater',
      'Has more volcanoes than any other planet',
      'It\'s often the brightest object in our night sky after the Moon'
    ],
    moons:[],
    missions:[
      {name:'Venera 7',year:1970,agency:'USSR',type:'Lander',note:'First spacecraft to successfully land on another planet. Transmitted for 23 minutes before being crushed and melted by Venus\'s extreme conditions.'},
      {name:'Magellan',year:1989,agency:'NASA',type:'Orbiter',note:'Used radar to map 98% of Venus\'s surface through the impenetrable cloud cover, revealing thousands of volcanoes and vast lava plains.'},
      {name:'Venus Express',year:2006,agency:'ESA',type:'Orbiter',note:'Confirmed evidence of ongoing volcanic activity as recently as 2012. Studied the mysterious "cold layer" at the cloud tops.'},
      {name:'DAVINCI+',year:2031,agency:'NASA',type:'Probe',note:'Future mission. Will drop a probe through the atmosphere sampling chemistry layer-by-layer, and image the Alpha Regio highlands from above.'},
    ],
    pois:[
      {name:'Maxwell Montes',desc:'The highest mountains on Venus at 11 km — taller than Everest. Coated in a mysterious metallic frost (likely iron pyrite) that gives the peaks a radar-bright sheen.'},
      {name:'Maat Mons',desc:'An 8 km tall shield volcano with lava flows hundreds of km long. Radar changes between Magellan passes suggest it may have erupted during the mission in 1991.'},
      {name:'Aphrodite Terra',desc:'A vast highland the size of Africa stretching nearly halfway around Venus\'s equator. Contains deep rift valleys and complex folded mountain belts driven by tectonic forces.'},
    ],
    atmosphere:{
      composition:[{gas:'CO₂',pct:96.5,color:'#e8b040'},{gas:'N₂',pct:3.5,color:'#80d0ff'}],
      pressure:'92 atm (like 900m underwater)',temp:'464°C (constant)',windSpeed:'360 km/h upper clouds',
    },
    texture: 'venus'
  },
  {
    id:'earth', name:'Earth', tagline:'Our Blue Home',
    color:'#4a9eca', emissive:'#001a0a',
    orbitRadius:12.5, size:1, orbitSpeed:1, rotSpeed:0.5,
    tilt:23.5, ringless:true,
    stats:{
      diameter:'12,742 km', distanceFromSun:'150M km (1 AU)', dayLength:'24 hours',
      yearLength:'365.25 days', temp:'-88°C to 58°C', moons:'1'
    },
    surface:'71% liquid water oceans, 29% continents with mountains, forests, deserts.',
    surfaceComp:[{label:'Ocean',color:'#2060a0',pct:71},{label:'Land',color:'#3a7a30',pct:21},{label:'Ice',color:'#ddeeff',pct:8}],
    facts:[
      'The only known planet with life — so far!',
      'Our atmosphere is 78% nitrogen and 21% oxygen — perfect for breathing',
      'Earth has a magnetic field that protects us from harmful solar radiation',
      'The deepest point is the Mariana Trench — 11km underwater',
      'Mount Everest is 8.8km tall, but there are mountains taller on other planets',
      'Earth is the densest planet in the solar system'
    ],
    moons:[
      {name:'The Moon', tagline:'Our Constant Companion', desc:'Earth\'s only natural satellite. The Moon stabilizes Earth\'s axial tilt and creates our ocean tides. Astronauts first walked on it on July 20, 1969. Its surface is covered in craters from ancient impacts, and it has mountains, valleys, and ancient volcanic plains called "maria" (seas).', stats:{diameter:'3,474 km', distance:'384,000 km', period:'27.3 days', discovered:'Pre-history'}}
    ],
    missions:[
      {name:'Apollo 11',year:1969,agency:'NASA',type:'Crewed Lander',note:'First humans to walk on the Moon. Neil Armstrong and Buzz Aldrin spent 2.5 hours on the lunar surface collecting 21 kg of samples.'},
      {name:'Hubble Space Telescope',year:1990,agency:'NASA/ESA',type:'Observatory',note:'Revolutionized astronomy with images stretching 13.4 billion light-years into the past. Still operating after 34 years with over 1.6 million observations.'},
      {name:'International Space Station',year:1998,agency:'NASA/ESA/Roscosmos',type:'Space Station',note:'Continuously inhabited since November 2000. A 420-tonne laboratory at 400 km altitude with 17 connected modules and ongoing microgravity research.'},
      {name:'James Webb Telescope',year:2021,agency:'NASA/ESA/CSA',type:'Observatory',note:'The most powerful space telescope ever built. Sees in infrared back to 100 million years after the Big Bang, revealing the universe\'s first galaxies.'},
      {name:'Chandrayaan-3',year:2023,agency:'ISRO (India)',type:'Lunar Lander/Rover',note:'India\'s historic first soft landing on the Moon — near the lunar south pole on Aug 23, 2023. The Pragyan rover confirmed the presence of sulfur and other elements near the south pole for the first time.'},
      {name:'IM-1 / Odysseus',year:2024,agency:'Intuitive Machines / NASA',type:'Commercial Lunar Lander',note:'First privately-built spacecraft to soft-land on the Moon (Feb 22, 2024). Landed near Malapert A crater, though it tipped on its side. Still returned data and images — a milestone for NASA\'s CLPS commercial lunar program.'},
      {name:'Chang\'e 6',year:2024,agency:'CNSA (China)',type:'Sample Return',note:'First-ever mission to collect and return samples from the Moon\'s far side. Landed in the Apollo crater within the South Pole–Aitken Basin on June 1, 2024, and returned 1.9 kg of ancient far-side material to Earth on June 25, 2024.'},
      {name:'IM-2 / Athena',year:2025,agency:'Intuitive Machines / NASA',type:'Commercial Lunar Lander',note:'Launched Feb 26, 2025 under NASA\'s CLPS program. Targeted the Mons Mouton plateau near the lunar south pole — one of humanity\'s most ambitious landing attempts. Carried water-ice prospecting instruments to scout resources for future Artemis astronaut missions.'},
      {name:'Artemis II',year:2025,agency:'NASA',type:'Crewed Lunar Flyby',note:'First crewed mission to fly around the Moon since Apollo 17 in 1972. Astronauts Reid Wiseman, Victor Glover, Christina Koch, and Jeremy Hansen completed a free-return trajectory around the Moon aboard the Orion spacecraft, reaching ~8,900 km above the lunar surface — proving Orion and SLS can carry crew to deep space.'},
    ],
    pois:[
      {name:'Mariana Trench',desc:'The deepest point on Earth at 11 km below sea level — deeper than Everest is tall. Fewer humans have visited the Challenger Deep than have walked on the Moon.'},
      {name:'Amazon Rainforest',desc:'The world\'s largest tropical rainforest at 5.5 million km². Home to 10% of all species on Earth and produces roughly 6% of global oxygen through photosynthesis.'},
      {name:'Mount Everest',desc:'At 8,849 m, the highest point above sea level. The Himalayas grow 5 mm per year as the Indian tectonic plate continues colliding with Eurasia.'},
      {name:'Sahara Desert',desc:'The largest hot desert at 9.2 million km² — nearly the size of the USA. Despite extreme heat, it receives occasional snowfall in its higher elevation areas.'},
    ],
    atmosphere:{
      composition:[{gas:'N₂',pct:78,color:'#4080ff'},{gas:'O₂',pct:21,color:'#60c8ff'},{gas:'Ar',pct:1,color:'#a0d0ff'}],
      pressure:'1 atm',temp:'+15°C average',windSpeed:'Up to 400 km/h (jet streams)',
    },
    texture: 'earth'
  },
  {
    id:'mars', name:'Mars', tagline:'The Red Planet',
    color:'#c1440e', emissive:'#300800',
    orbitRadius:16.5, size:0.53, orbitSpeed:0.532, rotSpeed:0.49,
    tilt:25.2, ringless:true,
    stats:{
      diameter:'6,779 km', distanceFromSun:'228M km (avg)', dayLength:'24h 37min',
      yearLength:'687 Earth days', temp:'-125°C to 20°C', moons:'2'
    },
    surface:'Red iron oxide (rust) dust and rock. Thin CO₂ atmosphere. Giant volcanoes.',
    surfaceComp:[{label:'Basalt Rock',color:'#8b2000',pct:50},{label:'Iron Oxide Dust',color:'#c1440e',pct:35},{label:'Polar Ice',color:'#ddeeff',pct:15}],
    facts:[
      'Home to Olympus Mons — the tallest volcano in the solar system at 22km!',
      'Valles Marineris is a canyon so big it would stretch across the USA',
      'Mars had liquid water billions of years ago',
      'Thin atmosphere means you\'d need a spacesuit, but sky sometimes turns pink/orange',
      'Two tiny potato-shaped moons: Phobos and Deimos',
      'Several rovers are currently exploring Mars right now!'
    ],
    moons:[
      {name:'Phobos', tagline:'The Closer Moon', desc:'Phobos orbits so close to Mars that it rises in the west and sets in the east — opposite to how our Moon moves. It\'s covered in craters and has a huge impact crater named Stickney. It\'s slowly spiraling inward and will either crash into Mars or break apart in about 50 million years!', stats:{diameter:'22 km', distance:'9,376 km', period:'7.6 hours', discovered:'1877'}},
      {name:'Deimos', tagline:'The Farther Moon', desc:'Deimos is the smaller and farther of Mars\' two moons. It\'s so small and far away that from Mars, it looks like a bright star rather than a moon. It\'s thought to be a captured asteroid from the asteroid belt.', stats:{diameter:'12 km', distance:'23,463 km', period:'30.3 hours', discovered:'1877'}}
    ],
    missions:[
      {name:'Viking 1 & 2',year:1976,agency:'NASA',type:'Landers',note:'First successful Mars landings. Conducted biological experiments searching for life — the ambiguous results are still debated by scientists today.'},
      {name:'Mars Pathfinder',year:1997,agency:'NASA',type:'Rover',note:'Deployed Sojourner, the first Mars rover. Proved the airbag landing concept and found evidence of ancient floods that shaped the Martian surface.'},
      {name:'Curiosity',year:2012,agency:'NASA',type:'Rover',note:'Still operating after 12+ years. Confirmed Gale Crater was once a habitable lake. Detected complex organic molecules and methane spikes.'},
      {name:'Perseverance',year:2021,agency:'NASA',type:'Rover',note:'Collecting rock samples for future Earth return. Deployed Ingenuity — the first powered flight on another planet. Produced oxygen from the Martian atmosphere.'},
    ],
    pois:[
      {name:'Olympus Mons',desc:'The tallest volcano in the solar system at 22 km high and 600 km wide — so enormous you couldn\'t see the edge from its center. Three times the height of Everest and 100× the volume of Hawaii\'s Mauna Loa.'},
      {name:'Valles Marineris',desc:'A canyon system 4,000 km long, 200 km wide and 7 km deep. If placed on Earth it would stretch from Los Angeles to New York. Formed by ancient tectonic rifting, not water erosion.'},
      {name:'Jezero Crater',desc:'An ancient lake crater now explored by Perseverance. A beautifully preserved river delta fan is clearly visible from orbit — ideal for preserving biosignatures of any ancient Martian life.'},
      {name:'Hellas Planitia',desc:'The largest confirmed impact crater in the solar system at 2,300 km across and 7 km deep. The floor\'s atmospheric pressure is 89% higher than the Martian average — almost breathable by Mars standards.'},
    ],
    atmosphere:{
      composition:[{gas:'CO₂',pct:95.3,color:'#e87040'},{gas:'N₂',pct:2.7,color:'#80d0ff'},{gas:'Ar',pct:1.6,color:'#a0d0a0'},{gas:'Other',pct:0.4,color:'#808090'}],
      pressure:'0.006 atm',temp:'-60°C average',windSpeed:'Up to 100 km/h',
    },
    texture: 'mars'
  },
  {
    id:'jupiter', name:'Jupiter', tagline:'King of the Planets',
    color:'#c88b3a', emissive:'#1a0800',
    orbitRadius:24, size:2.8, orbitSpeed:0.084, rotSpeed:1.2,
    tilt:3.1, ringless:true,
    stats:{
      diameter:'139,820 km', distanceFromSun:'778M km (avg)', dayLength:'9h 56min',
      yearLength:'11.9 Earth years', temp:'-110°C (clouds)', moons:'95 known'
    },
    surface:'No solid surface — a gas giant. Bands of clouds, giant storms including the Great Red Spot.',
    surfaceComp:[{label:'Hydrogen',color:'#c8a060',pct:75},{label:'Helium',color:'#e0c090',pct:24},{label:'Other',color:'#805028',pct:1}],
    facts:[
      'So massive it could fit all other planets inside it — with room to spare!',
      'The Great Red Spot is a storm that\'s been raging for over 350 years',
      'Jupiter acts as a cosmic shield — its gravity deflects comets away from Earth',
      'Has the fastest rotation — a day is less than 10 hours',
      'Its moon Io is the most volcanically active body in the solar system',
      'Europa may have a liquid water ocean beneath its icy crust — possible life!'
    ],
    moons:[
      {name:'Io', tagline:'Volcanic Wonderland', desc:'Io is the most geologically active world in our solar system. It has hundreds of volcanoes constantly erupting, shooting sulfur plumes hundreds of kilometers into space. Jupiter\'s massive gravity pulls and squeezes Io like a stress ball, generating enormous heat.', stats:{diameter:'3,643 km', distance:'422,000 km', period:'1.77 days', discovered:'1610 (Galileo)'}},
      {name:'Europa', tagline:'Ocean Moon', desc:'Europa has a smooth icy surface that hides a vast liquid water ocean underneath — possibly 2× the volume of all Earth\'s oceans! It\'s one of the best places in the solar system to search for extraterrestrial life. The surface is crisscrossed with reddish lines from the ice cracking.', stats:{diameter:'3,121 km', distance:'671,000 km', period:'3.55 days', discovered:'1610 (Galileo)'}},
      {name:'Ganymede', tagline:'Solar System\'s Largest Moon', desc:'Ganymede is bigger than the planet Mercury! It\'s the only moon in the solar system with its own magnetic field. It has both icy and rocky terrain, ancient impact craters, and grooved regions from tectonic activity. It also likely has a subsurface ocean.', stats:{diameter:'5,268 km', distance:'1,070,000 km', period:'7.15 days', discovered:'1610 (Galileo)'}},
      {name:'Callisto', tagline:'Ancient and Cratered', desc:'Callisto is the most heavily cratered object in the solar system — a record of 4 billion years of impacts. Its surface has barely changed, making it a time capsule of the early solar system. It may also have a subsurface ocean, making it another candidate for potential life.', stats:{diameter:'4,821 km', distance:'1,883,000 km', period:'16.7 days', discovered:'1610 (Galileo)'}}
    ],
    missions:[
      {name:'Pioneer 10',year:1973,agency:'NASA',type:'Flyby',note:'First spacecraft through the asteroid belt and to visit Jupiter. Confirmed the planet is mostly liquid hydrogen and measured its intense radiation belts.'},
      {name:'Voyager 1 & 2',year:1979,agency:'NASA',type:'Flyby',note:'Revealed Jupiter\'s ring system (previously unknown), active volcanoes on Io for the first time, and detailed images of the four Galilean moons.'},
      {name:'Galileo',year:1995,agency:'NASA',type:'Orbiter',note:'First Jupiter orbiter. Dropped an atmospheric probe that survived 57 minutes and 150 km into the crushing atmosphere before being destroyed by pressure.'},
      {name:'Juno',year:2016,agency:'NASA',type:'Orbiter',note:'Currently mapping Jupiter\'s interior, gravity, magnetic field and polar cyclones from a close polar orbit. Extended mission now includes flybys of Ganymede and Europa.'},
    ],
    pois:[
      {name:'Great Red Spot',desc:'A hurricane-like storm larger than Earth that has raged for over 350 years. It\'s been shrinking — in the 1800s it was 3× Earth\'s size. Now it\'s barely 1.3× and scientists don\'t know if it will disappear.'},
      {name:'Europa\'s Ocean',desc:'Beneath 10-30 km of cracked ice lies a saltwater ocean larger than all of Earth\'s oceans combined. Tidal heating may support hydrothermal vents — making it one of the best places to search for life.'},
      {name:'Io\'s Volcanoes',desc:'The most volcanically active body in the solar system with 400+ active volcanoes. Jupiter\'s tidal forces squeeze Io like a stress ball, generating enough heat to resurface the entire moon every million years.'},
      {name:'Ganymede',desc:'The largest moon in the solar system — bigger than Mercury. It\'s the only moon with its own magnetic field and likely has a subsurface ocean sandwiched between layers of ice.'},
    ],
    atmosphere:{
      composition:[{gas:'H₂',pct:89,color:'#e8c878'},{gas:'He',pct:10,color:'#f0e0a0'},{gas:'CH₄',pct:0.3,color:'#c0a040'},{gas:'Other',pct:0.7,color:'#a09060'}],
      pressure:'Extreme (no solid surface)',temp:'-110°C cloud tops',windSpeed:'Up to 600 km/h',
    },
    texture: 'jupiter'
  },
  {
    id:'saturn', name:'Saturn', tagline:'The Ringed Wonder',
    color:'#e8d090', emissive:'#1a1000',
    orbitRadius:33, size:2.3, orbitSpeed:0.034, rotSpeed:1.1,
    tilt:26.7, hasRings:true,
    stats:{
      diameter:'116,460 km', distanceFromSun:'1.43B km (avg)', dayLength:'10h 42min',
      yearLength:'29.5 Earth years', temp:'-140°C (clouds)', moons:'146 known'
    },
    surface:'No solid surface — a gas giant. Beautiful cloud bands and the most spectacular rings.',
    surfaceComp:[{label:'Hydrogen',color:'#d4b870',pct:96},{label:'Helium',color:'#e8d090',pct:3},{label:'Other',color:'#a08040',pct:1}],
    facts:[
      'Its rings are made of ice and rock, and are nearly paper-thin compared to their width',
      'Saturn is less dense than water — it would float in a giant bathtub!',
      'The rings span 282,000 km but are only ~10 meters to 1 km thick',
      'Titan is the only moon with a thick atmosphere — it has lakes of liquid methane!',
      'Saturn has hexagonal storms at its north pole — a shape found nowhere else',
      'Its rings may only be 100–400 million years old — relatively new!'
    ],
    moons:[
      {name:'Titan', tagline:'A World with Weather', desc:'Titan is one of the most Earth-like worlds in the solar system — but with a twist. It has lakes, rivers, and rain — but made of liquid methane and ethane, not water. Its thick orange atmosphere is rich in nitrogen. NASA\'s Dragonfly mission will fly a drone there in the 2030s!', stats:{diameter:'5,151 km', distance:'1,221,870 km', period:'15.9 days', discovered:'1655'}},
      {name:'Enceladus', tagline:'Ice Geyser World', desc:'Enceladus shoots giant plumes of water ice from its south pole into space — feeding Saturn\'s E ring. Underneath its icy crust is a liquid water ocean with hydrothermal vents. Scientists believe it\'s one of the most promising places to find microbial life in our solar system!', stats:{diameter:'504 km', distance:'238,000 km', period:'1.37 days', discovered:'1789'}},
      {name:'Mimas', tagline:'The Death Star Moon', desc:'Mimas has a huge crater called Herschel that takes up nearly a third of its diameter, making it look like the Death Star from Star Wars! It\'s one of the most cratered bodies in the solar system and is mostly made of water ice.', stats:{diameter:'396 km', distance:'185,539 km', period:'0.94 days', discovered:'1789'}},
      {name:'Iapetus', tagline:'The Two-Faced Moon', desc:'Iapetus is dramatically split — one hemisphere is bright white ice, the other is pitch black carbon material. It also has an enormous equatorial ridge up to 20km tall, running around its middle like a walnut seam. Nobody fully understands why!', stats:{diameter:'1,469 km', distance:'3,560,820 km', period:'79.3 days', discovered:'1671'}}
    ],
    missions:[
      {name:'Pioneer 11',year:1979,agency:'NASA',type:'Flyby',note:'First spacecraft to visit Saturn. Discovered the F ring and a new moon, measured the planet\'s magnetic field, and survived the ring plane crossing.'},
      {name:'Voyager 1 & 2',year:1980,agency:'NASA',type:'Flyby',note:'Revealed thousands of individual ringlets in Saturn\'s rings, discovered new moons, and captured the first close-up images of Titan\'s mysterious orange haze.'},
      {name:'Cassini–Huygens',year:2004,agency:'NASA/ESA',type:'Orbiter',note:'Orbited Saturn for 13 years. Dropped Huygens onto Titan\'s surface (the most distant landing ever), and discovered Enceladus\'s life-candidate geysers.'},
      {name:'Dragonfly',year:2028,agency:'NASA',type:'Rotorcraft',note:'Future mission. A nuclear-powered drone will fly across Titan\'s surface, sampling dozens of sites including methane lake shorelines and impact craters.'},
    ],
    pois:[
      {name:'Ring System',desc:'Saturn\'s rings span 282,000 km but are only 10 m to 1 km thick. Made of ice from pea-sized chunks to mountains. They\'re surprisingly young — only 100-400 million years old.'},
      {name:'North Pole Hexagon',desc:'A persistent hexagonal jet stream 30,000 km wide has swirled at Saturn\'s north pole for decades. Each side is longer than Earth\'s diameter. The geometry remains unexplained.'},
      {name:'Titan\'s Methane Lakes',desc:'Titan has lakes, rivers and rain — made of liquid methane. The Ligeia Mare lake is larger than Lake Superior. Wind-shaped methane dunes stretch across its equatorial deserts.'},
      {name:'Enceladus Geysers',desc:'200 km-tall water vapor geysers erupt from the south pole and feed Saturn\'s E ring. A warm saltwater ocean below contains complex organic molecules — a prime life candidate.'},
    ],
    atmosphere:{
      composition:[{gas:'H₂',pct:96,color:'#f0e090'},{gas:'He',pct:3,color:'#e0d070'},{gas:'CH₄',pct:0.4,color:'#c0a040'},{gas:'Other',pct:0.6,color:'#a09060'}],
      pressure:'Extreme (no solid surface)',temp:'-140°C cloud tops',windSpeed:'Up to 1,800 km/h',
    },
    texture: 'saturn'
  },
  {
    id:'uranus', name:'Uranus', tagline:'The Sideways Planet',
    color:'#7de8e8', emissive:'#003333',
    orbitRadius:42, size:1.6, orbitSpeed:0.012, rotSpeed:0.7,
    tilt:97.8, hasRings:true, ringsVertical:true,
    stats:{
      diameter:'50,724 km', distanceFromSun:'2.87B km (avg)', dayLength:'17h 14min',
      yearLength:'84 Earth years', temp:'-224°C', moons:'28 known'
    },
    surface:'No solid surface — an ice giant with a methane-rich atmosphere giving its blue-green color.',
    surfaceComp:[{label:'Water/Ice',color:'#60b8c0',pct:60},{label:'Methane',color:'#7de8e8',pct:25},{label:'Hydrogen/Helium',color:'#a0f0f0',pct:15}],
    facts:[
      'Uranus rotates on its side — its axial tilt is 98°, probably from a giant ancient collision',
      'It\'s the coldest planet in the solar system at -224°C',
      'A single "season" on Uranus lasts 21 Earth years',
      'Its rings were discovered in 1977 and run nearly top-to-bottom instead of sideways',
      'The inside of Uranus might contain a "hot ice" state that doesn\'t exist on Earth',
      'All of its moons are named after Shakespeare and Alexander Pope characters!'
    ],
    moons:[
      {name:'Miranda', tagline:'Clifftop World', desc:'Miranda has the tallest cliffs in the solar system — Verona Rupes is about 20km high! It has a chaotic surface with enormous canyons, terraced layers, and ancient impact craters. Scientists think it may have been shattered and reassembled by gravity.', stats:{diameter:'471 km', distance:'129,390 km', period:'1.41 days', discovered:'1948'}},
      {name:'Ariel', tagline:'Brightest Moon', desc:'Ariel is the brightest of Uranus\'s moons and has a young-looking surface with broad valleys and steep cliffs carved by ancient faults. It may have had recent geological activity driven by internal heating.', stats:{diameter:'1,157 km', distance:'191,020 km', period:'2.52 days', discovered:'1851'}},
      {name:'Titania', tagline:'Largest Uranian Moon', desc:'Titania is the largest moon of Uranus and has a surface of water ice and rock. It features long fault valleys, a few impact craters, and evidence of ancient geological activity. It\'s about half the size of Earth\'s Moon.', stats:{diameter:'1,578 km', distance:'435,910 km', period:'8.71 days', discovered:'1787'}}
    ],
    missions:[
      {name:'Voyager 2',year:1986,agency:'NASA',type:'Flyby',note:'The ONLY spacecraft to ever visit Uranus. A 5.5-hour flyby within 81,500 km discovered 10 new moons, 2 new rings, and found the planet\'s magnetic field is tilted 60° from its rotation axis.'},
      {name:'Uranus Orbiter & Probe',year:2030,agency:'NASA (planned)',type:'Orbiter',note:'Ranked #1 priority by the 2023 Planetary Science Decadal Survey. Would orbit for years to study the strange magnetic field, ring system, and potentially habitable moons.'},
    ],
    pois:[
      {name:'Verona Rupes',desc:'The tallest known cliff in the solar system on Uranus\'s moon Miranda — 20 km straight down. An object dropped from the top would take over 12 minutes to reach the bottom due to Miranda\'s low gravity.'},
      {name:'Sideways Rotation',desc:'Uranus rotates on its side with a 98° axial tilt — its poles point almost directly at the Sun. Each pole experiences 42 Earth years of continuous sunlight, then 42 years of darkness.'},
      {name:'Dark Ring System',desc:'Unlike Saturn\'s bright icy rings, Uranus has 13 dark, narrow rings running nearly pole-to-pole. Discovered in 1977 when astronomers watched a star blink out as the rings passed in front of it.'},
    ],
    atmosphere:{
      composition:[{gas:'H₂',pct:83,color:'#60d8e8'},{gas:'He',pct:15,color:'#80e8f0'},{gas:'CH₄',pct:2.3,color:'#a0f0e8'}],
      pressure:'1 atm (reference level)',temp:'-224°C (coldest planet)',windSpeed:'Up to 900 km/h',
    },
    texture: 'uranus'
  },
  {
    id:'neptune', name:'Neptune', tagline:'The Windy Giant',
    color:'#4b70dd', emissive:'#000830',
    orbitRadius:52, size:1.55, orbitSpeed:0.006, rotSpeed:0.65,
    tilt:28.3, ringless:true,
    stats:{
      diameter:'49,244 km', distanceFromSun:'4.5B km (avg)', dayLength:'16h 6min',
      yearLength:'165 Earth years', temp:'-214°C', moons:'16 known'
    },
    surface:'No solid surface — a deep blue ice giant with the fastest winds in the solar system.',
    surfaceComp:[{label:'Water/Ice',color:'#2040a0',pct:55},{label:'Methane',color:'#4b70dd',pct:30},{label:'Hydrogen/Helium',color:'#7090f0',pct:15}],
    facts:[
      'Has the fastest winds in the solar system — up to 2,100 km/h!',
      'The Great Dark Spot was a storm as large as Earth (it disappeared by 1994)',
      'It takes 165 Earth years to orbit the Sun — it only just completed its first orbit since discovery in 2011!',
      'Its largest moon Triton orbits backwards — it was probably captured from the Kuiper Belt',
      'Neptune was discovered by math before it was seen — astronomers predicted it from Uranus\'s wobble',
      'Despite being farther, it\'s slightly warmer than Uranus due to internal heat'
    ],
    moons:[
      {name:'Triton', tagline:'The Backwards Moon', desc:'Triton is the only large moon in the solar system that orbits in the opposite direction of its planet\'s rotation. This means it was captured by Neptune\'s gravity — and it\'s slowly spiraling inward. In about 3.6 billion years it will break apart and form a ring system rivaling Saturn\'s! It has geysers of nitrogen and a surface of frozen nitrogen and methane.', stats:{diameter:'2,706 km', distance:'354,759 km', period:'5.88 days (retrograde)', discovered:'1846'}}
    ],
    missions:[
      {name:'Voyager 2',year:1989,agency:'NASA',type:'Flyby',note:'The ONLY spacecraft to visit Neptune. A 5-hour encounter revealed 6 new moons, 4 rings, the Great Dark Spot, and active nitrogen geysers on Triton\'s surface.'},
      {name:'Neptune Odyssey',year:2030,agency:'NASA (proposed)',type:'Orbiter',note:'Proposed mission to orbit Neptune and conduct a dedicated Triton flyby campaign. Would answer whether Triton has a subsurface ocean and whether it could support life.'},
    ],
    pois:[
      {name:'Great Dark Spot',desc:'A storm the size of Earth observed by Voyager in 1989. When Hubble looked again in 1994, it had completely vanished — replaced by a new storm system in the northern hemisphere. Neptune\'s storms are short-lived compared to Jupiter\'s.'},
      {name:'Triton Geysers',desc:'Neptune\'s largest moon erupts nitrogen geysers 8 km high from its surface of frozen nitrogen. Triton orbits backwards and is slowly spiraling inward — it will break up in 3.6 billion years to form spectacular new rings.'},
      {name:'Supersonic Winds',desc:'Neptune\'s winds reach 2,100 km/h — the fastest in the solar system and faster than the speed of sound on Earth. This is mysterious given Neptune receives 900× less sunlight than Earth.'},
    ],
    atmosphere:{
      composition:[{gas:'H₂',pct:80,color:'#4060d0'},{gas:'He',pct:19,color:'#5070e0'},{gas:'CH₄',pct:1.5,color:'#7090f0'}],
      pressure:'1 atm (reference level)',temp:'-214°C',windSpeed:'Up to 2,100 km/h',
    },
    texture: 'neptune'
  },
  {
    id:'pluto', name:'Pluto', tagline:'The Dwarf Planet',
    color:'#c4a882', emissive:'#0d0906',
    orbitRadius:72, size:0.2, orbitSpeed:0.0041, rotSpeed:-0.0028,
    tilt:122.5, ringless:true,
    stats:{diameter:'2,376 km',distanceFromSun:'5.9B km (avg)',dayLength:'6.4 Earth days',yearLength:'248 Earth years',temp:'−230°C',moons:'5'},
    surface:'Rocky, icy world with nitrogen ice plains, towering water-ice mountains, and a surprisingly young, geologically active surface.',
    surfaceComp:[{label:'Nitrogen Ice',color:'#c8c4b0',pct:55},{label:'Water Ice',color:'#a0c8e0',pct:30},{label:'Rock/Tholins',color:'#8a6040',pct:15}],
    facts:[
      'Has a giant heart-shaped nitrogen ice plain — Tombaugh Regio — the size of Texas & Oklahoma combined',
      'First explored up close by New Horizons in July 2015 after a 9.5-year journey across 7.5 billion km',
      'Charon is so massive relative to Pluto, they orbit a common point between them — a true binary system',
      'Has mountains of water ice up to 3,500 m tall — as high as the Rockies',
      'Reclassified as a "dwarf planet" in 2006, 76 years after its discovery in 1930',
      'Its heart-shaped ice plain is the result of slow convection cells in nitrogen ice — it\'s geologically alive'
    ],
    moons:[
      {name:'Charon',tagline:'The Binary Partner',desc:'At half the size of Pluto, Charon is so large the two worlds orbit each other around a point in empty space between them. Its red polar cap "Mordor Macula" is stained by organic compounds that escape Pluto\'s atmosphere and freeze there.',stats:{diameter:'1,212 km',distance:'19,591 km',period:'6.4 days',discovered:'1978'}},
      {name:'Nix',tagline:'The Tumbling Moon',desc:'Nix tumbles chaotically in its orbit due to gravitational interactions between Pluto and Charon. Its surface is covered in water ice, making it one of the brightest Kuiper Belt objects.',stats:{diameter:'~49 km',distance:'48,694 km',period:'24.9 days',discovered:'2005'}}
    ],
    missions:[
      {name:'New Horizons',year:2015,agency:'NASA',type:'Flyby',note:'The first and only spacecraft to visit Pluto. Its July 2015 flyby revealed a surprisingly active world with mountains, flowing nitrogen ice, and a complex thin atmosphere — stunning scientists worldwide.'},
    ],
    pois:[
      {name:'Tombaugh Regio',desc:'The famous heart-shaped plain of nitrogen ice. The left lobe — Sputnik Planitia — is a 1,000 km wide basin of slowly convecting nitrogen ice cells, so smooth it looks airbrushed. It may hide a subsurface liquid water ocean.'},
      {name:'Hillary & Tenzing Montes',desc:'Mountain ranges of water ice rising 3,500 meters above Sputnik Planitia. Named after Edmund Hillary and Tenzing Norgay, first climbers of Everest. Water ice is hard as rock at Pluto\'s temperatures, making these real mountains.'},
      {name:'Cthulhu Macula',desc:'A vast dark red region 3,000 km long, one of the darkest places in the outer solar system. Covered in reddish tholins — complex organic molecules created by radiation hitting nitrogen and methane. The color of prebiotic chemistry.'},
    ],
    atmosphere:{
      composition:[{gas:'N₂',pct:98,color:'#c8e0ff'},{gas:'CH₄',pct:1.5,color:'#e0c080'},{gas:'CO',pct:0.5,color:'#c0f0a0'}],
      pressure:'~1 Pa (freezes seasonally)',temp:'−230°C',windSpeed:'Very light'
    },
    texture:'pluto'
  }
];

// ─── MISSIONS DATA ───────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id:'iss', name:'International Space Station', short:'ISS',
    tagline:'Humanity\'s Outpost in Space',
    agency:'NASA / ESA / Roscosmos / JAXA / CSA', type:'Space Station',
    launched:'1998', status:'active', color:0x88ccff,
    hostPlanet:'earth', orbitHeight:1.28, orbitSpeed:14,
    desc:'The International Space Station is a multinational modular laboratory in low Earth orbit, continuously occupied since November 2000. It has hosted 273 people from 20 countries and serves as the world\'s premier microgravity research platform. Visible to the naked eye, it orbits Earth every 90 minutes at 27,600 km/h — a testament to what humanity can achieve through international cooperation.',
    facts:['Orbits Earth every 90 minutes at 27,600 km/h','As large as a football field — 109 meters across','Continuously occupied since November 2000','Has hosted 273 people from 20 countries','Visible to the naked eye from Earth on clear nights'],
    stats:{launched:'1998',altitude:'408 km',speed:'27,600 km/h',size:'109 × 73 m',crew:'6–7',mass:'420,000 kg'},
    photos:[
      {src:'photos/missions/iss/exterior.jpg',caption:'ISS exterior from a visiting spacecraft'},
      {src:'photos/missions/iss/earth_view.jpg',caption:'Earth as seen from the ISS'},
      {src:'photos/missions/iss/cupola.jpg',caption:'The cupola observation module'},
    ]
  },
  {
    id:'hubble', name:'Hubble Space Telescope', short:'Hubble',
    tagline:'Window to the Universe',
    agency:'NASA / ESA', type:'Space Telescope',
    launched:'1990', status:'active', color:0xaaddff,
    hostPlanet:'earth', orbitHeight:1.55, orbitSpeed:7,
    desc:'Launched in 1990, Hubble has fundamentally changed our view of the cosmos. It has made over 1.5 million observations and helped determine the age of the universe at 13.8 billion years. Its iconic images — the Pillars of Creation, the Hubble Deep Field — have become defining photographs of the human age. Despite early mirror problems, a 1993 servicing mission restored its vision and made it the telescope that transformed astronomy.',
    facts:['Has made more than 1.5 million observations since 1990','Orbits Earth 15 times per day at 547 km altitude','Can resolve objects 100× better than ground telescopes','Helped determine the universe is 13.8 billion years old','Sent back over 600,000 stunning astronomical images'],
    stats:{launched:'1990',altitude:'547 km',speed:'27,300 km/h',mirror:'2.4 m',mass:'11,110 kg',lifespan:'35+ years'},
    photos:[
      {src:'photos/missions/hubble/telescope.jpg',caption:'Hubble Space Telescope in orbit'},
      {src:'photos/missions/hubble/deep_field.jpg',caption:'Hubble Deep Field — thousands of galaxies'},
      {src:'photos/missions/hubble/nebula.jpg',caption:'Pillars of Creation in the Eagle Nebula'},
    ]
  },
  {
    id:'jwst', name:'James Webb Space Telescope', short:'JWST',
    tagline:'Seeing the First Light',
    agency:'NASA / ESA / CSA', type:'Space Telescope',
    launched:'2021', status:'active', color:0xffdd88,
    hostPlanet:null, deepSpacePos:{x:72,y:6,z:32},
    desc:'Webb is the most powerful space telescope ever built. Operating 1.5 million km from Earth at the L2 Lagrange point, it peers into the infrared to see the very first galaxies that formed just 300 million years after the Big Bang. Its 6.5-meter gold-coated mirror — made of 18 hexagonal segments — captures light from the faintest, most distant objects ever observed. Released in July 2022, its first images stunned the world.',
    facts:['Launched Christmas Day 2021, arrived at L2 in January 2022','Infrared vision reveals galaxies from 300 million years after the Big Bang','Mirror spans 6.5 m — 2.7× larger than Hubble\'s','Operates at −233°C to reduce infrared background noise','First images released July 2022 showed 4.6-billion-year-old galaxy cluster'],
    stats:{launched:'2021',location:'L2 Point (1.5M km)',mirror:'6.5 m',mass:'6,200 kg',temp:'−233°C',cost:'$10 billion'},
    photos:[
      {src:'photos/missions/jwst/telescope.jpg',caption:'JWST with its golden mirror array'},
      {src:'photos/missions/jwst/deep_field.jpg',caption:'First deep field — thousands of ancient galaxies'},
      {src:'photos/missions/jwst/carina.jpg',caption:'Cosmic Cliffs in the Carina Nebula'},
    ]
  },
  {
    id:'voyager', name:'Voyager 1', short:'Voyager 1',
    tagline:'Humanity\'s Farthest Traveler',
    agency:'NASA / JPL', type:'Deep Space Probe',
    launched:'1977', status:'active', color:0xffaa44,
    hostPlanet:null, deepSpacePos:{x:-92,y:14,z:-52},
    desc:'Launched in 1977, Voyager 1 is the most distant human-made object ever created — over 24 billion km from Earth. It entered interstellar space in August 2012, becoming the first spacecraft to leave our solar system. Still transmitting faint data powered by a decaying nuclear battery, it has redefined what it means to explore. Its famous "Pale Blue Dot" photograph, taken in 1990 at Carl Sagan\'s request, showed Earth as a tiny mote in a sunbeam.',
    facts:['Over 24 billion km from Earth — signals take 22+ hours to arrive','Still operational after 46+ years of flight','Entered interstellar space in August 2012 — first ever','Travelling at 17 km/s — about 61,000 km/h','Carries the Golden Record, a message to any extraterrestrial finders'],
    stats:{launched:'1977',distance:'24+ billion km',speed:'61,000 km/h',power:'~4W (nuclear)',status:'Interstellar space',mass:'825 kg'},
    photos:[
      {src:'photos/missions/voyager/pale_blue_dot.jpg',caption:'Pale Blue Dot — Earth from 6 billion km'},
      {src:'photos/missions/voyager/jupiter.jpg',caption:'Jupiter\'s Great Red Spot photographed by Voyager'},
      {src:'photos/missions/voyager/golden_record.jpg',caption:'The Golden Record — humanity\'s message to the stars'},
    ]
  },
  {
    id:'perseverance', name:'Perseverance Rover', short:'Perseverance',
    tagline:'Seeking Ancient Life on Mars',
    agency:'NASA / JPL', type:'Mars Rover',
    launched:'2020', status:'active', color:0xff8844,
    hostPlanet:'mars', surfaceMission:true,
    desc:'Perseverance landed in Jezero Crater — an ancient lake and river delta — on February 18, 2021. It is the most capable Mars rover ever built, carrying 23 cameras, 2 microphones (first to record audio on Mars), and a laser that vaporizes rocks. It deployed Ingenuity, the first powered aircraft to fly on another planet. Its primary mission is astrobiology: searching for signs of ancient microbial life and caching samples for eventual return to Earth.',
    facts:['Landed in Jezero Crater — an ancient lake bed and river delta on Feb 18, 2021','Deployed Ingenuity helicopter — first powered flight on another planet','Produced oxygen from CO₂ using the MOXIE experiment','Collected 23+ rock core samples for future Earth return','Has a laser that can vaporize rocks 7 meters away'],
    stats:{landed:'Feb 18, 2021',location:'Jezero Crater, Mars',speed:'152 m/hr max',power:'Nuclear RTG',mass:'1,025 kg',samples:'23+ cores'},
    photos:[
      {src:'photos/missions/perseverance/rover.jpg',caption:'Perseverance rover on the Martian surface'},
      {src:'photos/missions/perseverance/ingenuity.jpg',caption:'Ingenuity helicopter in flight on Mars'},
      {src:'photos/missions/perseverance/surface.jpg',caption:'Martian surface from Perseverance\'s cameras'},
    ]
  },
  {
    id:'juno', name:'Juno', short:'Juno',
    tagline:'Unlocking Jupiter\'s Secrets',
    agency:'NASA / JPL', type:'Jupiter Orbiter',
    launched:'2011', status:'active', color:0xffcc44,
    hostPlanet:'jupiter', orbitHeight:1.85, orbitSpeed:4,
    desc:'Juno arrived at Jupiter on July 4, 2016 after a 5-year journey, and has been revealing the gas giant\'s secrets ever since. It dives close to the cloud tops at 130,000 km/h in a polar orbit, studying Jupiter\'s composition, gravity, magnetic field, and polar magnetosphere. JunoCam has captured breathtaking images of Jupiter\'s swirling storms — including a geometric pattern of cyclones at the north pole unlike anything seen before.',
    facts:['Arrived at Jupiter on July 4, 2016 after a 5-year journey','Orbits pole-to-pole, diving to 4,200 km above cloud tops','Discovered geometric cyclone storms at Jupiter\'s north pole','Solar-powered — has the largest solar panels ever used in deep space','Jupiter\'s magnetic field is 10× stronger than expected'],
    stats:{launched:'2011',arrived:'July 2016',altitude:'~4,200 km',speed:'130,000 km/h',power:'Solar',mass:'3,625 kg'},
    photos:[
      {src:'photos/missions/juno/spacecraft.jpg',caption:'Juno spacecraft approaching Jupiter'},
      {src:'photos/missions/juno/jupiter_cloud.jpg',caption:'Jupiter\'s swirling cloud systems from Juno'},
      {src:'photos/missions/juno/great_red_spot.jpg',caption:'Great Red Spot close-up from JunoCam'},
    ]
  },
  {
    id:'new_horizons', name:'New Horizons', short:'New Horizons',
    tagline:'First Visit to Pluto',
    agency:'NASA / APL', type:'Deep Space Probe',
    launched:'2006', status:'active', color:0x88aaff,
    hostPlanet:null, deepSpacePos:{x:-55,y:-6,z:86},
    desc:'New Horizons was the fastest spacecraft ever launched, leaving Earth at 58,000 km/h. It reached Pluto in July 2015 after a 9.5-year journey, revealing it as a geologically complex world with mountains of water ice, a vast nitrogen-ice heart, and an active atmosphere. It then continued to fly by Arrokoth in 2019 — the most distant object ever explored. Now in the Kuiper Belt, it is over 8 billion km from the Sun.',
    facts:['Fastest spacecraft ever launched — 58,536 km/h from Earth','Reached Pluto in 9.5 years, covering 7.5 billion km','Discovered Pluto\'s heart — the nitrogen ice plain Tombaugh Regio','Pluto has water ice mountains up to 3,500 m tall','Performed the most distant object flyby ever (Arrokoth, 2019)'],
    stats:{launched:'2006',pluto_flyby:'July 2015',distance:'8+ billion km',speed:'51,500 km/h',power:'Nuclear RTG',mass:'478 kg'},
    photos:[
      {src:'photos/missions/new_horizons/pluto.jpg',caption:'Pluto in true color from New Horizons'},
      {src:'photos/missions/new_horizons/heart.jpg',caption:'Tombaugh Regio — Pluto\'s heart-shaped nitrogen ice plain'},
      {src:'photos/missions/new_horizons/charon.jpg',caption:'Charon, Pluto\'s largest moon'},
    ]
  },
  {
    id:'cassini', name:'Cassini–Huygens', short:'Cassini',
    tagline:'Saturn\'s Grand Finale',
    agency:'NASA / ESA / ASI', type:'Saturn Orbiter',
    launched:'1997', status:'complete', color:0xddaa55,
    hostPlanet:'saturn', orbitHeight:2.9, orbitSpeed:2.5,
    desc:'Cassini orbited Saturn for 13 extraordinary years (2004–2017), fundamentally changing our understanding of the ringed giant and its moons. It discovered active water-ice geysers erupting from Enceladus — a moon with a subsurface liquid ocean and the most likely place to find extraterrestrial life in our solar system. The Huygens probe descended through Titan\'s thick atmosphere in 2005, landing on a world with rain, rivers, and seas of liquid methane. On September 15, 2017, Cassini plunged into Saturn\'s atmosphere in a final "Grand Finale," transmitting until the last moment.',
    facts:['Orbited Saturn for 13 years — completed 293 orbits','Discovered water geysers on Enceladus — a candidate for extraterrestrial life','Huygens probe: first landing in the outer solar system (Titan, 2005)','Titan has rain, rivers, lakes, and seas — but of liquid methane','Grand Finale: dove into Saturn\'s atmosphere on Sept 15, 2017'],
    stats:{launched:'1997',arrived:'July 2004',ended:'Sept 15, 2017',orbits:'293',duration:'13 years',mass:'5,712 kg'},
    photos:[
      {src:'photos/missions/cassini/rings.jpg',caption:'Saturn and its magnificent rings from Cassini'},
      {src:'photos/missions/cassini/enceladus.jpg',caption:'Water geysers erupting from Enceladus'},
      {src:'photos/missions/cassini/saturn.jpg',caption:'Saturn as seen by Cassini'},
    ]
  },
];

// ─── TEXTURE GENERATION ─────────────────────────────────────────────────────
function makeTexture(id, size=1024) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const w = size, h = size;

  function hash(x,y){const a=Math.sin(x*127.1+y*311.7)*43758.5453;return a-Math.floor(a);}
  function smoothNoise(x,y){
    const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
    const ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy);
    return hash(ix,iy)*(1-ux)*(1-uy)+hash(ix+1,iy)*ux*(1-uy)+hash(ix,iy+1)*(1-ux)*uy+hash(ix+1,iy+1)*ux*uy;
  }
  function fbm(x,y,oct=6,freq=1,seed=0){
    let v=0,a=0.5,f=freq;
    for(let i=0;i<oct;i++){v+=a*smoothNoise(x*f+seed,y*f+seed*1.3);a*=0.5;f*=2;}
    return v;
  }
  function crater(cx,cy,r,depth=0.6){
    const rim=ctx.createRadialGradient(cx,cy,r*.6,cx,cy,r*1.1);
    rim.addColorStop(0,'rgba(0,0,0,0)');rim.addColorStop(.7,'rgba(190,185,175,0.3)');rim.addColorStop(.88,'rgba(210,205,195,0.45)');rim.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=rim;ctx.fillRect(cx-r*1.2,cy-r*1.2,r*2.4,r*2.4);
    const floor=ctx.createRadialGradient(cx,cy,0,cx,cy,r*.65);
    floor.addColorStop(0,`rgba(35,30,25,${depth*.55})`);floor.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=floor;ctx.beginPath();ctx.arc(cx,cy,r*.68,0,Math.PI*2);ctx.fill();
  }

  if(id==='mercury'){
    const grd=ctx.createRadialGradient(w*.38,h*.32,0,w*.5,h*.5,w*.6);
    grd.addColorStop(0,'#d0c8b8');grd.addColorStop(.4,'#a09080');grd.addColorStop(.75,'#787060');grd.addColorStop(1,'#504840');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
      const n=fbm(x/w*8,y/h*8,4,1,7);
      if(n>.6){ctx.fillStyle=`rgba(185,165,135,${(n-.6)*.45})`;ctx.fillRect(x,y,2,2);}
      else if(n<.35){ctx.fillStyle=`rgba(38,33,28,${(.35-n)*.4})`;ctx.fillRect(x,y,2,2);}
    }
    crater(w*.24,h*.4,w*.12,.5);crater(w*.68,h*.6,w*.08,.4);crater(w*.45,h*.75,w*.07,.45);crater(w*.8,h*.28,w*.05,.5);
    for(let i=0;i<140;i++)crater(Math.random()*w,Math.random()*h,w*(.008+Math.random()*.032),.5+Math.random()*.4);
    for(let i=0;i<250;i++){const cx=Math.random()*w,cy=Math.random()*h,r=w*(.002+Math.random()*.007);ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=`rgba(${30+Math.random()*30},${25+Math.random()*25},${20+Math.random()*15},.65)`;ctx.fill();}
    const pole=ctx.createLinearGradient(0,0,0,h);
    pole.addColorStop(0,'rgba(20,15,10,.5)');pole.addColorStop(.15,'rgba(0,0,0,0)');pole.addColorStop(.85,'rgba(0,0,0,0)');pole.addColorStop(1,'rgba(18,13,8,.45)');
    ctx.fillStyle=pole;ctx.fillRect(0,0,w,h);

  }else if(id==='venus'){
    ctx.fillStyle='#c88820';ctx.fillRect(0,0,w,h);
    const bandC=['#e8c040','#d4a030','#f0d060','#c89028','#e0b840','#cc9020','#eecc50','#d0a030','#e8c848','#c49020'];
    bandC.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(0,(i/bandC.length)*h,w,(h/bandC.length)+1);});
    for(let y=0;y<h;y+=1)for(let x=0;x<w;x+=2){
      const n=fbm(x/w*6+y/h*2,y/h*5,5,1,13),n2=fbm(x/w*4,y/h*7,4,1,29);
      if(n>.6){ctx.fillStyle=`rgba(255,240,160,${(n-.6)*.75})`;ctx.fillRect(x,y,2,1);}
      if(n2<.28){ctx.fillStyle=`rgba(100,55,0,${(.28-n2)*.55})`;ctx.fillRect(x,y,2,1);}
    }
    const ph=ctx.createLinearGradient(0,0,0,h);
    ph.addColorStop(0,'rgba(255,240,200,.5)');ph.addColorStop(.12,'rgba(0,0,0,0)');ph.addColorStop(.88,'rgba(0,0,0,0)');ph.addColorStop(1,'rgba(255,230,180,.4)');
    ctx.fillStyle=ph;ctx.fillRect(0,0,w,h);

  }else if(id==='earth'){
    ctx.fillStyle='#0d4f8a';ctx.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
      const n=fbm(x/w*5,y/h*5,4,1,3);
      if(n>.55){ctx.fillStyle=`rgba(30,105,185,${(n-.55)*.4})`;ctx.fillRect(x,y,2,2);}
      else if(n<.38){ctx.fillStyle=`rgba(4,28,68,${(.38-n)*.5})`;ctx.fillRect(x,y,2,2);}
    }
    function land(cx,cy,rx,ry,col,rot=0){
      ctx.save();ctx.translate(cx*w,cy*h);ctx.rotate(rot);
      const g=ctx.createRadialGradient(0,0,0,0,0,rx*w);
      g.addColorStop(0,col);g.addColorStop(.72,col);g.addColorStop(1,'rgba(13,79,138,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,rx*w,ry*h,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    land(.12,.28,.09,.13,'#3a8030');land(.18,.38,.07,.10,'#5a9030');land(.08,.33,.05,.09,'#2a6828');
    land(.23,.52,.05,.10,'#4a9028');land(.20,.62,.04,.08,'#3a8020');
    land(.46,.26,.05,.07,'#6a9838');land(.50,.23,.04,.05,'#5a8830');
    land(.47,.42,.07,.13,'#8a9840');land(.48,.56,.05,.08,'#7a8838');land(.50,.65,.03,.04,'#608028');
    land(.60,.25,.13,.10,'#5a8830');land(.72,.30,.08,.08,'#4a7828');land(.65,.38,.06,.06,'#6a9038');land(.78,.38,.04,.05,'#507828');
    land(.74,.56,.05,.04,'#9a9040');
    land(.33,.15,.04,.05,'#b0c8b0');
    land(.62,.42,.03,.06,'#7a9030');
    for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
      const n=fbm(x/w*12,y/h*12,3,1,55);
      if(n>.7){ctx.fillStyle=`rgba(120,100,58,${(n-.7)*.6})`;ctx.fillRect(x,y,2,2);}
    }
    const iceN=ctx.createLinearGradient(0,0,0,h);
    iceN.addColorStop(0,'rgba(230,242,255,1)');iceN.addColorStop(.08,'rgba(205,228,255,.85)');iceN.addColorStop(.13,'rgba(180,210,240,0)');
    ctx.fillStyle=iceN;ctx.fillRect(0,0,w,h);
    const iceS=ctx.createLinearGradient(0,h,0,0);
    iceS.addColorStop(0,'rgba(220,238,255,1)');iceS.addColorStop(.06,'rgba(200,225,255,.7)');iceS.addColorStop(.10,'rgba(0,0,0,0)');
    ctx.fillStyle=iceS;ctx.fillRect(0,0,w,h);
    for(let i=0;i<70;i++){
      const cx=Math.random()*w,cy=Math.random()*h,cw=50+Math.random()*140,ch=7+Math.random()*20;
      ctx.fillStyle=`rgba(255,255,255,${.10+Math.random()*.22})`;
      ctx.beginPath();ctx.ellipse(cx,cy,cw,ch,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();
    }

  }else if(id==='mars'){
    const grd=ctx.createRadialGradient(w*.35,h*.35,0,w*.5,h*.5,w*.6);
    grd.addColorStop(0,'#e07040');grd.addColorStop(.5,'#c04020');grd.addColorStop(.8,'#902808');grd.addColorStop(1,'#601800');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
      const n=fbm(x/w*7,y/h*7,5,1,17);
      if(n>.6){ctx.fillStyle=`rgba(225,120,62,${(n-.6)*.55})`;ctx.fillRect(x,y,2,2);}
      else if(n<.33){ctx.fillStyle=`rgba(58,10,0,${(.33-n)*.6})`;ctx.fillRect(x,y,2,2);}
    }
    ctx.save();ctx.globalAlpha=.5;
    for(let x=w*.25;x<w*.65;x+=4){const vy=h*.48+Math.sin(x/w*15)*h*.015;ctx.fillStyle='rgba(38,8,0,.55)';ctx.fillRect(x,vy-3,4,8);}
    ctx.restore();
    const om=ctx.createRadialGradient(w*.28,h*.33,0,w*.28,h*.33,w*.075);
    om.addColorStop(0,'rgba(215,135,82,.72)');om.addColorStop(.5,'rgba(182,92,52,.32)');om.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=om;ctx.fillRect(0,0,w,h);
    for(let i=0;i<70;i++)crater(Math.random()*w,Math.random()*h,w*(.01+Math.random()*.027),.55);
    const iceN=ctx.createLinearGradient(0,0,0,h);
    iceN.addColorStop(0,'rgba(232,242,255,1)');iceN.addColorStop(.06,'rgba(212,228,242,.9)');iceN.addColorStop(.12,'rgba(0,0,0,0)');
    ctx.fillStyle=iceN;ctx.fillRect(0,0,w,h);
    const iceS=ctx.createLinearGradient(0,h,0,0);
    iceS.addColorStop(0,'rgba(222,237,255,.95)');iceS.addColorStop(.05,'rgba(0,0,0,0)');
    ctx.fillStyle=iceS;ctx.fillRect(0,0,w,h);
    for(let i=0;i<14;i++){const cx=Math.random()*w,cy=h*.28+Math.random()*h*.44;ctx.fillStyle=`rgba(212,142,82,${.07+Math.random()*.14})`;ctx.beginPath();ctx.ellipse(cx,cy,65+Math.random()*190,9+Math.random()*16,Math.random()*.5,0,Math.PI*2);ctx.fill();}

  }else if(id==='jupiter'){
    const bands=[
      {c:'#c8943a',h:.08},{c:'#eed098',h:.055},{c:'#b87020',h:.09},{c:'#f2e0a2',h:.055},
      {c:'#a05c18',h:.08},{c:'#e2ca7a',h:.065},{c:'#b87828',h:.085},{c:'#f0dca0',h:.055},
      {c:'#9a5810',h:.08},{c:'#dcc068',h:.065},{c:'#c07828',h:.085},{c:'#f0e0a4',h:.055},
      {c:'#aa6820',h:.065}
    ];
    let by=0;
    bands.forEach(band=>{
      const bh=band.h*h;ctx.fillStyle=band.c;ctx.fillRect(0,by,w,bh+1);
      for(let x=0;x<w;x+=3){const wy=Math.sin(x/w*Math.PI*9+by*.012)*h*.006;ctx.fillStyle='rgba(0,0,0,.1)';ctx.fillRect(x,by+wy,3,3);}
      by+=bh;
    });
    for(let y=0;y<h;y+=1)for(let x=0;x<w;x+=3){
      const n=fbm(x/w*10,y/h*15,3,1,23);
      if(n>.66){ctx.fillStyle=`rgba(255,222,162,${(n-.66)*.32})`;ctx.fillRect(x,y,3,1);}
      else if(n<.28){ctx.fillStyle=`rgba(58,22,0,${(.28-n)*.28})`;ctx.fillRect(x,y,3,1);}
    }
    const rsg=ctx.createRadialGradient(w*.62,h*.57,0,w*.62,h*.57,w*.075);
    rsg.addColorStop(0,'rgba(155,28,8,.92)');rsg.addColorStop(.4,'rgba(190,58,18,.82)');rsg.addColorStop(.7,'rgba(202,78,28,.52)');rsg.addColorStop(1,'rgba(202,78,28,0)');
    ctx.fillStyle=rsg;ctx.fillRect(0,0,w,h);
    ctx.beginPath();ctx.ellipse(w*.62,h*.57,w*.068,h*.04,0,0,Math.PI*2);ctx.fillStyle='rgba(135,18,0,.55)';ctx.fill();
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;ctx.beginPath();ctx.ellipse(w*.62+Math.cos(a)*w*.042,h*.57+Math.sin(a)*h*.026,w*.013,h*.007,a,0,Math.PI*2);ctx.fillStyle='rgba(178,58,8,.28)';ctx.fill();}
    [[.2,.35],[.8,.42],[.4,.7],[.7,.25],[.15,.6]].forEach(([sx,sy])=>{ctx.beginPath();ctx.ellipse(sx*w,sy*h,w*.022,h*.012,0,0,Math.PI*2);ctx.fillStyle='rgba(232,202,162,.32)';ctx.fill();});

  }else if(id==='saturn'){
    const bands=[
      {c:'#f2e492',h:.10},{c:'#d8c060',h:.08},{c:'#ede080',h:.10},{c:'#c8aa48',h:.09},
      {c:'#f4ea9a',h:.10},{c:'#d4b858',h:.09},{c:'#ecde7a',h:.10},{c:'#ccaa48',h:.09},
      {c:'#f2e28a',h:.10},{c:'#d0b450',h:.07},{c:'#eada72',h:.08}
    ];
    let by=0;
    bands.forEach(band=>{const bh=band.h*h;ctx.fillStyle=band.c;ctx.fillRect(0,by,w,bh+1);by+=bh;});
    for(let y=0;y<h;y+=1)for(let x=0;x<w;x+=4){
      const n=fbm(x/w*8,y/h*12,3,1,37);
      if(n>.62){ctx.fillStyle=`rgba(255,248,202,${(n-.62)*.2})`;ctx.fillRect(x,y,4,1);}
      else if(n<.34){ctx.fillStyle=`rgba(78,48,0,${(.34-n)*.18})`;ctx.fillRect(x,y,4,1);}
    }
    const hex=ctx.createRadialGradient(w*.5,h*.07,0,w*.5,h*.07,w*.12);
    hex.addColorStop(0,'rgba(175,148,38,.4)');hex.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=hex;ctx.fillRect(0,0,w,h);

  }else if(id==='uranus'){
    const grd=ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,'#4cbec8');grd.addColorStop(.25,'#68d8e0');grd.addColorStop(.5,'#7de8e8');grd.addColorStop(.75,'#68d8e0');grd.addColorStop(1,'#48b8c0');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=1)for(let x=0;x<w;x+=4){
      const n=fbm(x/w*4,y/h*10,3,1,61);
      if(n>.58){ctx.fillStyle=`rgba(178,255,255,${(n-.58)*.18})`;ctx.fillRect(x,y,4,1);}
      else if(n<.38){ctx.fillStyle=`rgba(28,78,98,${(.38-n)*.15})`;ctx.fillRect(x,y,4,1);}
    }
    const ld=ctx.createRadialGradient(w*.5,h*.5,w*.3,w*.5,h*.5,w*.55);
    ld.addColorStop(0,'rgba(0,0,0,0)');ld.addColorStop(1,'rgba(0,28,38,.52)');
    ctx.fillStyle=ld;ctx.fillRect(0,0,w,h);

  }else if(id==='neptune'){
    const grd=ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,'#183ea8');grd.addColorStop(.3,'#2655cc');grd.addColorStop(.5,'#3268dd');grd.addColorStop(.7,'#2655cc');grd.addColorStop(1,'#1535a0');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=1)for(let x=0;x<w;x+=3){
      const n=fbm(x/w*7,y/h*12,4,1,79);
      if(n>.62){ctx.fillStyle=`rgba(148,198,255,${(n-.62)*.38})`;ctx.fillRect(x,y,3,1);}
      else if(n<.3){ctx.fillStyle=`rgba(4,14,58,${(.3-n)*.42})`;ctx.fillRect(x,y,3,1);}
    }
    const ds=ctx.createRadialGradient(w*.38,h*.42,0,w*.38,h*.42,w*.075);
    ds.addColorStop(0,'rgba(4,8,48,.88)');ds.addColorStop(.5,'rgba(8,18,78,.62)');ds.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=ds;ctx.fillRect(0,0,w,h);
    ctx.beginPath();ctx.ellipse(w*.38,h*.42,w*.062,h*.042,-.3,0,Math.PI*2);ctx.fillStyle='rgba(4,4,38,.5)';ctx.fill();
    for(let i=0;i<20;i++){const cx=Math.random()*w,cy=h*.18+Math.random()*h*.62;ctx.fillStyle=`rgba(178,212,255,${.14+Math.random()*.22})`;ctx.beginPath();ctx.ellipse(cx,cy,32+Math.random()*88,4+Math.random()*11,Math.random()*.4,0,Math.PI*2);ctx.fill();}
    const ld=ctx.createRadialGradient(w*.5,h*.5,w*.3,w*.5,h*.5,w*.56);
    ld.addColorStop(0,'rgba(0,0,0,0)');ld.addColorStop(1,'rgba(0,0,28,.52)');
    ctx.fillStyle=ld;ctx.fillRect(0,0,w,h);

  }else if(id==='pluto'){
    // Base: muted tan/brown with bright heart plain
    const grd=ctx.createRadialGradient(w*.4,h*.35,0,w*.5,h*.5,w*.55);
    grd.addColorStop(0,'#c8b090');grd.addColorStop(.45,'#a08060');grd.addColorStop(.75,'#806040');grd.addColorStop(1,'#4a3020');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    // Surface texture
    for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
      const n=fbm(x/w*6,y/h*6,5,1,41);
      if(n>.62){ctx.fillStyle=`rgba(200,175,130,${(n-.62)*.45})`;ctx.fillRect(x,y,2,2);}
      else if(n<.32){ctx.fillStyle=`rgba(45,20,8,${(.32-n)*.55})`;ctx.fillRect(x,y,2,2);}
    }
    // Tombaugh Regio (heart shape) - bright nitrogen ice plain
    ctx.save();
    const heart=ctx.createRadialGradient(w*.55,h*.55,0,w*.55,h*.55,w*.18);
    heart.addColorStop(0,'rgba(230,228,210,.95)');heart.addColorStop(.5,'rgba(210,205,185,.8)');heart.addColorStop(.8,'rgba(185,178,155,.45)');heart.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=heart;ctx.beginPath();ctx.ellipse(w*.52,h*.52,w*.22,h*.17,-.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=heart;ctx.beginPath();ctx.ellipse(w*.62,h*.58,w*.14,h*.12,.4,0,Math.PI*2);ctx.fill();
    ctx.restore();
    // Cthulhu dark region
    const dark=ctx.createRadialGradient(w*.25,h*.5,0,w*.25,h*.5,w*.22);
    dark.addColorStop(0,'rgba(55,20,5,.85)');dark.addColorStop(.5,'rgba(75,30,10,.65)');dark.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=dark;ctx.fillRect(0,0,w,h);
    // Polar ice caps
    const icN=ctx.createLinearGradient(0,0,0,h);
    icN.addColorStop(0,'rgba(215,228,240,1)');icN.addColorStop(.08,'rgba(200,215,230,.8)');icN.addColorStop(.14,'rgba(0,0,0,0)');
    ctx.fillStyle=icN;ctx.fillRect(0,0,w,h);
    const icS=ctx.createLinearGradient(0,h,0,0);
    icS.addColorStop(0,'rgba(200,215,230,.9)');icS.addColorStop(.07,'rgba(0,0,0,0)');
    ctx.fillStyle=icS;ctx.fillRect(0,0,w,h);
    // Craters
    for(let i=0;i<30;i++)crater(Math.random()*w,Math.random()*h,w*(.006+Math.random()*.022),.45+Math.random()*.35);
  }
  return new THREE.CanvasTexture(c);
}

function makePanelCanvas(id) {
  const c = document.getElementById('panel-canvas');
  const ctx = c.getContext('2d');
  const size = 320;
  ctx.clearRect(0,0,size,size);
  // Draw sphere preview
  const offscreen = document.createElement('canvas');
  offscreen.width=size; offscreen.height=size;
  const oc = offscreen.getContext('2d');
  // Get texture canvas
  const texCanvas = document.createElement('canvas');
  texCanvas.width=256; texCanvas.height=256;
  const tc = texCanvas.getContext('2d');
  const pdata = PLANETS.find(p=>p.id===id) || PLANETS[2];
  // Re-draw texture onto temp canvas
  makeTextureTo2D(id, tc, 256);
  // Draw planet circle
  ctx.save();
  ctx.beginPath(); ctx.arc(size/2,size/2,size/2-8,0,Math.PI*2); ctx.clip();
  ctx.drawImage(texCanvas,0,0,size,size);
  // Lighting overlay
  const light=ctx.createRadialGradient(size*.35,size*.3,0,size*.5,size*.5,size*.6);
  light.addColorStop(0,'rgba(255,255,255,0.15)');
  light.addColorStop(.4,'rgba(0,0,0,0)');
  light.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle=light; ctx.fillRect(0,0,size,size);
  ctx.restore();
  // Ring for Saturn/Uranus
  if(id==='saturn'){
    ctx.save();
    ctx.globalAlpha=0.55;
    ctx.strokeStyle='rgba(220,190,100,0.8)';
    for(let r=size*.6;r<size*.85;r+=6){
      ctx.beginPath(); ctx.ellipse(size/2,size/2,r,r*.22,0,0,Math.PI*2);
      ctx.lineWidth=4; ctx.stroke();
    }
    ctx.restore();
  }
}

function updatePanelPreview(id) {
  if(id==='sun'){makePanelCanvas('sun');return;}
  const entry = planetMeshes.find(p=>p.pdata.id===id);
  const c = document.getElementById('panel-canvas');
  const ctx = c.getContext('2d');
  const s = 320;
  ctx.clearRect(0,0,s,s);
  const img = entry && entry.mesh.material.map && entry.mesh.material.map.image;
  const isPhoto = img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
  if(isPhoto) {
    ctx.save();
    ctx.beginPath(); ctx.arc(s/2,s/2,s/2-4,0,Math.PI*2); ctx.clip();
    ctx.drawImage(img,0,0,s,s);
    const light = ctx.createRadialGradient(s*.32,s*.28,0,s*.5,s*.5,s*.6);
    light.addColorStop(0,'rgba(255,255,255,0.12)');
    light.addColorStop(.4,'rgba(0,0,0,0)');
    light.addColorStop(1,'rgba(0,0,0,0.55)');
    ctx.fillStyle=light; ctx.fillRect(0,0,s,s);
    ctx.restore();
  } else {
    makePanelCanvas(id);
  }
}

function makeTextureTo2D(id, ctx, size) {
  const w=size,h=size;
  if(id==='sun'){
    const grd=ctx.createRadialGradient(w*.45,h*.4,0,w*.5,h*.5,w*.52);
    grd.addColorStop(0,'#fffce0'); grd.addColorStop(.25,'#ffe060'); grd.addColorStop(.55,'#ff9010'); grd.addColorStop(.85,'#ff5000'); grd.addColorStop(1,'#cc2000');
    ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
    // Sunspot details
    for(let i=0;i<18;i++){ctx.beginPath();ctx.arc(w*(.2+Math.random()*.6),h*(.2+Math.random()*.6),w*(.008+Math.random()*.025),0,Math.PI*2);ctx.fillStyle=`rgba(140,50,0,0.45)`;ctx.fill();}
    // Soft outer glow
    const glow=ctx.createRadialGradient(w*.5,h*.5,w*.38,w*.5,h*.5,w*.52);
    glow.addColorStop(0,'rgba(0,0,0,0)'); glow.addColorStop(1,'rgba(255,80,0,0.35)');
    ctx.fillStyle=glow; ctx.fillRect(0,0,w,h);
  } else if(id==='mercury'){
    const grd=ctx.createRadialGradient(w*.4,h*.35,0,w*.5,h*.5,w*.5);
    grd.addColorStop(0,'#c8c8c8'); grd.addColorStop(.5,'#9a9a9a'); grd.addColorStop(1,'#6a6a6a');
    ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
    for(let i=0;i<120;i++){ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*6+1,0,Math.PI*2);ctx.fillStyle=`rgba(70,70,70,0.6)`;ctx.fill();}
  } else if(id==='venus'){
    const grd=ctx.createLinearGradient(0,0,w,h);
    grd.addColorStop(0,'#d4a040'); grd.addColorStop(.5,'#e8c070'); grd.addColorStop(1,'#c09030');
    ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
  } else if(id==='earth'){
    ctx.fillStyle='#1a6fa8'; ctx.fillRect(0,0,w,h);
    [{x:.2,y:.3,rx:.15,ry:.2,c:'#2a7a30'},{x:.55,y:.28,rx:.12,ry:.18,c:'#3a8040'},{x:.4,y:.55,rx:.18,ry:.12,c:'#6a8a30'},{x:.75,y:.45,rx:.08,ry:.12,c:'#2a7a30'}].forEach(ct=>{const g=ctx.createRadialGradient(ct.x*w,ct.y*h,0,ct.x*w,ct.y*h,ct.rx*w);g.addColorStop(0,ct.c);g.addColorStop(1,'rgba(26,111,168,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);});
    ctx.fillStyle='rgba(220,235,255,0.8)'; ctx.fillRect(0,0,w,20); ctx.fillRect(0,h-14,w,14);
  } else if(id==='mars'){
    const grd=ctx.createRadialGradient(w*.35,h*.35,0,w*.5,h*.5,w*.55);
    grd.addColorStop(0,'#e06030'); grd.addColorStop(.6,'#b83010'); grd.addColorStop(1,'#802008');
    ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(220,235,255,0.6)'; ctx.fillRect(0,0,w,12); ctx.fillRect(0,h-10,w,10);
  } else if(id==='jupiter'){
    const bands=['#c8a060','#e8c888','#a86820','#d4aa70','#8a4810','#e0c080','#b87830','#eed098'];
    const bh=h/bands.length;
    bands.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(0,i*bh,w,bh+1);});
    ctx.beginPath();ctx.ellipse(w*.65,h*.55,25,16,0,0,Math.PI*2);ctx.fillStyle='rgba(160,40,10,0.7)';ctx.fill();
  } else if(id==='saturn'){
    const bands=['#e8d888','#d4b860','#f0e090','#c8a040','#ead880'];
    const bh=h/bands.length;
    bands.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(0,i*bh,w,bh+1);});
  } else if(id==='uranus'){
    const grd=ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,'#60d8d8');grd.addColorStop(.5,'#7de8e8');grd.addColorStop(1,'#50c8c8');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
  } else if(id==='neptune'){
    const grd=ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,'#3060d0');grd.addColorStop(.5,'#4b70dd');grd.addColorStop(1,'#2048b8');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    const sg=ctx.createRadialGradient(w*.4,h*.4,0,w*.4,h*.4,45);
    sg.addColorStop(0,'rgba(20,20,80,0.7)');sg.addColorStop(1,'rgba(20,20,80,0)');
    ctx.fillStyle=sg;ctx.fillRect(0,0,w,h);
  } else if(id==='pluto'){
    const grd=ctx.createRadialGradient(w*.4,h*.35,0,w*.5,h*.5,w*.55);
    grd.addColorStop(0,'#c8b090');grd.addColorStop(.5,'#a08060');grd.addColorStop(1,'#5a4030');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
    // Tombaugh Regio heart
    const hg=ctx.createRadialGradient(w*.55,h*.52,0,w*.55,h*.52,w*.2);
    hg.addColorStop(0,'rgba(228,224,205,.9)');hg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=hg;ctx.beginPath();ctx.ellipse(w*.52,h*.5,w*.2,w*.15,-.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(220,235,240,0.7)'; ctx.fillRect(0,0,w,12); ctx.fillRect(0,h-10,w,10);
  }
}

// ─── THREE.JS SCENE ──────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 3000);
camera.position.set(0, 28, 55);
camera.lookAt(0,0,0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 400;
controls.autoRotate = false;

// Lighting
const ambientLight = new THREE.AmbientLight(0x304878, 1.8);
scene.add(ambientLight);
const hemisphereLight = new THREE.HemisphereLight(0x446688, 0x112233, 0.8);
scene.add(hemisphereLight);
const sunLight = new THREE.PointLight(0xfff5e0, 6.0, 800, 0.8);
sunLight.position.set(0,0,0);
scene.add(sunLight);
const fillLight = new THREE.DirectionalLight(0x4060a0, 0.45);
fillLight.position.set(-50, 20, -50);
scene.add(fillLight);

// ─── NEBULA SKYBOX ───────────────────────────────────────────────────────────
(function buildNebulaSkybox() {
  const W=2048, H=1024;
  const c=document.createElement('canvas'); c.width=W; c.height=H;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#000208'; ctx.fillRect(0,0,W,H);

  function nebula(cx,cy,rx,ry,r,g,b,a){
    const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(rx,ry));
    grd.addColorStop(0,`rgba(${r},${g},${b},${a})`);
    grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.save(); ctx.translate(cx,cy);
    ctx.scale(rx/Math.max(rx,ry), ry/Math.max(rx,ry));
    ctx.translate(-cx,-cy);
    ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
    ctx.restore();
  }
  // Galactic band
  nebula(1024,512,920,210, 60,40,130, 0.18);
  nebula(760,440,680,190,  80,50,170, 0.14);
  nebula(1320,560,720,210, 45,25,110, 0.12);
  nebula(1024,512,500,140, 100,60,200,0.08);
  // Teal/cyan regions
  nebula(340,280,300,210,  28,130,210,0.16);
  nebula(1680,680,260,190, 18,110,195,0.14);
  nebula(900,750,220,155,  20,150,180,0.10);
  // Purple/magenta
  nebula(580,680,220,155,  130,30,195,0.14);
  nebula(1450,190,240,170, 160,40,210,0.11);
  nebula(200,600,180,130,  100,20,160,0.10);
  // Red emission
  nebula(870,580,190,125,  210,60,30, 0.09);
  nebula(1350,380,175,110, 190,45,20, 0.07);
  // Bright clusters
  [[400,160],[1550,850],[700,920],[1200,300]].forEach(([cx,cy])=>nebula(cx,cy,70,48,210,225,255,0.10));

  // Stars — lots of them, varied colors
  for(let i=0;i<6000;i++){
    const x=Math.random()*W, y=Math.random()*H;
    const t=Math.random();
    const size = t<0.015 ? 2.2+Math.random()*1.8 : t<0.08 ? 1.1+Math.random()*0.9 : 0.25+Math.random()*0.6;
    const bright=0.5+Math.random()*0.5;
    const temp=Math.random();
    const r=temp<.25?200+Math.floor(Math.random()*55):temp<.55?255:220+Math.floor(Math.random()*35);
    const g=temp<.25?210+Math.floor(Math.random()*45):temp<.55?240+Math.floor(Math.random()*15):225+Math.floor(Math.random()*30);
    const b=temp<.25?255:temp<.55?180+Math.floor(Math.random()*50):210+Math.floor(Math.random()*45);
    ctx.beginPath(); ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fillStyle=`rgba(${r},${g},${b},${bright})`; ctx.fill();
    if(size>2){
      ctx.strokeStyle=`rgba(${r},${g},${b},${bright*.35})`;
      ctx.lineWidth=0.5;
      ctx.beginPath();
      ctx.moveTo(x-size*3.5,y); ctx.lineTo(x+size*3.5,y);
      ctx.moveTo(x,y-size*3.5); ctx.lineTo(x,y+size*3.5);
      ctx.stroke();
    }
  }

  const tex=new THREE.CanvasTexture(c);
  tex.colorSpace=THREE.SRGBColorSpace;
  const sky=new THREE.Mesh(
    new THREE.SphereGeometry(850,64,32),
    new THREE.MeshBasicMaterial({map:tex,side:THREE.BackSide})
  );
  scene.add(sky);

  // Foreground star points for parallax depth
  const geo=new THREE.BufferGeometry();
  const count=5000, pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
    const r=200+Math.random()*400;
    pos[i*3]=r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1]=r*Math.sin(ph)*Math.sin(th);
    pos[i*3+2]=r*Math.cos(ph);
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  // Color variation: warm/cool/white mix to mimic star temperatures
  const starColors = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const r=Math.random();
    if(r<0.15){starColors[i*3]=0.7;starColors[i*3+1]=0.8;starColors[i*3+2]=1.0;}       // blue-white
    else if(r<0.30){starColors[i*3]=1.0;starColors[i*3+1]=0.92;starColors[i*3+2]=0.78;} // warm yellow
    else if(r<0.40){starColors[i*3]=1.0;starColors[i*3+1]=0.75;starColors[i*3+2]=0.55;} // orange
    else{starColors[i*3]=1.0;starColors[i*3+1]=1.0;starColors[i*3+2]=1.0;}               // white
  }
  geo.setAttribute('color',new THREE.BufferAttribute(starColors,3));
  scene.add(new THREE.Points(geo,new THREE.PointsMaterial({vertexColors:true,sizeAttenuation:false,size:0.9,transparent:true,opacity:0.75})));
})();

// Sun + Silent 3D Magnetic Coronal Loops & Solar Prominence Particle System
function createSun() {
  const group = new THREE.Group();
  const geo = new THREE.SphereGeometry(2.5, 48, 48);
  const c = document.createElement('canvas'); c.width=512; c.height=512;
  const ctx=c.getContext('2d');
  const grd=ctx.createRadialGradient(256,256,0,256,256,256);
  grd.addColorStop(0,'#fff8e0'); grd.addColorStop(.3,'#ffe040'); grd.addColorStop(.7,'#ff8000'); grd.addColorStop(1,'#ff4000');
  ctx.fillStyle=grd; ctx.fillRect(0,0,512,512);
  // Sunspots & active regions
  for(let i=0;i<24;i++){ctx.beginPath();ctx.arc(90+Math.random()*330,90+Math.random()*330,3+Math.random()*8,0,Math.PI*2);ctx.fillStyle='rgba(150,55,0,0.48)';ctx.fill();}
  const mat = new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)});
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);

  // Inner & outer corona glows
  const glowGeo = new THREE.SphereGeometry(3.8, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({color:0xff8800,transparent:true,opacity:0.13,side:THREE.BackSide,depthWrite:false});
  group.add(new THREE.Mesh(glowGeo, glowMat));
  const glowGeo2 = new THREE.SphereGeometry(5.6, 32, 32);
  const glowMat2 = new THREE.MeshBasicMaterial({color:0xff5500,transparent:true,opacity:0.055,side:THREE.BackSide,depthWrite:false});
  group.add(new THREE.Mesh(glowGeo2, glowMat2));

  // 3D Magnetic Coronal Loops (silent plasma arches hugging the solar surface)
  const loopSpecs = [
    {lat: 0.25, lon: 0.0,  span: 0.52, height: 0.95, tilt: 0.2,  speed: 0.9,  phase: 0.0, color: 0xffaa22},
    {lat:-0.30, lon: 1.15, span: 0.60, height: 1.15, tilt:-0.25, speed: 0.75, phase: 1.4, color: 0xff7711},
    {lat: 0.42, lon: 2.35, span: 0.48, height: 0.85, tilt: 0.35, speed: 1.1,  phase: 2.8, color: 0xffcc44},
    {lat:-0.18, lon: 3.55, span: 0.66, height: 1.28, tilt:-0.15, speed: 0.68, phase: 4.1, color: 0xff5500},
    {lat: 0.12, lon: 4.65, span: 0.55, height: 1.05, tilt: 0.28, speed: 0.85, phase: 5.2, color: 0xff9922},
    {lat:-0.48, lon: 5.50, span: 0.46, height: 0.82, tilt:-0.32, speed: 1.02, phase: 2.1, color: 0xffbb33},
    {lat: 0.62, lon: 1.80, span: 0.42, height: 0.76, tilt: 0.40, speed: 0.95, phase: 3.6, color: 0xff6611},
    {lat:-0.55, lon: 4.10, span: 0.50, height: 0.92, tilt:-0.22, speed: 0.80, phase: 0.8, color: 0xffaa33}
  ];

  const prominenceLoops = [];
  const R = 2.46;
  const _sphToVec = (lat, lon, rad) => new THREE.Vector3(
    rad * Math.cos(lat) * Math.cos(lon),
    rad * Math.sin(lat),
    rad * Math.cos(lat) * Math.sin(lon)
  );

  loopSpecs.forEach(spec => {
    const p0 = _sphToVec(spec.lat - spec.span * 0.35, spec.lon - spec.span * 0.5, R);
    const p3 = _sphToVec(spec.lat + spec.span * 0.35, spec.lon + spec.span * 0.5, R);
    const midLat = spec.lat + spec.tilt * 0.25;
    const midLon = spec.lon;
    const p1 = _sphToVec(midLat - spec.span * 0.12, midLon - spec.span * 0.18, R + spec.height);
    const p2 = _sphToVec(midLat + spec.span * 0.12, midLon + spec.span * 0.18, R + spec.height);
    const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
    const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.042, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: spec.color,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tubeMesh);

    // Outer soft halo tube around the magnetic loop
    const haloGeo = new THREE.TubeGeometry(curve, 28, 0.11, 8, false);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    group.add(haloMesh);

    prominenceLoops.push({curve, tubeMesh, haloMesh, spec});
  });

  // Coronal plasma particles streaming along the magnetic loops
  const PARTICLE_COUNT = 320;
  const pPos = new Float32Array(PARTICLE_COUNT * 3);
  const pCol = new Float32Array(PARTICLE_COUNT * 3);
  const pMeta = [];
  for(let i = 0; i < PARTICLE_COUNT; i++) {
    const loopIdx = i % prominenceLoops.length;
    const t0 = Math.random();
    const spd = 0.18 + Math.random() * 0.28;
    pMeta.push({loopIdx, t: t0, speed: spd, jitter: (Math.random() - 0.5) * 0.09});
    pCol[i*3]   = 1.0;
    pCol[i*3+1] = 0.55 + Math.random() * 0.42;
    pCol[i*3+2] = 0.15 + Math.random() * 0.25;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const coronalPoints = new THREE.Points(pGeo, pMat);
  group.add(coronalPoints);

  scene.add(group);
  return {group, mesh, prominenceLoops, coronalPoints, pMeta};
}
const sunObj = createSun();
const _promTmpPt = new THREE.Vector3();

function updateSolarProminences(t) {
  if(!sunObj || !sunObj.prominenceLoops) return;
  sunObj.group.rotation.y = t * 0.035;
  const loops = sunObj.prominenceLoops;
  for(let i = 0; i < loops.length; i++) {
    const L = loops[i];
    const wave = 0.5 + 0.5 * Math.sin(t * L.spec.speed + L.spec.phase);
    L.tubeMesh.material.opacity = 0.22 + wave * 0.52;
    L.haloMesh.material.opacity = 0.07 + wave * 0.22;
    const sc = 0.96 + wave * 0.09;
    L.tubeMesh.scale.setScalar(sc);
    L.haloMesh.scale.setScalar(sc);
  }
  const posAttr = sunObj.coronalPoints.geometry.getAttribute('position');
  const arr = posAttr.array;
  const meta = sunObj.pMeta;
  for(let i = 0; i < meta.length; i++) {
    const m = meta[i];
    m.t = (m.t + 0.0045 * m.speed) % 1;
    const L = loops[m.loopIdx];
    L.curve.getPoint(m.t, _promTmpPt);
    arr[i*3]   = _promTmpPt.x + m.jitter;
    arr[i*3+1] = _promTmpPt.y + m.jitter;
    arr[i*3+2] = _promTmpPt.z + m.jitter;
  }
  posAttr.needsUpdate = true;
}

// Orbit rings
function createOrbitRing(radius) {
  const pts=[];
  for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius));}
  const geo=new THREE.BufferGeometry().setFromPoints(pts);
  const mat=new THREE.LineBasicMaterial({color:0x334466,transparent:true,opacity:0.3});
  return new THREE.Line(geo,mat);
}

// Planet creation
const planetMeshes = [];
const planetGroups = [];

PLANETS.forEach(pdata => {
  // The Sun lives in PLANETS for its info-panel data, but its mesh is built by
  // createSun(). Building it here too produced a second radius-2.5 sphere at the
  // origin with a blank texture (makeTexture has no 'sun' branch) that z-fought
  // with the real Sun, and — because both were in the raycast list — broke every
  // `hit === sunObj.mesh` identity check, so clicking the Sun sometimes opened
  // the generic planet panel and the solar-flare bonus never fired.
  if(pdata.id === 'sun') return;

  scene.add(createOrbitRing(pdata.orbitRadius));
  const group = new THREE.Group();
  scene.add(group);

  const tex = makeTexture(pdata.texture, 1024);
  const geo = new THREE.SphereGeometry(pdata.size, 40, 40);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.85,
    metalness: 0.05,
    emissive: new THREE.Color(pdata.emissive),
    emissiveIntensity: 0.35
  });
  const mesh = new THREE.Mesh(geo, mat);
  // Euler order matters here. With the default 'XYZ' the matrix is Ry(spin)·Rz(tilt),
  // so the per-frame spin is applied about the world vertical and the pole sweeps
  // a cone — planets precess instead of rotating. 'ZYX' composes the spin inside
  // the tilt, which is what you want. Barely visible on Earth; Uranus (97.8°),
  // Venus (177.4°) and Pluto (122.5°) were tumbling end-over-end.
  mesh.rotation.order = 'ZYX';
  mesh.rotation.z = THREE.MathUtils.degToRad(pdata.tilt||0);
  mesh.castShadow = true;
  group.add(mesh);
  group.userData = {planetId: pdata.id, pdata};

  // Atmosphere glow
  const atmGeo = new THREE.SphereGeometry(pdata.size*1.06, 32, 32);
  const atmMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(pdata.color),
    transparent: true, opacity: 0.06, side: THREE.BackSide
  });
  group.add(new THREE.Mesh(atmGeo, atmMat));

  // Saturn rings
  if(pdata.id==='saturn') {
    const ringGeo = new THREE.RingGeometry(pdata.size*1.4, pdata.size*2.5, 48);
    // Fix UV for ring texture
    const pos=ringGeo.attributes.position;
    const uv=ringGeo.attributes.uv;
    for(let i=0;i<pos.count;i++){
      const v=new THREE.Vector3().fromBufferAttribute(pos,i);
      const len=v.length();
      uv.setXY(i,(len-pdata.size*1.4)/(pdata.size*1.1),0);
    }
    const rc=document.createElement('canvas'); rc.width=256; rc.height=1;
    const rctx=rc.getContext('2d');
    const rgrd=rctx.createLinearGradient(0,0,256,0);
    rgrd.addColorStop(0,'rgba(200,180,100,0)');
    rgrd.addColorStop(.1,'rgba(220,200,120,0.7)');
    rgrd.addColorStop(.3,'rgba(200,170,90,0.5)');
    rgrd.addColorStop(.5,'rgba(230,210,130,0.8)');
    rgrd.addColorStop(.7,'rgba(210,185,105,0.4)');
    rgrd.addColorStop(.9,'rgba(190,160,80,0.6)');
    rgrd.addColorStop(1,'rgba(180,150,70,0)');
    rctx.fillStyle=rgrd; rctx.fillRect(0,0,256,1);
    const ringMat=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(rc),side:THREE.DoubleSide,transparent:true,opacity:0.85});
    const ringMesh=new THREE.Mesh(ringGeo,ringMat);
    ringMesh.rotation.x=Math.PI/2;
    group.add(ringMesh);
  }

  // Uranus rings (vertical due to tilt)
  if(pdata.id==='uranus') {
    const ringGeo = new THREE.RingGeometry(pdata.size*1.35, pdata.size*2.0, 48);
    const ringMat = new THREE.MeshBasicMaterial({color:0x80d0d0,side:THREE.DoubleSide,transparent:true,opacity:0.35});
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    // RingGeometry is born in the XY plane, i.e. already vertical. Rotating it
    // by PI/2 (as Saturn does) laid it flat in the ecliptic, contradicting both
    // the pdata.ringsVertical flag and this app's own description of Uranus's
    // rings running "nearly pole-to-pole".
    if(!pdata.ringsVertical) ringMesh.rotation.x=Math.PI/2;
    group.add(ringMesh);
  }

  // Moons (visual only for major ones)
  pdata.moons.slice(0,2).forEach((moon, mi) => {
    const mOrbit = pdata.size * (2.5 + mi * 1.4);
    const mSize = pdata.size * 0.18;
    const mc=document.createElement('canvas'); mc.width=64;mc.height=64;
    const mctx=mc.getContext('2d');
    const mg=mctx.createRadialGradient(32,32,0,32,32,32);
    mg.addColorStop(0,'#d0d0d0'); mg.addColorStop(1,'#808080');
    mctx.fillStyle=mg; mctx.fillRect(0,0,64,64);
    for(let i=0;i<20;i++){mctx.beginPath();mctx.arc(Math.random()*64,Math.random()*64,Math.random()*4,0,Math.PI*2);mctx.fillStyle='rgba(60,60,60,0.4)';mctx.fill();}
    const mGeo=new THREE.SphereGeometry(mSize,16,16);
    const mMat=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(mc),roughness:0.9});
    const mMesh=new THREE.Mesh(mGeo,mMat);
    mMesh.position.x=mOrbit;
    const mPivot=new THREE.Group();
    mPivot.add(mMesh);
    mPivot.userData={moonOrbit:mOrbit,moonSpeed:2/(mi+1)};
    group.add(mPivot);
  });

  // Set initial position
  const angle = (PLANETS.indexOf(pdata)/PLANETS.length)*Math.PI*2;
  group.position.set(Math.cos(angle)*pdata.orbitRadius, 0, Math.sin(angle)*pdata.orbitRadius);

  planetMeshes.push({mesh, group, pdata, angle: angle});
  planetGroups.push(group);
});

// ─── ASTEROID BELT ──────────────────────────────────────────────────────────
// Between Mars (16.5) and Jupiter (24) — instanced for performance
(function createAsteroidBelt() {
  const COUNT = 1200;
  const dummy = new THREE.Object3D();
  const colors = [0x888888, 0x999988, 0xaaa090, 0x777777, 0x8a8070, 0x9a9080];

  // Mix of tiny sphere sizes — instanced per color group
  [0x8a8070, 0x999988, 0x777788].forEach((col, gi) => {
    const geo = new THREE.DodecahedronGeometry(1, 0); // irregular rock shape
    const mat = new THREE.MeshStandardMaterial({color:col, roughness:0.95, metalness:0.02});
    const count = Math.floor(COUNT / 3);
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    mesh.castShadow = false;

    for(let i = 0; i < count; i++) {
      // Spread across belt width with slight eccentricity
      const r = 19.2 + Math.random() * 3.4 + Math.sin(i * 2.7) * 0.8;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.2; // thin belt with slight vertical scatter
      const scale = 0.018 + Math.random() * 0.06;
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.userData.isAsteroidBelt = true;
    scene.add(mesh);
  });

  // Subtle orbit ring showing belt zone
  const beltRingGeo = new THREE.RingGeometry(19.2, 22.6, 128);
  const beltRingMat = new THREE.MeshBasicMaterial({
    color: 0x554433, transparent: true, opacity: 0.06, side: THREE.DoubleSide
  });
  const beltRingMesh = new THREE.Mesh(beltRingGeo, beltRingMat);
  beltRingMesh.rotation.x = Math.PI / 2;
  scene.add(beltRingMesh);

  // Slow belt rotation in animate loop
  scene.userData.asteroidBelt = { speed: 0.0015 };
})();

// ─── PHOTO TEXTURES ──────────────────────────────────────────────────────────
const PHOTO_URLS = {
  mercury: 'textures/2k_mercury.jpg',
  venus:   'textures/2k_venus_atmosphere.jpg',
  earth:   'textures/2k_earth_daymap.jpg',
  earthClouds: 'textures/2k_earth_clouds.jpg',
  mars:    'textures/2k_mars.jpg',
  jupiter: 'textures/2k_jupiter.jpg',
  saturn:  'textures/2k_saturn.jpg',
  uranus:  'textures/2k_uranus.jpg',
  neptune: 'textures/2k_neptune.jpg',
};
const tLoader = new THREE.TextureLoader();
function loadPhotoTextures() {
  planetMeshes.forEach(pm => {
    const url = PHOTO_URLS[pm.pdata.id];
    if(!url) return;
    tLoader.load(url, tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      // Free the procedural CanvasTexture we're replacing. Three.js only
      // releases GPU storage on an explicit dispose(), and by the time these
      // async loads resolve the 1024x1024 canvas textures have already been
      // uploaded — nine of them, ~4MB each, orphaned for the session.
      if(pm.mesh.material.map) pm.mesh.material.map.dispose();
      pm.mesh.material.map = tex;
      pm.mesh.material.needsUpdate = true;
    }, undefined, ()=>{});
  });
  // Earth cloud layer + night lights + auroras
  const earthEntry = planetMeshes.find(p=>p.pdata.id==='earth');
  if(earthEntry) {
    tLoader.load(PHOTO_URLS.earthClouds, cloudTex => {
      cloudTex.colorSpace = THREE.SRGBColorSpace;
      const cGeo = new THREE.SphereGeometry(earthEntry.pdata.size*1.012, 40, 40);
      const cMat = new THREE.MeshStandardMaterial({map:cloudTex,transparent:true,opacity:0.45,depthWrite:false});
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.userData.isCloudLayer = true;
      earthEntry.group.add(cMesh);
    }, undefined, ()=>{});

    // Earth city lights (emissive map — visible on dark side only due to lighting)
    tLoader.load('textures/2k_earth_nightmap.jpg', nightTex => {
      nightTex.colorSpace = THREE.SRGBColorSpace;
      earthEntry.mesh.material.emissiveMap = nightTex;
      earthEntry.mesh.material.emissive = new THREE.Color(1.0, 0.85, 0.4);
      earthEntry.mesh.material.emissiveIntensity = 1.4;
      earthEntry.mesh.material.needsUpdate = true;
    }, undefined, ()=>{});

  }
}
loadPhotoTextures();

// ─── MISSION MESH OBJECTS ────────────────────────────────────────────────────
const missionMeshes = [];

function createMissionMeshGroup(mission) {
  const col = mission.color;
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 8, 8),
    new THREE.MeshBasicMaterial({color: col})
  );
  core.userData.missionId = mission.id;
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 8, 8),
    new THREE.MeshBasicMaterial({color: col, transparent:true, opacity:0.22, side:THREE.BackSide})
  );
  const g = new THREE.Group();
  g.add(core, glow);
  g.userData.missionId = mission.id;
  g.userData.missionName = mission.name;
  return g;
}

MISSIONS.forEach(mission => {
  const grp = createMissionMeshGroup(mission);
  const mObj = {group: grp, mission, pivot: null};

  if(mission.hostPlanet && !mission.surfaceMission) {
    const pe = planetMeshes.find(p => p.pdata.id === mission.hostPlanet);
    if(pe) {
      const pivot = new THREE.Group();
      pivot.userData.missionOrbitSpeed = mission.orbitSpeed;
      grp.position.x = pe.pdata.size * mission.orbitHeight;
      pivot.add(grp);
      pivot.rotation.y = Math.random() * Math.PI * 2;
      pe.group.add(pivot);
      mObj.pivot = pivot;
    }
  } else if(mission.surfaceMission) {
    const pe = planetMeshes.find(p => p.pdata.id === mission.hostPlanet);
    if(pe) {
      grp.position.x = pe.pdata.size + 0.14;
      pe.group.add(grp);
    }
  } else if(mission.deepSpacePos) {
    const p = mission.deepSpacePos;
    grp.position.set(p.x, p.y, p.z);
    scene.add(grp);
  }

  missionMeshes.push(mObj);
});

// ─── APOLLO LANDING MARKERS ──────────────────────────────────────────────────
const APOLLO_SITES = [
  {name:'Apollo 11',lat:0.67,lon:23.47,year:1969,crew:'Neil Armstrong, Buzz Aldrin, Michael Collins',desc:'First humans on the Moon. Armstrong\'s "one small step" was watched live by 600 million people. Collected 21.5 kg of lunar samples from Mare Tranquillitatis.'},
  {name:'Apollo 12',lat:-3.01,lon:-23.42,year:1969,crew:'Pete Conrad, Alan Bean, Richard Gordon',desc:'Second lunar landing, achieving pinpoint accuracy landing 163m from the unmanned Surveyor 3 probe. First to experience a lightning strike during launch.'},
  {name:'Apollo 14',lat:-3.65,lon:-17.47,year:1971,crew:'Alan Shepard, Edgar Mitchell, Stuart Roosa',desc:'Alan Shepard became the first (and only) person to play golf on the Moon — hitting two balls with a makeshift club. Brought back the most samples of any early mission.'},
  {name:'Apollo 15',lat:26.13,lon:3.63,year:1971,crew:'David Scott, James Irwin, Al Worden',desc:'First mission with the Lunar Roving Vehicle — exploring 27 km of the Hadley-Apennine region. Found the Genesis Rock: a 4.5-billion-year-old piece of the Moon\'s original crust.'},
  {name:'Apollo 16',lat:-8.97,lon:15.50,year:1972,crew:'John Young, Charles Duke, Ken Mattingly',desc:'Only landing in the lunar highlands at the Descartes region. Young and Duke spent 71 hours on the surface, including 3 EVAs totaling 20.2 hours outside.'},
  {name:'Apollo 17',lat:20.19,lon:30.77,year:1972,crew:'Gene Cernan, Harrison Schmitt, Ron Evans',desc:'The last humans to walk on the Moon. Geologist Harrison Schmitt found orange soil — ancient volcanic glass beads 3.5 billion years old. Cernan\'s final words: "We shall return."'},
  {name:'Chandrayaan-3',lat:-69.37,lon:32.35,year:2023,crew:'Uncrewed',desc:'India\'s historic first soft landing on the Moon, touching down Aug 23, 2023 near the south pole. The Pragyan rover confirmed sulfur, oxygen, iron, and other elements in lunar south polar soil — a first. India became the 4th nation to land on the Moon.'},
  {name:'IM-1 / Odysseus',lat:-80.13,lon:1.44,year:2024,crew:'Uncrewed',desc:'First privately-built spacecraft to land on the Moon (Feb 22, 2024). Built by Intuitive Machines for NASA\'s CLPS program. Landed near Malapert A crater — tipped on its side but survived and returned data. A landmark for commercial spaceflight.'},
  {name:'Chang\'e 6',lat:-41.64,lon:206.0,year:2024,crew:'Uncrewed',desc:'Landed on the Moon\'s far side in the Apollo crater (June 1, 2024) — first spacecraft ever to collect samples from the lunar far side. Returned 1.9 kg of ancient material to Earth on June 25, 2024, opening a new chapter in lunar science.'},
  {name:'IM-2 / Athena',lat:-84.5,lon:2.0,year:2025,crew:'Uncrewed',desc:'Intuitive Machines\' second lunar lander, launched Feb 26, 2025. Targeted Mons Mouton near the south pole to scout water-ice deposits for future Artemis crewed missions. Carried NASA\'s PRIME-1 ice-drilling experiment and a 4G LTE lunar network node.'},
];

function addApolloMarkers() {
  const ee = planetMeshes.find(p=>p.pdata.id==='earth');
  if(!ee) return;
  const moonPivot = ee.group.children.find(c=>c.userData.moonSpeed);
  if(!moonPivot||!moonPivot.children[0]) return;
  const moonMesh = moonPivot.children[0];
  const mR = moonMesh.geometry.parameters.radius || 0.18;

  APOLLO_SITES.forEach(site => {
    const phi=(90-site.lat)*Math.PI/180, theta=site.lon*Math.PI/180;
    const r=mR+0.025;
    const marker=new THREE.Mesh(
      new THREE.SphereGeometry(0.018,6,6),
      new THREE.MeshBasicMaterial({color:0xffe060})
    );
    const glow=new THREE.Mesh(
      new THREE.SphereGeometry(0.035,6,6),
      new THREE.MeshBasicMaterial({color:0xffe060,transparent:true,opacity:0.25,side:THREE.BackSide})
    );
    marker.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
    glow.position.copy(marker.position);
    marker.userData.apolloSite = site;
    moonMesh.add(marker, glow);
  });
}
addApolloMarkers();

// NOTE: a second, flat-Points asteroid belt used to be built here and added to
// the scene, overlapping the instanced belt above at nearly the same radii
// (19–22.5 vs 18.4–23.4). Only the instanced one carries
// userData.isAsteroidBelt, so only it ever rotated — the duplicate sat frozen
// inside the moving one. Removed; the instanced belt is the one the animation
// loop is written for.

// ─── KUIPER BELT ─────────────────────────────────────────────────────────────
(function(){
  const geo=new THREE.BufferGeometry();
  const count=4000, pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2;
    const r=60+Math.random()*22; // Beyond Neptune at ~52
    const y=(Math.random()-.5)*2.5;
    pos[i*3]=Math.cos(a)*r; pos[i*3+1]=y; pos[i*3+2]=Math.sin(a)*r;
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0x8899aa,size:0.08,sizeAttenuation:true,transparent:true,opacity:0.55})));
  // Kuiper Belt ring outline
  const rpts=[];
  for(let i=0;i<=128;i++){const a=i/128*Math.PI*2; rpts.push(new THREE.Vector3(Math.cos(a)*70,0,Math.sin(a)*70));}
  const rg=new THREE.BufferGeometry().setFromPoints(rpts);
  scene.add(new THREE.Line(rg,new THREE.LineBasicMaterial({color:0x445566,transparent:true,opacity:0.18})));
})();

// ─── GRAVITY WELL GRID (Spacetime Curvature) ────────────────────────────────
const gwGeo = new THREE.PlaneGeometry(200, 200, 72, 72);
gwGeo.rotateX(-Math.PI/2);
const gwColors = new Float32Array(gwGeo.attributes.position.count * 3);
gwGeo.setAttribute('color', new THREE.BufferAttribute(gwColors, 3));
const gwMat = new THREE.MeshBasicMaterial({vertexColors:true, wireframe:true, transparent:true, opacity:0});
const gwMesh = new THREE.Mesh(gwGeo, gwMat);
gwMesh.position.y = -4;
gwMesh.visible = false;
scene.add(gwMesh);
const gwBasePos = Float32Array.from(gwGeo.attributes.position.array);
let gwVisible = false;

function updateGravityWell() {
  if(!gwVisible) return;
  const pos = gwGeo.attributes.position;
  const col = gwGeo.attributes.color;
  for(let i=0;i<pos.count;i++){
    const x=gwBasePos[i*3], z=gwBasePos[i*3+2];
    let dep=0;
    // Sun gravitational funnel
    dep += 8.5/(Math.sqrt(x*x+z*z)+1.8);
    // Planet gravitational funnels
    for(let p=0;p<planetMeshes.length;p++){
      const pm=planetMeshes[p];
      const px=pm.group.position.x, pz=pm.group.position.z;
      const d=Math.sqrt((x-px)**2+(z-pz)**2);
      dep += pm.pdata.size*pm.pdata.size*0.32/(d+0.55);
    }
    pos.setY(i, -dep - 3.2);
    // Color gradient by gravitational potential: deep indigo -> cyan -> warm solar gold
    const norm = Math.min(1, dep / 3.6);
    if(norm < 0.45) {
      const t = norm / 0.45;
      col.setXYZ(i, 0.04 + t*0.06, 0.22 + t*0.58, 0.48 + t*0.52);
    } else {
      const t = (norm - 0.45) / 0.55;
      col.setXYZ(i, 0.10 + t*0.90, 0.80 - t*0.12, 1.0 - t*0.75);
    }
  }
  pos.needsUpdate=true;
  col.needsUpdate=true;
}

function toggleGravityWell(fromMenu=false) {
  gwVisible = !gwVisible;
  gwMesh.visible = gwVisible;
  gwMat.opacity = gwVisible ? 0.52 : 0;
  if(gwVisible) updateGravityWell();
  const menuBtn = document.getElementById('gravity-toggle');
  const hudBtn = document.getElementById('gravity-hud-btn');
  if(menuBtn) menuBtn.classList.toggle('active', gwVisible);
  if(hudBtn) hudBtn.classList.toggle('active', gwVisible);
  if(fromMenu) closeSideMenu();
  if(typeof playUIClick === 'function') playUIClick();
  showToast(
    gwVisible ? 'Spacetime Grid: ON' : 'Spacetime Grid: OFF',
    gwVisible ? 'Massive bodies curve the fabric of spacetime — watch the Sun & Jupiter bend the grid!' : 'Spacetime gravity well hidden',
    '🌐'
  );
}

// ─── NAVIGATION STATE ────────────────────────────────────────────────────────
let history = [{type:'overview'}];
let historyIndex = 0;
let currentPlanet = null;
let isAnimating = false;
let speedMult = 0.5;
let paused = false;
let elapsed = 0;

// ─── CINEMATIC & MISSION STATE (declared here so animate() can reference them) ─
let _cinActive = false;
let _cinBeatIdx = 0;
let _cinTimer = null;
let _cinCamAnim = null;
let _cinMusicNodes = [];
let _prevCinMusic = null;
let _activeMissionIdx = -1;
let _missionFreeMode = false;
let _completedMissions = new Set();
let _missionPartial = {};
let _missionRing = null;
let _missionRingParent = null;

// Set by the "Replay Intro" menu action so the warp sequence plays again even
// though localStorage records that it has already been seen.
let _forceIntroReplay = false;
// True while the warp tunnel is on screen, so gameplay input stays inert
// instead of firing behind the cinematic.
let _introActive = false;

// Where the warp intro hands off to.
//
// Previously the launch path was: intro screen -> welcome screen -> cinematic
// premiere -> mission briefing. That is three full-screen gates, each with its
// own "begin" button, before the user could touch a planet. The warp tunnel now
// lands directly on the mission briefing. The premiere is still good material,
// so it stays reachable from the menu rather than being deleted.
function _enterAfterIntro() {
  paused = false;
  controls.enabled = true;
  // Match the standard overview framing so we never land zoomed or rolled.
  camera.position.set(0, 28, 55);
  controls.target.set(0, 0, 0);
  controls.update();

  if (!audioCtx) initAudio();
  if (audioCtx) {
    // The warp score is in E minor and ends on a resolve; cross into the
    // ambient planetarium bed rather than cutting to silence.
    audioCtx.resume().then(startPlanetariumBGM).catch(startPlanetariumBGM);
    audioEnabled = true;
    syncAudioBtn();
  }
  setTimeout(() => showMissionBriefing(_completedMissions.size), 500);
}

function pushHistory(entry) {
  history = history.slice(0, historyIndex+1);
  history.push(entry);
  historyIndex++;
  updateNavBtns();
}

function updateNavBtns() {
  document.getElementById('btn-back').disabled = historyIndex <= 0;
  document.getElementById('btn-fwd').disabled = historyIndex >= history.length-1;
}

function navigateTo(entry) {
  if(entry.type==='overview') {
    closePanel();
    animateCameraTo({x:0,y:28,z:55}, {x:0,y:0,z:0}, ()=>{
      document.getElementById('location-label').textContent='Overview';
    });
    currentPlanet=null;
  } else if(entry.type==='planet') {
    openPlanet(entry.id, false);
  } else if(entry.type==='sun') {
    openSun(false);
  }
}

// ─── CAMERA ANIMATION ────────────────────────────────────────────────────────
let camTarget = null;
function animateCameraTo(targetPos, lookAt, onDone) {
  isAnimating = true;
  camTarget = {
    startPos: camera.position.clone(),
    endPos: new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z),
    startLook: controls.target.clone(),
    endLook: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z),
    progress: 0, onDone
  };
}

// ─── PLANET NAME LABELS (3D-anchored HTML overlay) ────────────────────────────
const _labelContainer = document.getElementById('planet-labels');
const _planetLabelEls = {};

(function _createPlanetLabels() {
  const sunEl = document.createElement('div');
  sunEl.className = 'planet-label';
  sunEl.innerHTML = '<div class="planet-label-name sun-label">The Sun</div><div class="planet-label-dot sun-dot"></div>';
  _labelContainer.appendChild(sunEl);
  _planetLabelEls['sun'] = sunEl;
  PLANETS.forEach(p => {
    // Skip the Sun: it already has a gold-styled label above, and letting the
    // loop run overwrote _planetLabelEls['sun'] with a generic cyan one.
    if(p.id === 'sun') return;
    const el = document.createElement('div');
    el.className = 'planet-label';
    el.innerHTML = `<div class="planet-label-name">${p.name}</div><div class="planet-label-dot"></div>`;
    _labelContainer.appendChild(el);
    _planetLabelEls[p.id] = el;
  });
})();

// ─── EXPLORER AGE TIER SYSTEM (Young Explorer / Space Cadet / Mission Director) ─
const EXPLORER_TIERS = {
  kids:     { id:'kids',     icon:'🚀', name:'Young Explorer',   age:'Ages 7–10',          rateMod: 1.02 },
  cadet:    { id:'cadet',    icon:'🪐', name:'Space Cadet',      age:'Ages 11–15',         rateMod: 0.96 },
  director: { id:'director', icon:'🔭', name:'Mission Director', age:'Adult / Deep Science', rateMod: 0.92 }
};
let explorerTier = 'cadet';
try {
  const savedTier = localStorage.getItem('ue_explorer_tier');
  if (savedTier && EXPLORER_TIERS[savedTier]) explorerTier = savedTier;
} catch(e) {}

function setExplorerTier(tier, announce=false) {
  if (!EXPLORER_TIERS[tier]) return;
  explorerTier = tier;
  try { localStorage.setItem('ue_explorer_tier', tier); } catch(e) {}
  const info = EXPLORER_TIERS[tier];
  document.querySelectorAll('.intro-tier-card').forEach(el => {
    el.classList.toggle('active', el.dataset.tier === tier);
  });
  document.querySelectorAll('.smenu-tier-pill').forEach(el => {
    el.classList.toggle('active', el.dataset.tier === tier);
  });
  const hudIcon = document.getElementById('tier-hud-icon');
  const hudLbl  = document.getElementById('tier-hud-label');
  if (hudIcon) hudIcon.textContent = info.icon;
  if (hudLbl)  hudLbl.textContent  = info.name;
  if (announce) {
    showToast(`MODE: ${info.name.toUpperCase()}`, `${info.age} — Voiceovers & science depth updated!`, info.icon);
    if (currentPlanet) {
      const panel = document.getElementById('info-panel');
      if (panel && panel.classList.contains('open')) {
        if (currentPlanet === 'sun') openSun(false);
        else openPlanet(currentPlanet, false);
      }
    }
  }
}

setTimeout(() => {
  setExplorerTier(explorerTier, false);
  document.querySelectorAll('.intro-tier-card').forEach(card => {
    card.addEventListener('click', () => {
      setExplorerTier(card.dataset.tier, false);
      if (typeof playUIClick === 'function') playUIClick();
    });
  });
  document.querySelectorAll('.smenu-tier-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      setExplorerTier(pill.dataset.tier, true);
      if (typeof playUIClick === 'function') playUIClick();
    });
  });
  const tierHudBtn = document.getElementById('tier-hud-btn');
  if (tierHudBtn) {
    tierHudBtn.addEventListener('click', () => {
      const order = ['kids', 'cadet', 'director'];
      const next = order[(order.indexOf(explorerTier) + 1) % order.length];
      setExplorerTier(next, true);
      if (typeof playUIClick === 'function') playUIClick();
    });
  }
}, 0);

// ─── LIVE NASA IMAGES API GALLERY FETCHER + OFFLINE SCHEMATIC FALLBACK ──────
const _nasaGalleryCache = {};
let _activeLightboxItems = [];
let _activeLightboxIdx = 0;

function openLightboxCarousel(items, startIndex=0) {
  if (!items || !items.length) return;
  _activeLightboxItems = items;
  _activeLightboxIdx = Math.max(0, Math.min(items.length - 1, startIndex));
  _renderLightboxSlide();
  document.getElementById('tour-lightbox').classList.add('show');
}

function _renderLightboxSlide() {
  const item = _activeLightboxItems[_activeLightboxIdx];
  if (!item) return;
  const imgEl = document.getElementById('tour-lightbox-img');
  const capEl = document.getElementById('tour-lightbox-caption');
  const credEl = document.getElementById('tour-lightbox-credit');
  const prevBtn = document.getElementById('tour-lightbox-prev');
  const nextBtn = document.getElementById('tour-lightbox-next');
  if (imgEl) {
    imgEl.onerror = () => {
      if (item.fallbackSrc) imgEl.src = item.fallbackSrc;
    };
    imgEl.src = item.src;
    imgEl.alt = item.title || 'Space Imagery';
  }
  if (capEl) capEl.textContent = item.title || '';
  if (credEl) credEl.textContent = item.credit || `Image ${_activeLightboxIdx + 1} of ${_activeLightboxItems.length}`;
  if (prevBtn) prevBtn.style.display = _activeLightboxItems.length > 1 ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = _activeLightboxItems.length > 1 ? 'flex' : 'none';
}

setTimeout(() => {
  const prevBtn = document.getElementById('tour-lightbox-prev');
  const nextBtn = document.getElementById('tour-lightbox-next');
  const closeBtn = document.getElementById('tour-lightbox-close');
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!_activeLightboxItems.length) return;
    _activeLightboxIdx = (_activeLightboxIdx - 1 + _activeLightboxItems.length) % _activeLightboxItems.length;
    _renderLightboxSlide();
  });
  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!_activeLightboxItems.length) return;
    _activeLightboxIdx = (_activeLightboxIdx + 1) % _activeLightboxItems.length;
    _renderLightboxSlide();
  });
  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('tour-lightbox').classList.remove('show');
  });
}, 0);

function fetchNasaGallery(query, containerEl, fallbackSpecs=[]) {
  if (!containerEl) return;
  const fallbackItems = (fallbackSpecs.length ? fallbackSpecs : [
    {src: 'photos/missions/earth/apollo.jpg', title: `${query} — Deep Space Telemetry Schematic`},
    {src: 'photos/missions/jwst/deep_field.jpg', title: `${query} — High-Gain Sensor Array View`}
  ]).map(f => ({
    src: resolveMissionPhoto(f.src, f.title),
    fallbackSrc: resolveMissionPhoto(f.src, f.title),
    title: f.title || query,
    credit: 'SOLAR EXPLORER ARCHIVE · OFFLINE SCHEMATIC'
  }));

  const renderGrid = (items, isLive) => {
    containerEl.innerHTML = `
      <div class="nasa-gallery-header">
        <span class="nasa-gallery-title">📸 NASA / JPL Space Imagery</span>
        <span class="nasa-live-badge ${isLive ? '' : 'offline'}">${isLive ? '● LIVE NASA ARCHIVE' : '◆ OFFLINE SCHEMATICS'}</span>
      </div>
      <div class="nasa-gallery-grid">
        ${items.map((it, idx) => `
          <div class="nasa-photo-card" data-idx="${idx}">
            <img src="${it.src}" alt="${(it.title||'').replace(/"/g,'&quot;')}" loading="lazy"/>
            <div class="nasa-photo-cap">${it.title || query}</div>
          </div>
        `).join('')}
      </div>
    `;
    containerEl.querySelectorAll('.nasa-photo-card').forEach(card => {
      const idx = parseInt(card.dataset.idx, 10) || 0;
      const img = card.querySelector('img');
      if (img && fallbackItems[idx % fallbackItems.length]) {
        img.addEventListener('error', () => {
          img.src = fallbackItems[idx % fallbackItems.length].src;
        }, {once:true});
      }
      card.addEventListener('click', () => openLightboxCarousel(items, idx));
    });
  };

  // Render offline schematics immediately so there is never an empty box
  renderGrid(fallbackItems, false);

  if (_nasaGalleryCache[query]) {
    renderGrid(_nasaGalleryCache[query], true);
    return;
  }

  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=6`;
  fetch(url)
    .then(r => r.ok ? r.json() : Promise.reject(new Error('NASA API status ' + r.status)))
    .then(data => {
      const rawItems = (data && data.collection && data.collection.items) || [];
      const parsed = [];
      for (const item of rawItems) {
        if (!item.links || !item.links.length || !item.data || !item.data.length) continue;
        const imgLink = item.links.find(l => l.render === 'image' && l.href) || item.links[0];
        if (!imgLink || !imgLink.href) continue;
        const d = item.data[0];
        parsed.push({
          src: imgLink.href.replace(/^http:\/\//i, 'https://'),
          fallbackSrc: fallbackItems[parsed.length % fallbackItems.length].src,
          title: d.title || query,
          credit: `NASA / ${d.center || 'JPL-Caltech'}${d.date_created ? ' · ' + d.date_created.slice(0,10) : ''}`
        });
        if (parsed.length >= 6) break;
      }
      if (parsed.length > 0) {
        _nasaGalleryCache[query] = parsed;
        renderGrid(parsed, true);
      }
    })
    .catch(() => {
      // Offline or blocked: fallback schematics are already rendered cleanly
    });
}

// ─── HUMAN FRONTIER 3D LAYER (Live ISS, SpaceX Starship, Orbital AI Center, JWST, Voyager 1) ─
const HUMAN_FRONTIER = [
  {
    id: 'frontier_iss',
    name: 'International Space Station (Live)',
    short: 'Live ISS',
    tagline: 'Humanity\'s Permanent Outpost in Low Earth Orbit',
    type: 'Live Orbital Laboratory',
    agency: 'NASA / Roscosmos / ESA / JAXA / CSA',
    color: '#00ff9d',
    hostPlanet: 'earth',
    orbitHeight: 1.55,
    nasaQuery: 'International Space Station Earth orbit',
    fallbackPhotos: [
      {src: 'photos/missions/iss/station.jpg', title: 'ISS — 109m Truss & Solar Array Complex'},
      {src: 'photos/missions/iss/earth_view.jpg', title: 'Cupola Observational Module Over Earth'}
    ],
    stats: {
      Altitude: '408 km (LEO)',
      Velocity: '27,600 km/h (7.66 km/s)',
      Orbit_Period: '92.9 minutes',
      Continuous_Crew: '24+ Years Occupied',
      Mass: '450,000 kg',
      Telemetry: 'Live WhereTheISS API'
    },
    desc: 'Moving at 27,600 km/h — nearly 8 kilometers every second — the International Space Station circles Earth 16 times every single day. Its live 3D coordinates are streamed directly from orbital telemetry.',
    facts: [
      'Astronauts aboard the ISS witness 16 sunrises and 16 sunsets every 24 hours.',
      'Spanning 109 meters end-to-end, the station is as large as an American football field including the end zones.',
      'In microgravity, astronauts grow up to 5 cm taller as their spines decompress, and water floats in shimmering spheres.',
      'Over 3,000 scientific experiments in medicine, materials, and growing food in space have been conducted aboard.'
    ]
  },
  {
    id: 'starship_mars',
    name: 'SpaceX Starship — Mars Transfer',
    short: 'SpaceX Starship',
    tagline: 'Fully Reusable Interplanetary Super Heavy Transport',
    type: 'Interplanetary Crewed & Cargo Vehicle',
    agency: 'SpaceX · Starbase',
    color: '#ff9933',
    isTransferVessel: true,
    nasaQuery: 'SpaceX rocket launch Mars',
    fallbackPhotos: [
      {src: 'photos/missions/perseverance/rover.jpg', title: 'Interplanetary Mars Entry & Aerocapture Profile'},
      {src: 'photos/missions/perseverance/surface.jpg', title: 'Martian Surface Landing Zone Telemetry'}
    ],
    stats: {
      Height: '121 meters (Full Stack)',
      Propulsion: '39× Raptor Methalox Engines',
      Payload_to_LEO: '100–150+ metric tons',
      Transfer_Orbit: 'Earth → Mars Hohmann Arc',
      Delta_V_Budget: '~6.2 km/s (Trans-Mars + Capture)',
      Hull_Material: '30X Cryogenic Stainless Steel'
    },
    desc: 'Designed to make humanity a multi-planetary species, Starship is the tallest and most powerful launch vehicle ever built. Utilizing orbital propellant depot refilling in Low Earth Orbit, Starship resets the rocket equation to carry up to 100 tons of cargo and crew all the way to the surface of Mars.',
    facts: [
      'Super Heavy\'s 33 Raptor engines produce over 74 meganewtons (16.7 million lbs) of thrust — more than twice the Apollo Saturn V.',
      'Starship burns liquid methane and liquid oxygen (methalox), which can be synthesized on Mars from underground water ice and atmospheric CO2 via the Sabatier reaction.',
      'During Martian atmospheric entry at 7.5 km/s, Starship uses its belly-flop aerodynamic skydiver maneuver and hexagonal ceramic heatshield tiles to shed 99% of its kinetic energy.',
      'The Super Heavy booster returns to the launch tower to be caught mid-air by mechanical "Mechazilla" chopstick arms.'
    ]
  },
  {
    id: 'orbital_datacenter',
    name: 'Orbital AI & Radiative Compute Cluster',
    short: 'Orbital AI Center',
    tagline: 'Zero-Atmosphere Solar-Powered Deep-Space Exascale Node',
    type: 'Orbital Compute Infrastructure',
    agency: 'Commercial Orbital Frontier',
    color: '#00e5ff',
    hostPlanet: 'earth',
    orbitHeight: 2.35,
    nasaQuery: 'solar array satellite earth orbit',
    fallbackPhotos: [
      {src: 'photos/missions/hubble/telescope.jpg', title: 'High-Orbit Solar Array & Cryo-Radiator Wing'},
      {src: 'photos/missions/jwst/spacecraft.jpg', title: 'Deep-Space Infrared Radiative Cooling Panels'}
    ],
    stats: {
      Orbit: 'Sun-Synchronous / High Earth Orbit',
      Power_Source: '100% Unfiltered Solar (1,361 W/m²)',
      Cooling: '3 Kelvin Deep-Space Infrared Radiators',
      Interconnect: '100 Gbps Free-Space Optical Laser Mesh',
      Water_Usage: 'Zero Liters (Closed-Loop Radiative)',
      Compute_Role: 'Autonomous Space Telemetry & AI'
    },
    desc: 'As AI and planetary sensor networks scale, orbital data centers harness uninterrupted, unfiltered 24/7 solar energy in space while radiating waste heat directly into the 3-Kelvin (-270°C) sink of deep space — using zero terrestrial water or power grids.',
    facts: [
      'Above Earth\'s atmosphere, solar panels receive 1,361 Watts per square meter with zero clouds, dust, or night-time interruption in sun-synchronous dawn-dusk orbits.',
      'Instead of evaporative cooling towers that consume millions of gallons of water on Earth, orbital compute nodes dump heat as infrared photons straight into the vacuum of space.',
      'Optical laser cross-links beam petabytes of Earth-observation, climate, and deep-space telescope data between satellites faster than fiber-optic cables.',
      'Processing raw hyperspectral satellite imagery directly in orbit reduces downlink bandwidth bottlenecks by over 99%.'
    ]
  },
  {
    id: 'frontier_jwst',
    name: 'James Webb Space Telescope (Sun-Earth L2)',
    short: 'JWST (L2)',
    tagline: 'Infrared Time Machine Looking Back 13.5 Billion Years',
    type: 'L2 Halo Orbit Infrared Observatory',
    agency: 'NASA / ESA / CSA',
    color: '#ffd040',
    isL2Halo: true,
    nasaQuery: 'James Webb Space Telescope nebula',
    fallbackPhotos: [
      {src: 'photos/missions/jwst/spacecraft.jpg', title: 'JWST 6.5m 18-Segment Beryllium-Gold Mirror'},
      {src: 'photos/missions/jwst/deep_field.jpg', title: 'First Deep Field — SMACS 0723 Gravitational Lens'}
    ],
    stats: {
      Location: 'Sun-Earth L2 Lagrange Point (1.5M km)',
      Primary_Mirror: '6.5m (18 Gold-Coated Hexagons)',
      Cold_Side_Temp: '-233°C (40 Kelvin) / MIRI at 6.7 K',
      Sunshield: '5-Layer Kapton (21m × 14m)',
      Wavelengths: '0.6 – 28.5 Microns (Infrared)',
      Deployments: '344 Single-Point-Failure Steps Aced'
    },
    desc: 'Stationed in a vast halo orbit around the second Sun-Earth Lagrange point (L2) 1.5 million km beyond Earth, the James Webb Space Telescope keeps its 5-layer tennis-court-sized sunshield permanently between its gold mirror and the Sun, Earth, and Moon.',
    facts: [
      'Because cosmic expansion stretches light from the earliest stars into infrared wavelengths, JWST was built as an infrared telescope to see galaxies formed just 200 million years after the Big Bang.',
      'The temperature difference between JWST\'s sun-facing side (+85°C) and its shaded mirror (-233°C) is over 315°C — enough to boil water on one side and freeze nitrogen on the other.',
      'Each of the 18 hexagonal beryllium mirror segments is coated in a microscopic layer of pure gold (100 nanometers thick) — only 48 grams of gold across the entire telescope!',
      'JWST analyzes starlight passing through exoplanet atmospheres to detect water vapor, carbon dioxide, methane, and sulfur dioxide on distant worlds.'
    ]
  },
  {
    id: 'frontier_voyager',
    name: 'Voyager 1 — Interstellar Frontier',
    short: 'Voyager 1',
    tagline: 'The Farthest Human-Made Object in History (163+ AU)',
    type: 'Interstellar Probe',
    agency: 'NASA / JPL',
    color: '#b388ff',
    deepPos: {x: 82, y: 18, z: -64},
    nasaQuery: 'Voyager 1 Golden Record Pale Blue Dot',
    fallbackPhotos: [
      {src: 'photos/missions/voyager/probe.jpg', title: 'Voyager 1 — 3.7m High-Gain Dish & RTG Boom'},
      {src: 'photos/missions/voyager/pale_blue_dot.jpg', title: 'Pale Blue Dot — Earth from 6 Billion km'}
    ],
    stats: {
      Distance: '24.5+ Billion km (~164 AU)',
      Light_Time: '22 Hours 40 Minutes One-Way',
      Speed: '61,200 km/h (17.0 km/s)',
      Heliopause: 'Crossed August 25, 2012',
      Power: '3× Plutonium-238 RTGs',
      Payload: 'The Golden Record (Sounds of Earth)'
    },
    desc: 'Launched in September 1977, Voyager 1 has exited the Sun\'s magnetic bubble (the heliosphere) and is now flying through true interstellar space between the stars — still whispering back to NASA\'s Deep Space Network with a 22-watt radio transmitter.',
    facts: [
      'Radio signals traveling at the speed of light (300,000 km/s) take nearly 23 hours to travel from Voyager 1 to Earth — a 45-hour round-trip conversation!',
      'On Valentine\'s Day 1990, Carl Sagan persuaded NASA to turn Voyager 1\'s camera backward one last time from 6 billion km away, capturing Earth as a single 0.12-pixel "Pale Blue Dot".',
      'Bolted to Voyager\'s hull is a 12-inch gold-plated copper phonograph record carrying greetings in 55 languages, whale songs, brainwaves, Bach, Mozart, and Chuck Berry.',
      'Even after its plutonium generators fade in the 2030s, Voyager 1 will drift silently around the center of the Milky Way galaxy for billions of years.'
    ]
  }
];

let frontierVisible = true;
const frontierMeshes = [];
const _frontierLabelEls = {};
let _issLiveTelemetry = {
  lat: 28.57,
  lon: -80.64,
  alt: 417.8,
  vel: 27584,
  live: false,
  updatedAt: null
};

// Poll live ISS coordinates from api.wheretheiss.at (with automatic offline orbital propagation fallback)
function _pollLiveISS() {
  fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => {
      if (d && typeof d.latitude === 'number' && typeof d.longitude === 'number') {
        _issLiveTelemetry = {
          lat: d.latitude,
          lon: d.longitude,
          alt: d.altitude || 418.2,
          vel: d.velocity || 27580,
          live: true,
          updatedAt: new Date().toLocaleTimeString()
        };
        const box = document.getElementById('iss-live-telemetry-readout');
        if (box) {
          box.innerHTML = `
            <div>LAT: <strong>${_issLiveTelemetry.lat.toFixed(4)}°</strong></div>
            <div>LON: <strong>${_issLiveTelemetry.lon.toFixed(4)}°</strong></div>
            <div>ALT: <strong>${_issLiveTelemetry.alt.toFixed(1)} km</strong></div>
            <div>VEL: <strong>${Math.round(_issLiveTelemetry.vel).toLocaleString()} km/h</strong></div>
          `;
        }
      }
    })
    .catch(() => {
      // Offline: orbital inclination 51.6° propagation in updateHumanFrontier handles coordinates smoothly
    });
}
setTimeout(() => {
  _pollLiveISS();
  setInterval(_pollLiveISS, 12000);
}, 1500);

function _buildFrontierMesh(node) {
  const g = new THREE.Group();
  const col = new THREE.Color(node.color);
  // Invisible pick sphere first (children[0]) so raycasting is super easy to click
  const pickMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 12, 12),
    new THREE.MeshBasicMaterial({color: col, transparent: true, opacity: 0.0, depthWrite: false})
  );
  g.add(pickMesh);

  // Pulsing outer beacon halo (children[1])
  const haloMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 16),
    new THREE.MeshBasicMaterial({color: col, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false})
  );
  g.add(haloMesh);

  if (node.id === 'frontier_iss') {
    // Truss + central modules + 4 solar wings
    const truss = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.03, 0.03), new THREE.MeshStandardMaterial({color: 0xddeeff, metalness: 0.8, roughness: 0.2}));
    const hab   = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.26, 12), new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 0.6, roughness: 0.3}));
    hab.rotation.x = Math.PI / 2;
    g.add(truss, hab);
    [-0.2, -0.1, 0.1, 0.2].forEach(xOff => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.008, 0.34), new THREE.MeshBasicMaterial({color: 0x2299ff}));
      wing.position.set(xOff, 0, 0);
      g.add(wing);
    });
  } else if (node.id === 'starship_mars') {
    // Stainless steel Starship hull + nosecone + 4 flaps + glowing Raptor plume
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.32, 16), new THREE.MeshStandardMaterial({color: 0xe0e8f0, metalness: 0.9, roughness: 0.15}));
    hull.rotation.z = -Math.PI / 2;
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 16), new THREE.MeshStandardMaterial({color: 0xe0e8f0, metalness: 0.9, roughness: 0.15}));
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 0.23;
    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.22, 12), new THREE.MeshBasicMaterial({color: 0x66ccff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending}));
    plume.rotation.z = Math.PI / 2;
    plume.position.x = -0.26;
    g.add(hull, nose, plume);
  } else if (node.id === 'orbital_datacenter') {
    // Octagonal compute core + gold solar wings + crimson infrared radiator fins
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), new THREE.MeshStandardMaterial({color: 0x00e5ff, emissive: 0x006688, metalness: 0.8, roughness: 0.2}));
    const sWing = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.01, 0.12), new THREE.MeshBasicMaterial({color: 0xffcc33}));
    const radFin = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.36, 0.01), new THREE.MeshBasicMaterial({color: 0xff4466}));
    g.add(core, sWing, radFin);
  } else if (node.id === 'frontier_jwst') {
    // Diamond 5-layer sunshield + gold hexagonal primary mirror
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.22), new THREE.MeshStandardMaterial({color: 0xc8d8f0, metalness: 0.85, roughness: 0.2}));
    const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.02, 6), new THREE.MeshBasicMaterial({color: 0xffd020}));
    mirror.rotation.z = Math.PI / 2;
    mirror.position.y = 0.09;
    g.add(shield, mirror);
  } else {
    // Voyager 1 dish + magnetometer boom
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.03, 0.04, 16), new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 0.5, roughness: 0.4}));
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 8), new THREE.MeshBasicMaterial({color: 0xb388ff}));
    boom.rotation.z = Math.PI / 3;
    g.add(dish, boom);
  }
  return {group: g, pickMesh, haloMesh, node};
}

let _starshipArcLine = null;
function initHumanFrontier() {
  if (frontierMeshes.length > 0) return;
  HUMAN_FRONTIER.forEach(node => {
    const built = _buildFrontierMesh(node);
    scene.add(built.group);
    frontierMeshes.push(built);

    // Create 3D HUD label
    const lbl = document.createElement('div');
    lbl.className = 'planet-label frontier-label';
    lbl.innerHTML = `<div class="planet-label-name">🛰️ ${node.short}</div><div class="planet-label-dot"></div>`;
    lbl.style.cursor = 'pointer';
    lbl.style.pointerEvents = 'auto';
    lbl.addEventListener('click', (e) => {
      e.stopPropagation();
      openFrontierNode(node.id);
    });
    _labelContainer.appendChild(lbl);
    _frontierLabelEls[node.id] = lbl;
  });

  // Dashed transfer trajectory arc between Earth and Mars for SpaceX Starship
  const arcGeo = new THREE.BufferGeometry();
  const arcPos = new Float32Array(40 * 3);
  arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPos, 3));
  const arcMat = new THREE.LineBasicMaterial({color: 0xff9933, transparent: true, opacity: 0.42});
  _starshipArcLine = new THREE.Line(arcGeo, arcMat);
  scene.add(_starshipArcLine);

  // Wire HUD & side-menu toggle buttons + quick-jump bar chips
  const hudBtn = document.getElementById('frontier-hud-btn');
  const menuBtn = document.getElementById('frontier-toggle');
  if (hudBtn) hudBtn.addEventListener('click', () => toggleHumanFrontier());
  if (menuBtn) menuBtn.addEventListener('click', () => { closeSideMenu(); toggleHumanFrontier(); });
  document.querySelectorAll('.fbar-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const targetId = chip.dataset.frontier;
      if (targetId) openFrontierNode(targetId);
    });
  });
}

function toggleHumanFrontier(forceState) {
  frontierVisible = typeof forceState === 'boolean' ? forceState : !frontierVisible;
  frontierMeshes.forEach(fm => { fm.group.visible = frontierVisible; });
  if (_starshipArcLine) _starshipArcLine.visible = frontierVisible;
  Object.values(_frontierLabelEls).forEach(el => {
    if (!frontierVisible) el.style.opacity = '0';
  });
  const hudBtn = document.getElementById('frontier-hud-btn');
  const menuBtn = document.getElementById('frontier-toggle');
  const bar = document.getElementById('frontier-bar');
  if (hudBtn) hudBtn.classList.toggle('active', frontierVisible);
  if (menuBtn) menuBtn.classList.toggle('active', frontierVisible);
  if (bar) bar.classList.toggle('visible', frontierVisible);
  _pickListSig = -1; // invalidate raycast cache
  showToast(
    frontierVisible ? 'HUMAN FRONTIER: ONLINE' : 'HUMAN FRONTIER: HIDDEN',
    frontierVisible ? 'Showing Live ISS, SpaceX Starship, Orbital AI Center, JWST & Voyager 1' : 'Press F anytime to restore Human Frontier markers',
    '🛰️'
  );
}

const _earthWpos = new THREE.Vector3();
const _marsWpos  = new THREE.Vector3();
const _arcPtTmp  = new THREE.Vector3();

function updateHumanFrontier(delta) {
  if (!frontierMeshes.length) initHumanFrontier();
  if (!frontierVisible) return;

  const earthEntry = planetMeshes.find(p => p.pdata.id === 'earth');
  const marsEntry  = planetMeshes.find(p => p.pdata.id === 'mars');
  if (earthEntry) earthEntry.group.getWorldPosition(_earthWpos);
  if (marsEntry)  marsEntry.group.getWorldPosition(_marsWpos);

  // Advance offline ISS coordinate model smoothly if live API hasn't updated this second
  if (!_issLiveTelemetry.live) {
    _issLiveTelemetry.lon = ((_issLiveTelemetry.lon + delta * 4.2 + 180) % 360) - 180;
    _issLiveTelemetry.lat = 51.6 * Math.sin(elapsed * 0.45);
  }

  const pulse = 0.16 + 0.10 * Math.sin(elapsed * 3.2);

  frontierMeshes.forEach(fm => {
    fm.haloMesh.material.opacity = pulse;
    const id = fm.node.id;
    if (id === 'frontier_iss') {
      const latR = (_issLiveTelemetry.lat * Math.PI) / 180;
      const lonR = (_issLiveTelemetry.lon * Math.PI) / 180 + elapsed * 0.35;
      const r = 1.55;
      fm.group.position.set(
        _earthWpos.x + r * Math.cos(latR) * Math.cos(lonR),
        _earthWpos.y + r * Math.sin(latR),
        _earthWpos.z + r * Math.cos(latR) * Math.sin(lonR)
      );
      fm.group.rotation.y = -lonR;
    } else if (id === 'orbital_datacenter') {
      const a = elapsed * 0.52 + 2.1;
      const r = 2.35;
      fm.group.position.set(
        _earthWpos.x + Math.cos(a) * r,
        _earthWpos.y + Math.sin(a * 1.3) * 0.85,
        _earthWpos.z + Math.sin(a) * r
      );
      fm.group.rotation.y += delta * 0.6;
    } else if (id === 'frontier_jwst') {
      // Sun-Earth L2 point: radially outward from Sun beyond Earth + halo orbit
      const dirX = _earthWpos.x || 14;
      const dirZ = _earthWpos.z || 0;
      const len  = Math.hypot(dirX, dirZ) || 1;
      const l2X  = _earthWpos.x + (dirX / len) * 3.4;
      const l2Z  = _earthWpos.z + (dirZ / len) * 3.4;
      const haloA = elapsed * 0.4;
      fm.group.position.set(
        l2X + Math.cos(haloA) * 0.55,
        Math.sin(haloA) * 0.65,
        l2Z + Math.sin(haloA) * 0.55
      );
      fm.group.lookAt(0, 0, 0);
    } else if (id === 'starship_mars') {
      // Update Earth -> Mars Hohmann-style curved transfer arc
      const ctrlX = (_earthWpos.x + _marsWpos.x) * 0.5 - (_marsWpos.z - _earthWpos.z) * 0.28;
      const ctrlY = 3.2;
      const ctrlZ = (_earthWpos.z + _marsWpos.z) * 0.5 + (_marsWpos.x - _earthWpos.x) * 0.28;
      if (_starshipArcLine) {
        const attr = _starshipArcLine.geometry.getAttribute('position');
        const arr = attr.array;
        for (let i = 0; i < 40; i++) {
          const u = i / 39;
          const inv = 1 - u;
          arr[i*3]   = inv*inv*_earthWpos.x + 2*inv*u*ctrlX + u*u*_marsWpos.x;
          arr[i*3+1] = inv*inv*_earthWpos.y + 2*inv*u*ctrlY + u*u*_marsWpos.y;
          arr[i*3+2] = inv*inv*_earthWpos.z + 2*inv*u*ctrlZ + u*u*_marsWpos.z;
        }
        attr.needsUpdate = true;
        _starshipArcLine.geometry.computeBoundingSphere();
      }
      const u = (elapsed * 0.055) % 1;
      const inv = 1 - u;
      fm.group.position.set(
        inv*inv*_earthWpos.x + 2*inv*u*ctrlX + u*u*_marsWpos.x,
        inv*inv*_earthWpos.y + 2*inv*u*ctrlY + u*u*_marsWpos.y,
        inv*inv*_earthWpos.z + 2*inv*u*ctrlZ + u*u*_marsWpos.z
      );
      const uNext = Math.min(1, u + 0.02);
      const invN = 1 - uNext;
      _arcPtTmp.set(
        invN*invN*_earthWpos.x + 2*invN*uNext*ctrlX + uNext*uNext*_marsWpos.x,
        invN*invN*_earthWpos.y + 2*invN*uNext*ctrlY + uNext*uNext*_marsWpos.y,
        invN*invN*_earthWpos.z + 2*invN*uNext*ctrlZ + uNext*uNext*_marsWpos.z
      );
      fm.group.lookAt(_arcPtTmp);
      fm.group.rotateY(-Math.PI / 2);
    } else if (id === 'frontier_voyager') {
      fm.group.position.set(nodePos(fm.node).x, nodePos(fm.node).y, nodePos(fm.node).z);
      fm.group.lookAt(0, 0, 0);
    }
  });
}

function nodePos(node) {
  return node.deepPos || {x: 82, y: 18, z: -64};
}

function openFrontierNode(id) {
  const node = HUMAN_FRONTIER.find(n => n.id === id);
  if (!node) return;
  if (!frontierVisible) toggleHumanFrontier(true);
  const fm = frontierMeshes.find(x => x.node.id === id);
  if (fm) {
    const wpos = new THREE.Vector3();
    fm.group.getWorldPosition(wpos);
    animateCameraTo(
      {x: wpos.x + 2.8, y: wpos.y + 1.6, z: wpos.z + 2.8},
      {x: wpos.x, y: wpos.y, z: wpos.z}
    );
  }
  if (typeof playPlanetOpen === 'function') playPlanetOpen();

  const statsHTML = Object.entries(node.stats).map(([k,v]) =>
    `<div class="stat-box"><div class="stat-label">${k.replace(/_/g,' ')}</div><div class="stat-value">${v}</div></div>`
  ).join('');
  const factsHTML = node.facts.map(f => `<li>${f}</li>`).join('');
  const liveISSHTML = id === 'frontier_iss' ? `
    <div class="iss-live-box">
      <div class="iss-live-header">
        <span>● LIVE ORBITAL TELEMETRY (NORAD #25544)</span>
        <span>${_issLiveTelemetry.live ? 'ONLINE' : 'ORBITAL MODEL'}</span>
      </div>
      <div class="iss-live-coords" id="iss-live-telemetry-readout">
        <div>LAT: <strong>${_issLiveTelemetry.lat.toFixed(4)}°</strong></div>
        <div>LON: <strong>${_issLiveTelemetry.lon.toFixed(4)}°</strong></div>
        <div>ALT: <strong>${_issLiveTelemetry.alt.toFixed(1)} km</strong></div>
        <div>VEL: <strong>${Math.round(_issLiveTelemetry.vel).toLocaleString()} km/h</strong></div>
      </div>
    </div>` : '';

  const scrollEl = document.getElementById('mission-scroll');
  scrollEl.innerHTML = `
    <div class="mission-badge">&#128752; ${node.type} &mdash; ${node.agency}</div>
    <div id="mission-panel-name">${node.name}</div>
    <div id="mission-panel-tagline">${node.tagline}</div>
    <div class="mission-status-badge active">&#9679; Active Human Frontier Node</div>
    <div class="panel-speak-row">
      <button id="frontier-speak-btn" class="speak-btn-shared" data-body="${node.id}">
        <span>&#128266;</span>
        <span id="frontier-speak-label">Hear First-Person Briefing</span>
        <span class="speak-wave"><i></i><i></i><i></i><i></i></span>
      </button>
      <button id="frontier-speak-more-btn" class="speak-more-shared" data-body="${node.id}">
        <span>Tell Me More &#8635;</span>
      </button>
    </div>
    <div id="frontier-voice-transcript" class="voice-transcript-box"></div>
    ${liveISSHTML}
    <div class="mission-desc">${node.desc}</div>
    <div class="panel-section">
      <h3>Telemetry &amp; Specifications</h3>
      <div class="mission-stats-grid">${statsHTML}</div>
    </div>
    <div id="frontier-nasa-gallery" class="nasa-gallery-section"></div>
    <div class="panel-section">
      <h3>Engineering &amp; Mission Highlights</h3>
      <ul class="fact-list">${factsHTML}</ul>
    </div>
  `;

  const spkBtn = document.getElementById('frontier-speak-btn');
  const moreBtn = document.getElementById('frontier-speak-more-btn');
  if (spkBtn) spkBtn.addEventListener('click', () => speakAsPlanet(node.id, false));
  if (moreBtn) moreBtn.addEventListener('click', () => speakAsPlanet(node.id, true));

  fetchNasaGallery(node.nasaQuery, document.getElementById('frontier-nasa-gallery'), node.fallbackPhotos);

  document.getElementById('location-label').textContent = node.short;
  closeAllPanels({keepTour:true});
  document.getElementById('mission-panel').classList.add('open');
}

const _labelTmpV = new THREE.Vector3();
const _lblWpos = new THREE.Vector3();
const _lblProj = new THREE.Vector3();
function _updatePlanetLabels() {
  const W = window.innerWidth, H = window.innerHeight;
  _labelTmpV.set(0, 2.8, 0).project(camera);
  const sx = (_labelTmpV.x * 0.5 + 0.5) * W;
  const sy = (-_labelTmpV.y * 0.5 + 0.5) * H;
  const sunEl = _planetLabelEls['sun'];
  if(_labelTmpV.z < 1 && sx > 0 && sx < W && sy > 20 && sy < H) {
    sunEl.style.left = sx + 'px'; sunEl.style.top = (sy - 4) + 'px'; sunEl.style.opacity = '1';
  } else { sunEl.style.opacity = '0'; }
  planetMeshes.forEach(pm => {
    const el = _planetLabelEls[pm.pdata.id]; if(!el) return;
    pm.group.getWorldPosition(_lblWpos); _lblWpos.y += pm.pdata.size + 0.3;
    const v = _lblProj.copy(_lblWpos).project(camera);
    const x = (v.x*0.5+0.5)*W, y = (-v.y*0.5+0.5)*H;
    const dist = camera.position.distanceTo(_lblWpos);
    if(v.z < 1 && x > -60 && x < W+60 && y > 20 && y < H && dist > pm.pdata.size*8) {
      el.style.left = x+'px'; el.style.top = y+'px';
      el.style.opacity = Math.min(1,(dist-pm.pdata.size*4)/(pm.pdata.size*8)).toFixed(2);
    } else { el.style.opacity = '0'; }
  });
  if (frontierVisible) {
    frontierMeshes.forEach(fm => {
      const el = _frontierLabelEls[fm.node.id]; if (!el) return;
      fm.group.getWorldPosition(_lblWpos); _lblWpos.y += 0.45;
      const v = _lblProj.copy(_lblWpos).project(camera);
      const x = (v.x*0.5+0.5)*W, y = (-v.y*0.5+0.5)*H;
      const dist = camera.position.distanceTo(_lblWpos);
      if (v.z < 1 && x > 0 && x < W && y > 45 && y < H - 30 && dist < 140) {
        el.style.left = x + 'px'; el.style.top = y + 'px';
        el.style.opacity = '0.92';
      } else {
        el.style.opacity = '0';
      }
    });
  }
}

// ─── SUN INFO PANEL ──────────────────────────────────────────────────────────
const SUN_DATA = {
  stats:{diameter:'1,392,700 km',type:'G2V Yellow Dwarf',surfaceTemp:'5,500°C',coreTemp:'15,000,000°C',age:'4.6 billion years',rotation:'25–35 Earth days'},
  facts:['The Sun contains 99.86% of all mass in the Solar System. Everything else — every planet, moon, asteroid — is just 0.14%.','Every second, the Sun converts 600 million tons of hydrogen into helium. The energy released in one second could power human civilization for 500,000 years.','Sunlight touching your skin today left the Sun 8 minutes and 20 seconds ago. Every time you feel warmth, you\'re touching the past.','The Sun\'s outer corona reaches 3 million°C — 500× hotter than its visible surface. Scientists are still trying to understand why.','In 5 billion years, the Sun will expand into a red giant large enough to engulf Mercury and Venus. Then it will shed its outer layers and become a white dwarf the size of Earth.','Every atom of carbon in your body, every oxygen molecule you breathe — all forged in dying stars. The Sun is our nearest example of this cosmic forge.'],
  missions:[{name:'Parker Solar Probe',year:2018,agency:'NASA',type:'Solar Orbiter',note:'The fastest human-made object ever built — it dives through the Sun\'s corona at 690,000 km/h, closer than any spacecraft before. It has already overturned models of solar wind.'},
    {name:'Solar Orbiter',year:2020,agency:'ESA/NASA',type:'Imaging Spacecraft',note:'First spacecraft to photograph the Sun\'s poles. Discovered "campfire" flares — tiny nanoflares dotting the entire solar surface that may explain coronal heating.'},
    {name:'SOHO',year:1995,agency:'ESA/NASA',type:'Observatory',note:'30 years of continuous solar monitoring. Has discovered 4,000+ comets, watches for solar flares, and gives early warning of space weather that could knock out satellites and power grids.'},
    {name:'SDO',year:2010,agency:'NASA',type:'Observatory',note:'The Solar Dynamics Observatory shoots a full-disk image of the Sun every 0.75 seconds in 10 different wavelengths. That\'s 1.5 terabytes of data every single day.'}],
  surfaceComp:[{label:'Hydrogen',color:'#ffd060',pct:74},{label:'Helium',color:'#ffaa30',pct:24},{label:'Other',color:'#cc5500',pct:2}],
  layers:[['Core','15 million°C — nuclear fusion zone. 600 million tons of hydrogen become helium every second.'],['Radiative Zone','Energy bounces around this zone for up to 170,000 years before escaping.'],['Convection Zone','Massive convection cells carry energy to the surface, each the size of Texas.'],['Photosphere','The visible surface, 5,500°C. The light you see every day comes from here.'],['Chromosphere','100,000°C reddish layer, visible as a crimson ring during total solar eclipses.'],['Corona','1–3 million°C superheated outer atmosphere. The source of solar wind and space weather.']]
};

function openSun(addHistory=true) {
  const panel = document.getElementById('info-panel');
  const _alreadyOpenForSun = panel && panel.classList.contains('open') && currentPlanet === 'sun';
  currentPlanet = 'sun';
  checkMissionComplete('planet_visited', {id:'sun'});
  if(addHistory) pushHistory({type:'sun'});
  if(typeof playPlanetOpen==='function') playPlanetOpen();
  screenFlash();
  playPlanetAmbience('sun');
  syncPnavIdx('sun');
  if(!_alreadyOpenForSun) showTourTitleCard('The Sun', 'Our Star — 4.6 Billion Years of Light', ()=>{}, '#ffe060');
  animateCameraTo({x:0,y:8,z:18},{x:0,y:0,z:0});
  if(panel) {
    panel.style.setProperty('--pc', '#ffe060');
    panel.style.setProperty('--pc-glow', 'rgba(255,224,96,0.38)');
    panel.style.setProperty('--pc-dim', 'rgba(255,224,96,0.12)');
  }
  document.getElementById('panel-name').textContent = 'The Sun';
  document.getElementById('panel-tagline').textContent = 'Our Star — 4.6 Billion Years of Light';
  _setSpeakBtnTarget('sun');
  document.getElementById('location-label').textContent = 'The Sun';
  updatePanelPreview('sun');
  const body = document.getElementById('panel-body-content');
  const s = SUN_DATA.stats;
  const overviewHTML = `<div class="panel-section" style="margin-top:0;border-top:none;padding-top:0"><h3>Quick Stats</h3><div class="stat-grid"><div class="stat-box"><div class="stat-label">Diameter</div><div class="stat-value">${s.diameter}</div></div><div class="stat-box"><div class="stat-label">Type</div><div class="stat-value">${s.type}</div></div><div class="stat-box"><div class="stat-label">Surface Temp</div><div class="stat-value">${s.surfaceTemp}</div></div><div class="stat-box"><div class="stat-label">Core Temp</div><div class="stat-value">${s.coreTemp}</div></div><div class="stat-box"><div class="stat-label">Age</div><div class="stat-value">${s.age}</div></div><div class="stat-box"><div class="stat-label">Rotation</div><div class="stat-value">${s.rotation}</div></div></div></div><div id="sun-nasa-gallery" class="nasa-gallery-section"></div><div class="panel-section"><h3>Fascinating Facts</h3>${SUN_DATA.facts.map(f=>`<div class="sun-fact-item">${f}</div>`).join('')}</div><button class="take-quiz-btn" onclick="window.launchQuiz('sun')">&#9670; Take Sun Quiz</button>`;
  const missionsHTML = SUN_DATA.missions.map(m=>`<div class="mission-card"><div class="mission-header"><span class="mission-name">${m.name}</span><span class="mission-meta">${m.year} · ${m.agency}</span></div><div class="mission-type">${m.type}</div><div class="mission-note">${m.note}</div></div>`).join('');
  const surfaceHTML = `<div class="panel-section" style="margin-top:0;border-top:none;padding-top:0"><h3>Composition</h3><p style="font-size:12px;color:var(--text);line-height:1.55;margin-bottom:10px;font-family:'Segoe UI',system-ui,sans-serif">The Sun is a ball of plasma — hydrogen and helium in their ionized state — sustained by nuclear fusion. Every atom heavier than hydrogen in your body was forged in stars like this one.</p><div class="surface-bar">${SUN_DATA.surfaceComp.map(c=>`<div class="surface-seg" style="flex:${c.pct};background:${c.color}" title="${c.label}: ${c.pct}%"></div>`).join('')}</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:7px">${SUN_DATA.surfaceComp.map(c=>`<span style="font-size:9px;color:var(--dim)"><span style="display:inline-block;width:7px;height:7px;border-radius:1px;background:${c.color};margin-right:3px;vertical-align:middle"></span>${c.label} ${c.pct}%</span>`).join('')}</div></div><div class="panel-section"><h3>Structure (Surface → Core)</h3>${SUN_DATA.layers.map(([l,d])=>`<div class="poi-item"><div class="poi-name">${l}</div><div class="poi-desc">${d}</div></div>`).join('')}</div>`;
  body.innerHTML = `<div class="tab-bar"><button class="tab-btn active" data-tab="overview">Overview</button><button class="tab-btn" data-tab="missions">Probes</button><button class="tab-btn" data-tab="surface">Structure</button></div><div class="tab-pane active" id="tab-overview">${overviewHTML}</div><div class="tab-pane" id="tab-missions">${missionsHTML}</div><div class="tab-pane" id="tab-surface">${surfaceHTML}</div>`;
  body.querySelectorAll('.tab-btn').forEach(btn=>{btn.addEventListener('click',()=>{body.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));body.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));btn.classList.add('active');body.querySelector('#tab-'+btn.dataset.tab).classList.add('active');});});
  fetchNasaGallery('Sun solar corona SDO', document.getElementById('sun-nasa-gallery'), [
    {src:'photos/missions/sun/corona.jpg', title:'Solar Dynamics Observatory — Extreme UV Coronal Loops'},
    {src:'photos/missions/sun/parker.jpg', title:'Parker Solar Probe — Perihelion Coronal Dive'}
  ]);
  closeAllPanels({keepTour:true});
  document.getElementById('info-panel').classList.add('open');
}

// ─── PLANET INTERACTION ──────────────────────────────────────────────────────
function screenFlash() {
  const el = document.getElementById('screen-flash');
  if(!el) return;
  el.classList.add('pop');
  el.style.transition = 'opacity .12s';
  setTimeout(()=>{ el.style.transition = 'opacity .55s'; el.classList.remove('pop'); }, 130);
}

function openPlanet(id, addHistory=true) {
  if(id === 'sun') { openSun(addHistory); return; }
  const pdata = PLANETS.find(p=>p.id===id);
  if(!pdata) return;
  const _infoPanel = document.getElementById('info-panel');
  const _alreadyOpenForPlanet = _infoPanel && _infoPanel.classList.contains('open') && currentPlanet === id;
  currentPlanet = id;
  syncPnavIdx(id);
  onPlanetVisit(id);
  playPlanetOpen();
  screenFlash();
  playPlanetAmbience(id);
  if(addHistory) pushHistory({type:'planet', id});
  if(!_alreadyOpenForPlanet) showTourTitleCard(pdata.name, pdata.tagline||'', ()=>{}, pdata.color);

  const entry = planetMeshes.find(p=>p.pdata.id===id);
  if(entry) {
    const wpos = new THREE.Vector3();
    entry.group.getWorldPosition(wpos);
    const offset = pdata.size * 5 + 4;
    animateCameraTo(
      {x: wpos.x+offset, y: wpos.y+pdata.size*2, z: wpos.z+offset},
      {x: wpos.x, y: wpos.y, z: wpos.z}
    );
  }

  // ── Planet color theming ────────────────────────────────────────────────────
  const panel = document.getElementById('info-panel');
  const pc = pdata.color || '#00d4ff';
  const hexC = pc.replace('#','');
  const pr = parseInt(hexC.slice(0,2),16)||0, pg = parseInt(hexC.slice(2,4),16)||212, pb = parseInt(hexC.slice(4,6),16)||255;
  panel.style.setProperty('--pc', pc);
  panel.style.setProperty('--pc-glow', `rgba(${pr},${pg},${pb},0.38)`);
  panel.style.setProperty('--pc-dim',  `rgba(${pr},${pg},${pb},0.12)`);

  // Build panel
  document.getElementById('panel-name').textContent = pdata.name;
  document.getElementById('panel-tagline').textContent = pdata.tagline;
  _setSpeakBtnTarget(pdata.id);
  document.getElementById('location-label').textContent = pdata.name;
  updatePanelPreview(id);

  const body = document.getElementById('panel-body-content');

  // ── Scale comparison data ──────────────────────────────────────────────────
  const DIAMS = {sun:1392700,jupiter:139820,saturn:116460,uranus:50724,neptune:49244,earth:12742,venus:12104,mars:6779,mercury:4879,pluto:2377};
  const diam = DIAMS[id] || DIAMS.earth;
  const sunDiam = DIAMS.sun;
  const earthDiam = DIAMS.earth;
  const scalePct = v => Math.max(1, Math.round((v/sunDiam)*100));
  const scaleCompareHTML = id !== 'sun' ? `
    <div class="scale-compare">
      <div class="scale-compare-label">Size Comparison</div>
      <div class="scale-bars">
        <div class="scale-bar-row">
          <span class="scale-bar-name">The Sun</span>
          <div style="flex:1;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden;height:10px">
            <div class="scale-bar-fill" style="width:100%;background:linear-gradient(90deg,#ff8020,#ffe060)"></div>
          </div>
          <span class="scale-bar-val">1,392,700 km</span>
        </div>
        <div class="scale-bar-row">
          <span class="scale-bar-name">${pdata.name}</span>
          <div style="flex:1;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden;height:10px">
            <div class="scale-bar-fill" style="width:${scalePct(diam)}%;background:${pc}"></div>
          </div>
          <span class="scale-bar-val">${diam.toLocaleString()} km</span>
        </div>
        ${id !== 'earth' ? `<div class="scale-bar-row">
          <span class="scale-bar-name">Earth</span>
          <div style="flex:1;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden;height:10px">
            <div class="scale-bar-fill" style="width:${scalePct(earthDiam)}%;background:#4fa3e0"></div>
          </div>
          <span class="scale-bar-val">12,742 km</span>
        </div>` : ''}
      </div>
    </div>` : '';

  // ── "What if you lived here?" fun facts ────────────────────────────────────
  const lifeItems = [
    `<div class="life-here-item"><strong>One day lasts</strong>${pdata.stats.dayLength}</div>`,
    `<div class="life-here-item"><strong>One year lasts</strong>${pdata.stats.yearLength}</div>`,
    `<div class="life-here-item"><strong>Step outside to</strong>${pdata.stats.temp}</div>`,
  ];
  if(parseInt(pdata.stats.moons)>0) lifeItems.push(`<div class="life-here-item"><strong>Moons in the sky</strong>${pdata.stats.moons} moon${parseInt(pdata.stats.moons)!==1?'s':''}</div>`);
  const lifeHereHTML = `
    <div class="life-here">
      <div class="life-here-title">&#127968; What if you lived here?</div>
      ${lifeItems.join('')}
    </div>`;

  const overviewHTML = `
    <div class="panel-section" style="margin-top:0;border-top:none;padding-top:0">
      <h3>Quick Stats</h3>
      <div class="stat-grid">
        <div class="stat-box"><div class="stat-label">Diameter</div><div class="stat-value">${pdata.stats.diameter}</div></div>
        <div class="stat-box"><div class="stat-label">From Sun</div><div class="stat-value">${pdata.stats.distanceFromSun}</div></div>
        <div class="stat-box"><div class="stat-label">Day Length</div><div class="stat-value">${pdata.stats.dayLength}</div></div>
        <div class="stat-box"><div class="stat-label">Year Length</div><div class="stat-value">${pdata.stats.yearLength}</div></div>
        <div class="stat-box"><div class="stat-label">Temperature</div><div class="stat-value">${pdata.stats.temp}</div></div>
        <div class="stat-box"><div class="stat-label">Moons</div><div class="stat-value">${pdata.stats.moons}</div></div>
      </div>
      ${scaleCompareHTML}
      ${lifeHereHTML}
    </div>
    <div id="planet-nasa-gallery" class="nasa-gallery-section"></div>
    <div class="panel-section">
      <h3>Key Facts</h3>
      <ul class="fact-list">${pdata.facts.map(f=>`<li>${f}</li>`).join('')}</ul>
    </div>
    ${pdata.moons.length>0?`
    <div class="panel-section">
      <h3>Moons (${pdata.stats.moons}) — Click to Explore &amp; Hear Speak</h3>
      <div class="moon-grid">
        ${pdata.moons.map(m=>`<div class="moon-chip" onclick="showMoon('${id}','${m.name}')"><div class="moon-chip-name">${m.name}</div><div class="moon-chip-sub">${m.tagline}</div></div>`).join('')}
        ${pdata.moons.length<parseInt(pdata.stats.moons)?`<div class="moon-chip" style="opacity:.4;cursor:default"><div class="moon-chip-name">+${parseInt(pdata.stats.moons)-pdata.moons.length} more</div><div class="moon-chip-sub">smaller moons</div></div>`:''}
      </div>
    </div>`:''}
    <button class="zoom-in-btn" onclick="zoomCloser('${id}')">Get Even Closer ↗</button>
    <button class="take-quiz-btn" onclick="window.launchQuiz('${id}')">&#9670; Take Planet Quiz</button>`;

  const missionsHTML = (pdata.missions||[]).map(m=>`
    <div class="mission-card">
      <div class="mission-header"><span class="mission-name">${m.name}</span><span class="mission-meta">${m.year} · ${m.agency}</span></div>
      <div class="mission-type">${m.type}</div>
      <div class="mission-note">${m.note}</div>
    </div>`).join('') || '<p style="font-size:12px;color:var(--dim);padding:8px 0">No mission records.</p>';

  const surfaceHTML = `
    <div class="panel-section" style="margin-top:0;border-top:none;padding-top:0">
      <h3>Surface Composition</h3>
      <p style="font-size:12px;color:var(--text);line-height:1.55;margin-bottom:10px;font-family:\'Segoe UI\',system-ui,sans-serif">${pdata.surface}</p>
      <div class="surface-bar">${pdata.surfaceComp.map(s=>`<div class="surface-seg" style="flex:${s.pct};background:${s.color}" title="${s.label}: ${s.pct}%"></div>`).join('')}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:7px">${pdata.surfaceComp.map(s=>`<span style="font-size:9px;color:var(--dim)"><span style="display:inline-block;width:7px;height:7px;border-radius:1px;background:${s.color};margin-right:3px;vertical-align:middle"></span>${s.label} ${s.pct}%</span>`).join('')}</div>
    </div>
    <div class="panel-section">
      <h3>Points of Interest</h3>
      ${(pdata.pois||[]).map(p=>`<div class="poi-item"><div class="poi-name">${p.name}</div><div class="poi-desc">${p.desc}</div></div>`).join('')}
    </div>`;

  const atm = pdata.atmosphere;
  const atmosHTML = atm ? `
    <div class="panel-section" style="margin-top:0;border-top:none;padding-top:0">
      <h3>Key Readings</h3>
      <div class="stat-grid">
        <div class="stat-box"><div class="stat-label">Pressure</div><div class="stat-value">${atm.pressure}</div></div>
        <div class="stat-box"><div class="stat-label">Temperature</div><div class="stat-value">${atm.temp}</div></div>
        <div class="stat-box" style="grid-column:1/-1"><div class="stat-label">Wind Speed</div><div class="stat-value">${atm.windSpeed}</div></div>
      </div>
    </div>
    <div class="panel-section">
      <h3>Composition</h3>
      ${atm.composition.map(g=>`
        <div class="atmos-bar-row">
          <span class="atmos-bar-label">${g.gas}</span>
          <div class="atmos-bar-track"><div class="atmos-bar-fill" style="width:${g.pct}%;background:${g.color}"></div></div>
          <span class="atmos-bar-pct">${g.pct}%</span>
        </div>`).join('')}
    </div>` : '<p style="font-size:12px;color:var(--dim);padding:8px 0">No significant atmosphere detected.</p>';

  body.innerHTML = `
    <div class="tab-bar">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="missions">Missions</button>
      <button class="tab-btn" data-tab="surface">Surface</button>
      <button class="tab-btn" data-tab="atmos">Atmos</button>
    </div>
    <div class="tab-pane active" id="tab-overview">${overviewHTML}</div>
    <div class="tab-pane" id="tab-missions">${missionsHTML}</div>
    <div class="tab-pane" id="tab-surface">${surfaceHTML}</div>
    <div class="tab-pane" id="tab-atmos">${atmosHTML}</div>`;

  body.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      body.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      body.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      body.querySelector('#tab-'+btn.dataset.tab).classList.add('active');
    });
  });

  // Wire live NASA photo gallery for this planet (with instant schematic fallback)
  const tourStop = TOUR_STOPS.find(s => s.planetId === id);
  const fbSpecs = (tourStop && tourStop.photos ? tourStop.photos : []).map(src => ({
    src,
    title: `${pdata.name} — NASA / JPL Reconnaissance`
  }));
  fetchNasaGallery(`planet ${pdata.name} NASA`, document.getElementById('planet-nasa-gallery'), fbSpecs);

  closeAllPanels({keepTour:true});
  document.getElementById('info-panel').classList.add('open');
}

function closePanel() {
  document.getElementById('info-panel').classList.remove('open');
}

// ─── PANEL MANAGER — ensures only one major panel is open at a time ──────────
function closeAllPanels(opts={}) {
  closePanel();
  closeMissionPanel();
  document.getElementById('moon-detail').classList.remove('open');
  document.getElementById('quiz-modal').classList.remove('open');
  document.getElementById('achievement-panel').classList.remove('open');
  document.getElementById('missions-dropdown').classList.remove('open');
  document.getElementById('missions-btn').classList.remove('active');
  closeSideMenu();
  if(!opts.keepTour && document.getElementById('tour-panel').classList.contains('open')) {
    endTour();
  }
}

window.showMoon = function(planetId, moonName) {
  const pdata = PLANETS.find(p=>p.id===planetId);
  const moon = pdata.moons.find(m=>m.name===moonName);
  if(!moon) return;
  document.getElementById('moon-name').textContent = moon.name;
  document.getElementById('moon-tagline').textContent = moon.tagline;
  document.getElementById('moon-desc').textContent = moon.desc;
  document.getElementById('moon-stats').innerHTML = Object.entries(moon.stats).map(([k,v])=>`
    <div class="stat-box"><div class="stat-label">${k.charAt(0).toUpperCase()+k.slice(1)}</div><div class="stat-value">${v}</div></div>
  `).join('');

  const moonVoiceKey = 'moon_' + moon.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const moonSpeakBtn = document.getElementById('moon-speak');
  const moonMoreBtn  = document.getElementById('moon-speak-more');
  const moonTrans    = document.getElementById('moon-voice-transcript');
  if (moonTrans) { moonTrans.classList.remove('show'); moonTrans.textContent = ''; }
  if (moonSpeakBtn) {
    moonSpeakBtn.dataset.body = moonVoiceKey;
    moonSpeakBtn.onclick = () => speakAsPlanet(moonVoiceKey, false);
  }
  if (moonMoreBtn) {
    moonMoreBtn.dataset.body = moonVoiceKey;
    moonMoreBtn.onclick = () => speakAsPlanet(moonVoiceKey, true);
  }
  fetchNasaGallery(`${moon.name} moon ${pdata.name} NASA`, document.getElementById('moon-nasa-gallery'), [
    {src: 'photos/missions/earth/apollo.jpg', title: `${moon.name} — Orbital Reconnaissance`}
  ]);

  closeAllPanels({keepTour:true});
  document.getElementById('moon-detail').classList.add('open');
};

window.zoomCloser = function(id) {
  const entry = planetMeshes.find(p=>p.pdata.id===id);
  if(!entry) return;
  const wpos = new THREE.Vector3();
  entry.group.getWorldPosition(wpos);
  const pdata = entry.pdata;
  animateCameraTo(
    {x: wpos.x+pdata.size*2.5, y: wpos.y+pdata.size, z: wpos.z+pdata.size*2.5},
    {x: wpos.x, y: wpos.y, z: wpos.z}
  );
};

// Raycasting for hover/click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');
let hoveredPlanet = null;

// Cached raycast target list (includes planets, Sun, missions, and Human Frontier nodes)
let _pickList = [];
let _pickListSig = -1;
function getPickList() {
  const fCount = frontierVisible ? frontierMeshes.length : 0;
  const sig = planetMeshes.length * 10000 + missionMeshes.length * 100 + fCount;
  if(sig !== _pickListSig) {
    _pickList = planetMeshes.map(p=>p.mesh);
    _pickList.push(sunObj.mesh);
    missionMeshes.forEach(mo => { if(mo.group.children[0]) _pickList.push(mo.group.children[0]); });
    if (frontierVisible) {
      frontierMeshes.forEach(fm => { if(fm.pickMesh) _pickList.push(fm.pickMesh); });
    }
    _pickListSig = sig;
  }
  return _pickList;
}

renderer.domElement.addEventListener('mousemove', e => {
  mouse.x=(e.clientX/window.innerWidth)*2-1;
  mouse.y=-(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(getPickList());
  if(hits.length>0) {
    const hit=hits[0].object;
    const pm=planetMeshes.find(p=>p.mesh===hit);
    const mo=pm ? null : missionMeshes.find(x=>x.group.children[0]===hit);
    const fm=(pm || mo) ? null : frontierMeshes.find(x=>x.pickMesh===hit);
    const name=pm?pm.pdata.name:mo?mo.mission.name:fm?('🛰️ '+fm.node.name):'The Sun';
    tooltip.style.opacity='1';
    tooltip.style.left=(e.clientX+16)+'px';
    tooltip.style.top=(e.clientY-8)+'px';
    tooltip.textContent=name;
    renderer.domElement.style.cursor='pointer';
    hoveredPlanet=pm?pm.pdata.id:null;
  } else {
    tooltip.style.opacity='0';
    renderer.domElement.style.cursor='';
    hoveredPlanet=null;
  }
});

function triggerClickBurst(e) {
  const burst = document.getElementById('click-burst');
  if(!burst) return;
  burst.style.left = e.clientX+'px'; burst.style.top = e.clientY+'px';
  burst.classList.remove('active'); void burst.offsetWidth; burst.classList.add('active');
  clearTimeout(burst._t); burst._t = setTimeout(()=>burst.classList.remove('active'), 660);
}
function triggerNavPing() {
  const nav = document.getElementById('planet-nav');
  if(!nav) return;
  nav.classList.remove('nav-ping'); void nav.offsetWidth; nav.classList.add('nav-ping');
  setTimeout(()=>nav.classList.remove('nav-ping'), 500);
}

// ─── COMET EVENT SYSTEM ───────────────────────────────────────────────────────
(function() {
  const canvas = document.getElementById('comet-canvas');
  const ctx = canvas.getContext('2d');
  let comets = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function triggerComet() {
    const W = canvas.width, H = canvas.height;
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const spd = 5 + Math.random() * 4;
    if (edge === 0) { x = Math.random() * W; y = -10; vx = (Math.random()-0.5)*spd; vy = spd; }
    else if (edge === 1) { x = W+10; y = Math.random() * H; vx = -spd; vy = (Math.random()-0.5)*spd; }
    else if (edge === 2) { x = Math.random() * W; y = H+10; vx = (Math.random()-0.5)*spd; vy = -spd; }
    else { x = -10; y = Math.random() * H; vx = spd; vy = (Math.random()-0.5)*spd; }
    comets.push({ x, y, vx, vy, life: 0, maxLife: 120, tail: [], clickable: true, clicked: false });
  }

  function trySpawnComet() { if (Math.random() < 0.25) triggerComet(); }

  function drawComets() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    comets = comets.filter(c => {
      c.tail.unshift({ x: c.x, y: c.y });
      if (c.tail.length > 12) c.tail.pop();
      c.x += c.vx; c.y += c.vy; c.life++;
      const alpha = c.life > c.maxLife ? Math.max(0, 1 - (c.life - c.maxLife) / 20) : 1;
      if (c.clicked) return c.life < c.maxLife + 20 && alpha > 0.01;
      if (alpha <= 0.01) return false;
      if (c.life >= c.maxLife) c.clickable = false;
      if (c.tail.length > 1) {
        for (let i = 0; i < c.tail.length - 1; i++) {
          const t0 = c.tail[i], t1 = c.tail[i+1];
          const grad = ctx.createLinearGradient(t0.x, t0.y, t1.x, t1.y);
          grad.addColorStop(0, `rgba(180,240,255,${(alpha*(1-i/c.tail.length)).toFixed(2)})`);
          grad.addColorStop(1, `rgba(100,200,255,${(alpha*(1-(i+1)/c.tail.length)).toFixed(2)})`);
          ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y);
          ctx.strokeStyle = grad; ctx.lineWidth = 2.5*(1-i/c.tail.length); ctx.stroke();
        }
      }
      ctx.save(); ctx.shadowBlur = 12; ctx.shadowColor = `rgba(150,230,255,${alpha.toFixed(2)})`;
      ctx.beginPath(); ctx.arc(c.x, c.y, 3.5, 0, Math.PI*2);
      ctx.fillStyle = `rgba(220,245,255,${alpha.toFixed(2)})`; ctx.fill(); ctx.restore();
      return true;
    });
    requestAnimationFrame(drawComets);
  }

  window.addEventListener('click', function(e) {
    if(!comets.some(c => c.clickable && !c.clicked)) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (const c of comets) {
      if (!c.clickable || c.clicked) continue;
      const dx = mx - c.x, dy = my - c.y;
      if (dx*dx + dy*dy <= 400) {
        c.clicked = true; c.clickable = false;
        awardPoints(75);
        showToast('+75 COMET BONUS!', 'Swift reflexes, explorer!', '☄️');
        if (typeof playUIClick === 'function') playUIClick();
        break;
      }
    }
  });

  window.addEventListener('solar-system-ready', function() {
    requestAnimationFrame(drawComets);
    setInterval(trySpawnComet, 5000);
  }, { once: true });
})();

renderer.domElement.addEventListener('click', e => {
  mouse.x=(e.clientX/window.innerWidth)*2-1;
  mouse.y=-(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(getPickList());
  if(hits.length>0) {
    triggerClickBurst(e);
    if(tourActive) {
      const hit = hits[0].object;
      const pm = planetMeshes.find(p=>p.mesh===hit);
      const isSun = hit === sunObj.mesh;
      if(pm || isSun) {
        const targetId = pm ? pm.pdata.id : null;
        const stopIdx = TOUR_STOPS.findIndex(s => s.planetId === targetId);
        if(stopIdx !== -1 && stopIdx !== tourStopIdx) {
          showTourStop(stopIdx);
        }
      }
      return;
    }
    const hit = hits[0].object;
    if(hit === sunObj.mesh) { openSun(); return; }
    const pm = planetMeshes.find(p=>p.mesh===hit);
    if(pm) { openPlanet(pm.pdata.id, true); return; }
    const fm = frontierMeshes.find(x=>x.pickMesh===hit);
    if(fm) { openFrontierNode(fm.node.id); return; }
    const mo = missionMeshes.find(x=>x.group.children[0]===hit);
    if(mo) openMission(mo.mission.id);
  }
});

// ─── TIME CONTROLS (now inside side menu) ────────────────────────────────────
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
const dateDisplay = document.getElementById('date-display');
const tcPlay = document.getElementById('tc-play');

function sliderToSpeed(val) {
  return Math.pow(10, (val-35)/28);
}

speedDisplay.textContent = '0.5× speed';

speedSlider.addEventListener('input', () => {
  speedMult = sliderToSpeed(speedSlider.value);
  const disp = speedMult < 1 ? speedMult.toFixed(2)+'×' : speedMult < 10 ? speedMult.toFixed(1)+'×' : Math.round(speedMult)+'×';
  speedDisplay.textContent = disp + ' speed';
});

tcPlay.addEventListener('click', () => {
  paused = !paused;
  tcPlay.innerHTML = paused ? '&#9654;' : '&#9646;&#9646;';
  tcPlay.classList.toggle('active', !paused);
});

document.getElementById('tc-slower').addEventListener('click', () => {
  speedSlider.value = Math.max(0, parseFloat(speedSlider.value)-12);
  speedSlider.dispatchEvent(new Event('input'));
});

document.getElementById('tc-faster').addEventListener('click', () => {
  speedSlider.value = Math.min(100, parseFloat(speedSlider.value)+12);
  speedSlider.dispatchEvent(new Event('input'));
});

// ─── BACK / FORWARD ──────────────────────────────────────────────────────────
document.getElementById('btn-back').addEventListener('click', () => {
  if(historyIndex>0) { historyIndex--; navigateTo(history[historyIndex]); updateNavBtns(); }
});
document.getElementById('btn-fwd').addEventListener('click', () => {
  if(historyIndex<history.length-1) { historyIndex++; navigateTo(history[historyIndex]); updateNavBtns(); }
});

document.getElementById('panel-close').addEventListener('click', () => {
  closePanel();
  animateCameraTo({x:0,y:28,z:55},{x:0,y:0,z:0});
  currentPlanet=null;
  document.getElementById('location-label').textContent='Overview';
  pushHistory({type:'overview'});
});

document.getElementById('moon-close').addEventListener('click', () => {
  document.getElementById('moon-detail').classList.remove('open');
  if (_speakingPlanet) { stopNarration(); _speakingPlanet = null; _syncSpeakBtn(); }
});
document.getElementById('moon-detail').addEventListener('click', e => {
  if(e.target===document.getElementById('moon-detail')) {
    document.getElementById('moon-detail').classList.remove('open');
    if (_speakingPlanet) { stopNarration(); _speakingPlanet = null; _syncSpeakBtn(); }
  }
});

// Panel canvas click → lightbox (zoom into planet texture)
document.getElementById('panel-canvas').addEventListener('click', () => {
  const canvas = document.getElementById('panel-canvas');
  window.openTourLightbox(canvas.toDataURL('image/png'));
});

// ─── ANIMATION LOOP ──────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let simYear = 2024;

let _lastShownYear = -1;
let _beltRefs = null;
const _wposTmp = new THREE.Vector3();

let _sceneReadyFired = false;
function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  if(!_sceneReadyFired) {
    _sceneReadyFired = true;
    window.dispatchEvent(new Event('solar-system-ready'));
  }

  if(!paused) {
    elapsed += delta * speedMult;
    simYear = 2024 + elapsed/10;
    const yr = Math.floor(simYear);
    if(yr !== _lastShownYear) { _lastShownYear = yr; dateDisplay.textContent = 'Year '+yr; }

    // Orbit planets
    planetMeshes.forEach(pm => {
      pm.angle = pm.angle + delta * pm.pdata.orbitSpeed * 0.08 * speedMult;
      pm.group.position.x = Math.cos(pm.angle) * pm.pdata.orbitRadius;
      pm.group.position.z = Math.sin(pm.angle) * pm.pdata.orbitRadius;

      // Self rotation
      pm.mesh.rotation.y += delta * pm.pdata.rotSpeed * speedMult * 0.3;

      // Moon pivots + cloud layer
      pm.group.children.forEach(child => {
        if(child.userData.moonSpeed) {
          child.rotation.y += delta * child.userData.moonSpeed * speedMult * 0.2;
        }
        if(child.userData.isCloudLayer) {
          child.rotation.y += delta * 0.06 * speedMult;
        }
        if(child.userData.missionOrbitSpeed !== undefined) {
          child.rotation.y += delta * child.userData.missionOrbitSpeed * 0.001 * speedMult * 60;
        }
      });
    });

    // Mission mesh pulse (glow intensity)
    const mPulse = 0.18 + Math.sin(elapsed * 2.2) * 0.08;
    missionMeshes.forEach(mo => {
      if(mo.group.children[1]) mo.group.children[1].material.opacity = mPulse;
    });

    // Gravity well deformation
    updateGravityWell();

    // Update comets
    updateComets();

    // Asteroid belt slow rotation
    if(_beltRefs === null) {
      _beltRefs = scene.children.filter(c => c.userData && c.userData.isAsteroidBelt);
    }
    for(const c of _beltRefs) c.rotation.y += delta * 0.0015 * speedMult;

    // Sun pulse & 3D silent coronal loop prominences
    const pulse = 1 + Math.sin(elapsed*2)*0.015;
    sunObj.mesh.scale.setScalar(pulse);
    updateSolarProminences(elapsed);
  } else {
    // Keep solar coronal loops gently alive even when orbits are paused
    updateSolarProminences(performance.now() * 0.0005);
  }

  // Update 3D Human Frontier nodes (ISS, Starship, Orbital AI Center, JWST, Voyager)
  updateHumanFrontier(delta);

  // Tour camera fly runs even when paused (planets are frozen during tour)
  if(tourActive && tourCamAnim) updateTourCamera(delta);
  // Cinematic premiere camera
  if(_cinActive && _cinCamAnim) _updateCinCamera(delta);
  // Mission ring pulse
  if(_missionRing) _pulseMissionRing(elapsed);

  // Camera animation
  if(camTarget) {
    camTarget.progress = Math.min(1, camTarget.progress + delta*1.8);
    const t = 1-Math.pow(1-camTarget.progress, 3);
    camera.position.lerpVectors(camTarget.startPos, camTarget.endPos, t);
    controls.target.lerpVectors(camTarget.startLook, camTarget.endLook, t);
    if(camTarget.progress>=1) {
      if(camTarget.onDone) camTarget.onDone();
      camTarget=null;
      isAnimating=false;
    }
  }

  // Update info panel planet position if open
  if(currentPlanet && !camTarget) {
    const entry = planetMeshes.find(p=>p.pdata.id===currentPlanet);
    if(entry) {
      entry.group.getWorldPosition(_wposTmp);
      controls.target.lerp(_wposTmp, 0.05);
    }
  }

  updateRocketFlight(delta);
  controls.update();
  renderer.render(scene, camera);
  _updatePlanetLabels();
}

// ─── RESIZE ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── INTRO ───────────────────────────────────────────────────────────────────
(function initIntro(){
  // ── Atmospheric overlay canvas (NOT a 2D solar system — the 3D scene shows through) ──
  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, stopped = false, warping = false, warpT = 0;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  // Shooting stars
  const SHOOTS = Array.from({length:8}, ()=>newShoot());
  function newShoot() {
    return {x:Math.random(), y:Math.random()*0.6, vx:Math.random()*0.003+0.001, vy:Math.random()*0.001+0.0003, life:0, maxLife:80+Math.random()*120, len:0.04+Math.random()*0.06};
  }

  // Warp stars (used during warp effect)
  const WARP_STARS = Array.from({length:300}, ()=>({
    angle: Math.random()*Math.PI*2, dist: 0.01+Math.random()*0.48, speed: 0.004+Math.random()*0.012, w: 0.8+Math.random()*1.2
  }));

  // Nebula wisp positions
  const WISPS = [[0.15,0.2,0.18,'rgba(0,30,80,.18)'],[0.85,0.15,0.14,'rgba(40,0,80,.12)'],[0.5,0.85,0.22,'rgba(0,20,60,.1)'],[0.7,0.5,0.16,'rgba(60,0,100,.08)']];

  let t = 0;

  function draw() {
    if(stopped) return;
    ctx.clearRect(0,0,W,H);

    if(warping) {
      // ── WARP MODE: white-hot streak zoom ──
      warpT += 0.06;
      const alpha = Math.min(1, warpT*0.4);
      // Deep dark vignette
      const vg = ctx.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.7);
      vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,`rgba(0,0,20,${alpha*.8})`);
      ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

      WARP_STARS.forEach(s=>{
        s.dist += s.speed * (1 + warpT*2.5);
        if(s.dist > 0.7) { s.dist=0.01; s.angle=Math.random()*Math.PI*2; }
        const cx=W*.5, cy=H*.5, diag=Math.max(W,H);
        const x1=cx+Math.cos(s.angle)*s.dist*diag;
        const y1=cy+Math.sin(s.angle)*s.dist*diag;
        const x0=cx+Math.cos(s.angle)*(s.dist-s.speed*12*(1+warpT))*diag;
        const y0=cy+Math.sin(s.angle)*(s.dist-s.speed*12*(1+warpT))*diag;
        const bright = Math.min(1, warpT*0.8);
        ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1);
        ctx.strokeStyle=`rgba(180,230,255,${bright*0.85})`; ctx.lineWidth=s.w; ctx.stroke();
      });

      // White flash at peak
      if(warpT > 2.2) {
        const flashAlpha = Math.min(1,(warpT-2.2)*1.2);
        ctx.fillStyle=`rgba(220,240,255,${flashAlpha})`; ctx.fillRect(0,0,W,H);
      }
      requestAnimationFrame(draw); return;
    }

    // ── NORMAL MODE: atmospheric overlay on top of live 3D scene ──
    // Subtle dark vignette so text stays readable
    const vg = ctx.createRadialGradient(W*.5,H*.5,Math.min(W,H)*.18,W*.5,H*.5,Math.min(W,H)*.72);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,2,14,.72)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // Edge darken
    ctx.fillStyle='rgba(0,2,18,.55)';
    [[0,0,W,60],[0,H-60,W,60],[0,0,60,H],[W-60,0,60,H]].forEach(([x,y,w,h])=>ctx.fillRect(x,y,w,h));

    // Nebula wisps
    WISPS.forEach(([rx,ry,rr,col])=>{
      const g=ctx.createRadialGradient(rx*W,ry*H,0,rx*W,ry*H,rr*Math.min(W,H));
      g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    });

    // Shooting stars
    SHOOTS.forEach((s,i)=>{
      s.life++;
      const progress = s.life/s.maxLife;
      const alpha = progress < 0.15 ? progress/0.15 : progress > 0.75 ? (1-progress)/0.25 : 1;
      const x1=s.x*W, y1=s.y*H;
      const x0=x1-s.len*W*s.vx*s.maxLife*0.5, y0=y1-s.len*H*s.vy*s.maxLife*0.5;
      const grad=ctx.createLinearGradient(x0,y0,x1,y1);
      grad.addColorStop(0,'rgba(255,255,255,0)'); grad.addColorStop(1,`rgba(200,230,255,${alpha*0.9})`);
      ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1);
      ctx.strokeStyle=grad; ctx.lineWidth=1.2; ctx.stroke();
      s.x += s.vx; s.y += s.vy;
      if(s.life >= s.maxLife) SHOOTS[i] = newShoot();
    });

    // Scanline
    const scanY = ((t * 0.7) % 1) * H;
    const sg = ctx.createLinearGradient(0,scanY-2,0,scanY+2);
    sg.addColorStop(0,'rgba(0,212,255,0)'); sg.addColorStop(0.5,'rgba(0,212,255,.08)'); sg.addColorStop(1,'rgba(0,212,255,0)');
    ctx.fillStyle=sg; ctx.fillRect(0,scanY-2,W,4);

    t += 0.004;
    requestAnimationFrame(draw);
  }
  draw();

  // ── Warp trigger on START ──
  document.getElementById('start-btn').addEventListener('click', ()=>{
    warping=true; stopped=false;
  }, {once:true});

  // ── Loading progress bar ──────────────────────────────────────────────────
  const fill  = document.getElementById('intro-loader-fill');
  const label = document.getElementById('intro-loader-label');
  const btn   = document.getElementById('start-btn');
  let prog = 0;
  const LABELS = ['Scanning Solar System','Loading Textures','Building Orbits','Placing Planets','Lighting Stars'];
  let labelIdx = 0;
  const rampId = setInterval(() => {
    if(prog >= 88) { clearInterval(rampId); return; }
    prog = Math.min(88, prog + (88 - prog) * 0.055 + 0.4);
    fill.style.width = prog.toFixed(1) + '%';
    const newIdx = Math.min(LABELS.length-1, Math.floor(prog / 20));
    if(newIdx !== labelIdx) { labelIdx = newIdx; label.textContent = LABELS[labelIdx]; }
  }, 80);

  window.addEventListener('solar-system-ready', () => {
    clearInterval(rampId); prog = 100;
    fill.style.width = '100%'; label.textContent = 'Ready';
    setTimeout(() => {
      document.getElementById('intro-loader').style.opacity = '0';
      document.getElementById('intro-loader').style.transition = 'opacity .4s';
      btn.disabled = false; btn.style.animation = 'wc-btn-pulse 2s ease-in-out infinite';
    }, 320);
  }, {once: true});
})();

// ─── OPENING FANFARE ─────────────────────────────────────────────────────────
function playOpeningFanfare() {
  if(!audioCtx) return;
  const ctx = audioCtx, now = ctx.currentTime;
  const master = ctx.createGain(); master.gain.setValueAtTime(0.001,now); master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.85,now+0.05);
  master.gain.setValueAtTime(0.85,now+0.6);
  master.gain.linearRampToValueAtTime(0,now+4.5);

  // Sub-bass impact boom
  [55,55,110].forEach((freq,i)=>{
    const osc=ctx.createOscillator(), g=ctx.createGain();
    osc.type='sine'; osc.frequency.setValueAtTime(freq,now+i*0.02);
    g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(0.5,now+0.04+i*.015);
    g.gain.exponentialRampToValueAtTime(0.001,now+1.4+i*.1);
    osc.connect(g); g.connect(master); osc.start(now); osc.stop(now+1.6);
  });

  // Orchestral string swell — stacked saw oscillators detuned for richness
  const STRING_FREQS = [130.8,164.8,196,220,261.6,329.6,392,440,523];
  STRING_FREQS.forEach((freq,i)=>{
    [0,-8,8].forEach(detune=>{
      const osc=ctx.createOscillator(), g=ctx.createGain(), filt=ctx.createBiquadFilter();
      osc.type='sawtooth'; osc.frequency.value=freq; osc.detune.value=detune;
      filt.type='lowpass'; filt.frequency.setValueAtTime(800+i*100,now); filt.Q.value=0.5;
      const start=now+0.08+i*0.04, peak=start+0.3;
      g.gain.setValueAtTime(0,start); g.gain.linearRampToValueAtTime(0.09,peak);
      g.gain.exponentialRampToValueAtTime(0.04,now+2.5); g.gain.linearRampToValueAtTime(0,now+4.2);
      osc.connect(filt); filt.connect(g); g.connect(master);
      osc.start(start); osc.stop(now+4.4);
    });
  });

  // High shimmer bells
  [1046,1318,1568,2093].forEach((freq,i)=>{
    const osc=ctx.createOscillator(), g=ctx.createGain();
    osc.type='sine'; osc.frequency.setValueAtTime(freq,now);
    const t0=now+0.5+i*0.18;
    g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(0.12,t0+0.02);
    g.gain.exponentialRampToValueAtTime(0.001,t0+2.2);
    osc.connect(g); g.connect(master); osc.start(t0); osc.stop(t0+2.4);
  });

  // Percussion hit — filtered noise burst
  const nBuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.18),ctx.sampleRate);
  const nd=nBuf.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=(Math.random()*2-1);
  const nSrc=ctx.createBufferSource(), nFilt=ctx.createBiquadFilter(), nGain=ctx.createGain();
  nSrc.buffer=nBuf; nFilt.type='bandpass'; nFilt.frequency.value=180; nFilt.Q.value=0.8;
  nGain.gain.setValueAtTime(1.2,now); nGain.gain.exponentialRampToValueAtTime(0.001,now+0.22);
  nSrc.connect(nFilt); nFilt.connect(nGain); nGain.connect(master); nSrc.start(now);
}

document.getElementById('start-btn').addEventListener('click', () => {
  if(!audioCtx) initAudio();
  if(audioCtx) { audioCtx.resume(); playOpeningFanfare(); }

  // Short delay to let warp animation peak, then flash and enter
  setTimeout(()=>{
    const warp = document.getElementById('warp-overlay');
    warp.classList.add('flash');
    setTimeout(()=>{
      document.getElementById('intro').classList.add('hide');
      setTimeout(()=>{
        document.getElementById('intro').style.display='none';
        warp.classList.remove('flash');
        runCinematic();
      }, 500);
    }, 350);
  }, 1800);
});

// ─── ROCKET MODE ─────────────────────────────────────────────────────────────
let rocketModeActive = false;
let rocketFlight = null;
let _rocketStoryTimer = null;
let _selectedRocketDest = null;

// Per-destination kid-friendly story data
const ROCKET_DESTINATIONS = {
  sun:{name:'The Sun',emoji:'☀️',color:'#ffcc00',bg:'rgba(255,180,0,.15)',
    tagline:'Our star — 109× wider than Earth!',travel:'~8 min at speed of light',
    launchMsg:'Heading to the center of our solar system!',
    facts:[
      {icon:'🔥',text:'The Sun is SO big, you could fit 1.3 million Earths inside it — with room to spare!'},
      {icon:'⚡',text:'The Sun\'s surface is 5,500°C. Hot enough to vaporize rock instantly!'},
      {icon:'💫',text:'Light from the Sun takes exactly 8 minutes to reach Earth. You\'re looking into the past!'},
      {icon:'🌊',text:'The Sun\'s gravity is so powerful, it holds all 8 planets in orbit across billions of km.'},
    ],
    arrivalEmoji:'☀️',
    arrivalTitle:'YOU\'RE AT THE SUN!',
    arrivalMsg:'Feel that heat? This giant ball of plasma is the reason every planet exists — and the reason YOU exist!'},
  mercury:{name:'Mercury',emoji:'⚫',color:'#b5b5b5',bg:'rgba(160,160,160,.1)',
    tagline:'Closest to the Sun but not the hottest!',travel:'~3 months at rocket speed',
    launchMsg:'Zooming to the fastest planet in the solar system!',
    facts:[
      {icon:'🏃',text:'Mercury races around the Sun in just 88 days — that\'s 4 trips while Earth makes 1!'},
      {icon:'❄️',text:'Even though Mercury is closest to the Sun, Venus is hotter! Mercury has no atmosphere to trap heat.'},
      {icon:'🌕',text:'Mercury looks like our Moon — totally covered in craters from billions of asteroid impacts!'},
      {icon:'🌡️',text:'Temperatures swing 600°C from day to night. From -180°C to 430°C in one spin!'},
    ],
    arrivalEmoji:'⚫',
    arrivalTitle:'WELCOME TO MERCURY!',
    arrivalMsg:'The Swift Messenger! This tiny, speedy world is the most cratered place in our solar system. Every dent tells the story of an ancient crash!'},
  venus:{name:'Venus',emoji:'🟡',color:'#e8c97a',bg:'rgba(220,180,80,.1)',
    tagline:'Earth\'s evil twin — a toxic hellscape!',travel:'~4 months at rocket speed',
    launchMsg:'Heading to the brightest planet in our night sky!',
    facts:[
      {icon:'🌡️',text:'Venus is 464°C every single day. That\'s hot enough to melt lead! ☠️'},
      {icon:'🔄',text:'Venus spins BACKWARDS — the Sun rises in the west! A day on Venus is longer than its year. 🤯'},
      {icon:'☁️',text:'The clouds around Venus are made of sulfuric acid. Definitely don\'t forget your spacesuit!'},
      {icon:'⭐',text:'Venus is so bright it casts shadows at night on Earth! That\'s because its clouds reflect 70% of sunlight.'},
    ],
    arrivalEmoji:'🌋',
    arrivalTitle:'YOU\'VE REACHED VENUS!',
    arrivalMsg:'Earth\'s "evil twin" — similar size but completely different! 462°C, acid clouds, and it spins backwards. Good thing our spacecraft can handle it!'},
  earth:{name:'Earth',emoji:'🌍',color:'#4a9eca',bg:'rgba(74,158,202,.1)',
    tagline:'The only home we\'ve ever known!',travel:'You\'re already here!',
    launchMsg:'Let\'s see our beautiful home from above!',
    facts:[
      {icon:'🌊',text:'Earth is 71% water — that\'s why astronauts call it the "Blue Marble" from space!'},
      {icon:'🧬',text:'Earth is the ONLY known planet with life. Every living thing here is incredibly precious!'},
      {icon:'🛡️',text:'Earth has an invisible magnetic shield that deflects harmful solar radiation. It\'s our superpower!'},
      {icon:'🌀',text:'The thin layer of atmosphere keeping us alive? From space it looks like the skin of an apple.'},
    ],
    arrivalEmoji:'🌍',
    arrivalTitle:'HOME SWEET HOME!',
    arrivalMsg:'Earth — the only place in the universe we KNOW has life. From space, you can see why astronauts come back changed forever. It\'s beautiful and fragile.'},
  mars:{name:'Mars',emoji:'🔴',color:'#c1440e',bg:'rgba(193,68,14,.12)',
    tagline:'The Red Planet — future home of humans?',travel:'~7 months at rocket speed',
    launchMsg:'Blasting off to the most explored planet beyond Earth!',
    facts:[
      {icon:'🏔️',text:'Mars has Olympus Mons — the TALLEST volcano in the solar system at 22km. Three times taller than Everest!'},
      {icon:'🤖',text:'There are robots on Mars RIGHT NOW! Perseverance rover is searching Jezero Crater for ancient life.'},
      {icon:'🌊',text:'Billions of years ago Mars had oceans and rivers. Ancient microbes may have swum in them!'},
      {icon:'🌪️',text:'Dust storms on Mars can cover the ENTIRE PLANET for months. The biggest storms in the solar system!'},
    ],
    arrivalEmoji:'🔴',
    arrivalTitle:'YOU\'RE ON MARS!',
    arrivalMsg:'The Red Planet! The rusty color comes from iron oxide — basically rust everywhere. Future astronauts will walk here someday. Maybe someone reading this will be one of them!'},
  jupiter:{name:'Jupiter',emoji:'🟠',color:'#c88b3a',bg:'rgba(200,139,58,.1)',
    tagline:'King of the Planets!',travel:'~2 years at rocket speed',
    launchMsg:'Heading to the biggest planet in our solar system!',
    facts:[
      {icon:'🌍',text:'Jupiter is SO massive you could fit ALL the other planets inside it — with room to spare! 🤯'},
      {icon:'🌪️',text:'The Great Red Spot is a storm BIGGER THAN EARTH that has been spinning for over 350 years!'},
      {icon:'🛡️',text:'Jupiter acts like Earth\'s bodyguard! Its huge gravity attracts asteroids that might hit us.'},
      {icon:'👽',text:'Jupiter\'s moon Europa has a liquid ocean under its ice. Scientists think it might harbor alien life!'},
    ],
    arrivalEmoji:'🌩️',
    arrivalTitle:'WELCOME TO JUPITER!',
    arrivalMsg:'The GIANT! Can you feel how tiny our rocket is? Jupiter is so massive its gravity literally warps the paths of comets across the entire solar system!'},
  saturn:{name:'Saturn',emoji:'💛',color:'#e8d090',bg:'rgba(220,195,100,.08)',
    tagline:'The Jewel of the Solar System!',travel:'~3 years at rocket speed',
    launchMsg:'Flying to the most beautiful planet in the solar system!',
    facts:[
      {icon:'💍',text:'Saturn\'s rings span 282,000 km — Earth-to-Moon distance — but they\'re only about 10m thick!'},
      {icon:'🏊',text:'Saturn is so light it would FLOAT if you had a bathtub big enough! Less dense than water!'},
      {icon:'🔮',text:'Saturn\'s north pole has a perfect hexagon-shaped storm — a shape nature rarely makes!'},
      {icon:'🌊',text:'Saturn\'s moon Titan has rivers and lakes of liquid methane. A whole alien world!'},
    ],
    arrivalEmoji:'💛',
    arrivalTitle:'SATURN AWAITS!',
    arrivalMsg:'Those rings are made of billions of ice chunks — each one tumbling silently through space. When Cassini flew through them, it was like driving through a blizzard!'},
  uranus:{name:'Uranus',emoji:'🔵',color:'#7de8e8',bg:'rgba(125,232,232,.08)',
    tagline:'The planet that rolls around the Sun on its side!',travel:'~9 years at rocket speed',
    launchMsg:'Journey to the strangest tilted planet in the solar system!',
    facts:[
      {icon:'🔄',text:'Uranus spins on its SIDE at 98°! Scientists think a massive planet crashed into it long ago!'},
      {icon:'❄️',text:'At -224°C, Uranus is somehow colder than Neptune even though Neptune is farther away!'},
      {icon:'💨',text:'Winds on Uranus reach 900 km/h. That\'s almost supersonic — faster than most jet planes!'},
      {icon:'🕯️',text:'One pole gets 42 years of non-stop sunlight, then 42 years of total darkness. Imagine that!'},
    ],
    arrivalEmoji:'🌀',
    arrivalTitle:'THE SIDEWAYS PLANET!',
    arrivalMsg:'From here, the Sun looks like just a bright star in the distance. Uranus is the mystery planet — quieter than it should be, colder than it should be, tipped over for reasons we\'re still figuring out!'},
  neptune:{name:'Neptune',emoji:'🌊',color:'#4060ff',bg:'rgba(64,96,255,.1)',
    tagline:'The windiest, most distant planet!',travel:'~12 years at rocket speed',
    launchMsg:'The longest journey yet — to the edge of our solar system!',
    facts:[
      {icon:'💨',text:'Neptune\'s winds reach 2,100 km/h — faster than the speed of sound! The wildest winds anywhere!'},
      {icon:'🔭',text:'Neptune was discovered by MATH before anyone saw it — scientists noticed Uranus was being pulled!'},
      {icon:'🧊',text:'Neptune\'s moon Triton is -235°C — one of the coldest spots in the entire solar system!'},
      {icon:'⏰',text:'One year on Neptune = 165 Earth years. It\'s only completed ONE full orbit since we discovered it!'},
    ],
    arrivalEmoji:'🌊',
    arrivalTitle:'THE EDGE OF OUR SOLAR SYSTEM!',
    arrivalMsg:'From here, the Sun is just a bright dot among millions of stars. You\'ve traveled to the frontier. Beyond here lies the Kuiper Belt and the deep unknown. Space is enormous!'},
  pluto:{name:'Pluto',emoji:'⚪',color:'#d4c4b0',bg:'rgba(200,190,170,.08)',
    tagline:'The dwarf planet with a heart of ice!',travel:'~14 years at rocket speed',
    launchMsg:'All the way to Pluto — the little world with a giant heart!',
    facts:[
      {icon:'❤️',text:'Pluto has a heart! A massive nitrogen glacier the shape of a heart visible from space! 💕'},
      {icon:'🔭',text:'We only saw Pluto up close for the first time in 2015 — after New Horizons traveled 9 years!'},
      {icon:'🏔️',text:'Pluto has mountains as tall as the Rockies — made of water ice as hard as rock at -230°C!'},
      {icon:'🌙',text:'Pluto and its moon Charon are so close in size, they orbit each other like a double world!'},
    ],
    arrivalEmoji:'🎉',
    arrivalTitle:'YOU MADE IT TO PLUTO!',
    arrivalMsg:'Billions of kilometers from home! This little world with a big heart was once called the 9th planet. Reclassified or not — Pluto is still amazing. You just completed a 14-year journey!'},
};

// Mission narration during flight
const MISSION_FACTS = {
  iss:[
    {icon:'🚀',text:'The ISS travels at 28,000 km/h and completes a full orbit every 90 minutes!'},
    {icon:'👨‍🚀',text:'Astronauts see 16 sunrises and sunsets EVERY DAY from the ISS!'},
    {icon:'🔬',text:'The ISS is a giant science lab — over 3,000 experiments have been conducted on board!'},
  ],
  default:[
    {icon:'🛸',text:'This spacecraft is one of humanity\'s greatest achievements in exploration!'},
    {icon:'🔭',text:'The data collected has changed how we understand our universe!'},
    {icon:'⭐',text:'Every mission like this is proof that humans can do extraordinary things when we work together!'},
  ]
};

// Build rocket mesh — better proportions with exhaust cone
function createRocketMesh() {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({color:0xe8e8f0,metalness:.8,roughness:.2});
  const noseMat = new THREE.MeshStandardMaterial({color:0xff3322,metalness:.5,roughness:.3});
  const finMat  = new THREE.MeshStandardMaterial({color:0xcc1100,metalness:.4,roughness:.4});
  const engineMat = new THREE.MeshStandardMaterial({color:0x888899,metalness:.9,roughness:.1});
  // Main body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.6,12),bodyMat);
  // Nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.09,.32,12),noseMat);
  nose.position.y = .46;
  // Engine bell
  const engine = new THREE.Mesh(new THREE.CylinderGeometry(.07,.13,.12,12),engineMat);
  engine.position.y = -.38;
  // Fins x4 (swept-back shape)
  for(let i=0;i<4;i++){
    const fin = new THREE.Mesh(new THREE.BoxGeometry(.015,.2,.14),finMat);
    const a = i/4*Math.PI*2;
    fin.position.set(Math.cos(a)*.11,-.28,Math.sin(a)*.11);
    fin.rotation.y = a;
    g.add(fin);
  }
  // Exhaust flame (multiple layers for depth)
  const flame1 = new THREE.Mesh(
    new THREE.ConeGeometry(.06,.22,8),
    new THREE.MeshBasicMaterial({color:0xffbb00,transparent:true,opacity:.9})
  );
  flame1.position.y = -.55; flame1.rotation.z = Math.PI;
  const flame2 = new THREE.Mesh(
    new THREE.ConeGeometry(.04,.18,8),
    new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7})
  );
  flame2.position.y = -.52; flame2.rotation.z = Math.PI;
  const bloom = new THREE.Mesh(
    new THREE.SphereGeometry(.18,8,8),
    new THREE.MeshBasicMaterial({color:0xff4400,transparent:true,opacity:.18,side:THREE.BackSide})
  );
  bloom.position.y = -.52;
  g.add(body,nose,engine,flame1,flame2,bloom);
  g.visible = false;
  scene.add(g);
  return g;
}
const rocketMesh = createRocketMesh();

// Exhaust particle trail
const TRAIL_SIZE = 80;
const trailPositions = new Float32Array(TRAIL_SIZE * 3);
const trailGeo = new THREE.BufferGeometry();
trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
const trailMat = new THREE.PointsMaterial({color:0xff8800,size:0.12,transparent:true,opacity:.55,sizeAttenuation:true});
const trailPoints = new THREE.Points(trailGeo, trailMat);
trailPoints.visible = false;
scene.add(trailPoints);
let trailIdx = 0;

function quadBezier(p0,p1,p2,t){
  return p0.clone().lerp(p1,t).lerp(p1.clone().lerp(p2,t),t);
}

// ── Launchpad UI ─────────────────────────────────────────────────────────────
function openRocketLaunchpad() {
  closePanel();
  closeMissionPanel();
  _selectedRocketDest = null;
  document.getElementById('rl-launch-btn').classList.remove('ready');
  buildLaunchpadCards();
  document.getElementById('rocket-launchpad').classList.add('open');
  document.getElementById('rocket-mode-btn').classList.add('active');
  rocketModeActive = true;
}

function closeRocketLaunchpad() {
  document.getElementById('rocket-launchpad').classList.remove('open');
  document.getElementById('rocket-mode-btn').classList.remove('active');
  rocketModeActive = false;
  _selectedRocketDest = null;
}

function buildLaunchpadCards() {
  const planetsDiv = document.getElementById('rl-dest-planets');
  const missionsDiv = document.getElementById('rl-dest-missions');
  planetsDiv.innerHTML = '';
  missionsDiv.innerHTML = '';

  // Sun + planets
  // PLANETS already starts with the Sun; prepending another produced two
  // identical "The Sun" destination cards that both matched on selection.
  const allPlanets = PLANETS.map(p=>({id:p.id,name:p.name,color:p.color}));
  allPlanets.forEach(p => {
    const d = ROCKET_DESTINATIONS[p.id];
    if(!d) return;
    const card = document.createElement('div');
    card.className = 'rl-dest-card';
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="rl-dest-dot" style="background:${d.bg||'rgba(255,255,255,.08)'};color:${d.color}">${d.emoji}</div>
      <div class="rl-dest-info">
        <div class="rl-dest-name">${d.name}</div>
        <div class="rl-dest-tag">${d.tagline}</div>
        <div class="rl-dest-travel">&#9670; ${d.travel}</div>
      </div>
      <div class="rl-dest-arrow">&#8250;</div>`;
    card.addEventListener('click', () => selectRocketDest(p.id));
    planetsDiv.appendChild(card);
  });

  // Missions
  MISSIONS.forEach(m => {
    const card = document.createElement('div');
    card.className = 'rl-dest-card';
    card.dataset.id = m.id;
    card.innerHTML = `
      <div class="rl-dest-dot" style="background:rgba(0,212,255,.08);color:#00d4ff;font-size:14px">&#9678;</div>
      <div class="rl-dest-info">
        <div class="rl-dest-name">${m.name}</div>
        <div class="rl-dest-tag">${m.tagline}</div>
        <div class="rl-dest-travel">&#9670; ${m.type} — ${m.agency.split('/')[0]}</div>
      </div>
      <div class="rl-dest-arrow">&#8250;</div>`;
    card.addEventListener('click', () => selectRocketDest(m.id));
    missionsDiv.appendChild(card);
  });
}

function selectRocketDest(id) {
  _selectedRocketDest = id;
  document.querySelectorAll('.rl-dest-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
  const btn = document.getElementById('rl-launch-btn');
  const d = ROCKET_DESTINATIONS[id];
  const m = MISSIONS.find(x => x.id === id);
  const name = d ? d.name : (m ? m.name : id);
  btn.textContent = `▶  LAUNCH TO ${name.toUpperCase()}`;
  btn.classList.add('ready');
}

function launchRocket(targetId) {
  closeRocketLaunchpad();
  const d = ROCKET_DESTINATIONS[targetId];
  const m = MISSIONS.find(x => x.id === targetId);
  const name = d ? d.name : (m ? m.name : targetId);

  // Show countdown
  const cd = document.getElementById('rocket-countdown');
  const cdNum = document.getElementById('rcd-number');
  const cdDest = document.getElementById('rcd-dest-name');
  const cdBlast = document.getElementById('rcd-blast');
  cdDest.textContent = name.toUpperCase();
  cdNum.textContent = '3';
  cdBlast.classList.remove('show');
  cd.classList.add('show');

  let count = 3;
  const tick = setInterval(() => {
    count--;
    if(count > 0) {
      cdNum.textContent = count;
    } else {
      clearInterval(tick);
      cdNum.textContent = '';
      cdBlast.classList.add('show');
      setTimeout(() => {
        cd.classList.remove('show');
        _doStartFlight(targetId);
      }, 900);
    }
  }, 900);
}

function _doStartFlight(targetId) {
  const entry = planetMeshes.find(p => p.pdata.id === targetId);
  const mObj  = missionMeshes.find(x => x.mission.id === targetId);
  const isMission = !!mObj && !entry;

  let endWorldPos = new THREE.Vector3();
  let targetSize = 1;

  if(targetId === 'sun') {
    endWorldPos.set(0, 0, 0);
    targetSize = 2.5;
  } else if(entry) {
    entry.group.getWorldPosition(endWorldPos);
    targetSize = entry.pdata.size;
  } else if(mObj) {
    mObj.group.getWorldPosition(endWorldPos);
    targetSize = 0.4;
  } else { return; }

  const startPos = camera.position.clone();
  const dist = startPos.distanceTo(endWorldPos);
  const mid = startPos.clone().add(endWorldPos).multiplyScalar(0.5);
  mid.y += Math.max(dist * 0.4, 18);

  const direction = endWorldPos.clone().sub(mid).normalize();
  const endCam = endWorldPos.clone().add(direction.multiplyScalar(-(targetSize * 5 + 3)));
  endCam.y += targetSize * 1.5;

  rocketMesh.position.copy(startPos);
  rocketMesh.visible = true;
  trailPoints.visible = true;
  trailIdx = 0;

  // Prepare story facts
  const d = ROCKET_DESTINATIONS[targetId];
  const facts = d ? d.facts : (MISSION_FACTS[targetId] || MISSION_FACTS.default);
  // Give ~10 seconds per fact card so kids can actually read them
  const SECS_PER_FACT = 10;
  const duration = Math.max(facts.length * SECS_PER_FACT + 8, 35);

  rocketFlight = {
    targetId, isMission,
    startPos: startPos.clone(), midPos: mid,
    endPos: endWorldPos.clone(), endCam,
    progress: 0, duration, totalDist: dist,
    facts, factIdx: 0, factTimer: 0, factInterval: SECS_PER_FACT
  };

  // Show flight HUD
  document.getElementById('rfh-dest-label').textContent = 'TO ' + (d ? d.name.toUpperCase() : targetId.toUpperCase());
  document.getElementById('rfh-bar-fill').style.width = '0%';
  document.getElementById('rfh-eta').textContent = '—';
  document.getElementById('rocket-flight-hud').classList.add('show');
  showRocketStoryCard(facts[0], true);

  playRocketLaunch();
}

function showRocketStoryCard(fact, immediate) {
  const card = document.getElementById('rfh-story-card');
  card.classList.remove('show');
  const delay = immediate ? 400 : 100;
  setTimeout(() => {
    document.getElementById('rfh-icon').textContent = fact.icon;
    document.getElementById('rfh-text').textContent = fact.text;
    if(rocketFlight) {
      const total = rocketFlight.facts.length;
      const cur = rocketFlight.factIdx + 1;
      document.getElementById('rfh-fact-counter').textContent = `FACT ${cur} OF ${total}`;
    }
    card.classList.add('show');
  }, delay);
}

function abortRocketFlight() {
  if(!rocketFlight) return;
  rocketFlight = null;
  rocketMesh.visible = false;
  trailPoints.visible = false;
  document.getElementById('rocket-flight-hud').classList.remove('show');
  document.getElementById('rocket-arrival').classList.remove('show');
  rocketModeActive = false;
  document.getElementById('rocket-mode-btn').classList.remove('active');
}

// Wired here rather than via an inline onclick: universe.js is a module, so
// abortRocketFlight is not a global and onclick= would throw ReferenceError.
document.getElementById('rfh-abort-btn').addEventListener('click', abortRocketFlight);

// Rocket mode toggle
document.getElementById('rocket-mode-btn').addEventListener('click',()=>{
  closeSideMenu();
  if(rocketModeActive) {
    closeRocketLaunchpad();
  } else {
    openRocketLaunchpad();
  }
});
document.getElementById('rl-close').addEventListener('click', closeRocketLaunchpad);
document.getElementById('rl-launch-btn').addEventListener('click', () => {
  if(_selectedRocketDest) launchRocket(_selectedRocketDest);
});

// Rocket flight update — called inside animate()
function updateRocketFlight(delta) {
  if(!rocketFlight) return;
  rocketFlight.progress = Math.min(1, rocketFlight.progress + delta / rocketFlight.duration);
  const t = rocketFlight.progress;
  // Ease-in then slow approach at end
  const eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;

  const rPos = quadBezier(rocketFlight.startPos, rocketFlight.midPos, rocketFlight.endPos, eased);
  rocketMesh.position.copy(rPos);

  // Point rocket toward travel direction
  const ahead = quadBezier(rocketFlight.startPos, rocketFlight.midPos, rocketFlight.endPos, Math.min(1, eased + 0.02));
  rocketMesh.lookAt(ahead);
  rocketMesh.rotateX(Math.PI / 2);

  // Exhaust flame pulse
  const pulse = 0.85 + Math.sin(Date.now() * 0.025) * 0.15;
  rocketMesh.children.forEach(c => {
    if(c.material && c.material.transparent && c.material.color && c.material.color.r > 0.8)
      c.material.opacity = (0.7 + Math.random() * 0.3) * pulse;
  });

  // Exhaust trail — ring-buffer of positions
  trailPositions[trailIdx * 3]     = rPos.x + (Math.random()-0.5)*0.05;
  trailPositions[trailIdx * 3 + 1] = rPos.y + (Math.random()-0.5)*0.05;
  trailPositions[trailIdx * 3 + 2] = rPos.z + (Math.random()-0.5)*0.05;
  trailIdx = (trailIdx + 1) % TRAIL_SIZE;
  trailGeo.attributes.position.needsUpdate = true;

  // Camera: smooth follow behind rocket
  const dir = ahead.clone().sub(rPos).normalize();
  const camBehind = rPos.clone().sub(dir.clone().multiplyScalar(4)).add(new THREE.Vector3(0, 1.5, 0));
  camera.position.lerp(camBehind, 0.06);
  controls.target.lerp(rPos, 0.09);

  // Story card cycling
  rocketFlight.factTimer += delta;
  if(rocketFlight.factTimer >= rocketFlight.factInterval && rocketFlight.factIdx < rocketFlight.facts.length - 1) {
    rocketFlight.factTimer = 0;
    rocketFlight.factIdx++;
    showRocketStoryCard(rocketFlight.facts[rocketFlight.factIdx], false);
  }

  // HUD progress bar + ETA
  document.getElementById('rfh-bar-fill').style.width = (t * 100).toFixed(1) + '%';
  const etaSec = Math.ceil((1-t)*rocketFlight.duration);
  document.getElementById('rfh-eta').textContent = etaSec > 60 ? Math.ceil(etaSec/60)+'m '+('0'+(etaSec%60)).slice(-2)+'s' : etaSec+'s';

  if(rocketFlight.progress >= 1) {
    // Arrival
    rocketMesh.visible = false;
    trailPoints.visible = false;
    const arrivedId = rocketFlight.targetId;
    const isMission = rocketFlight.isMission;
    rocketFlight = null;
    rocketFlightCount++;
    checkAchievements();

    // Hide flight HUD
    document.getElementById('rocket-flight-hud').classList.remove('show');
    document.getElementById('rfh-story-card').classList.remove('show');

    // Show arrival banner
    const d = ROCKET_DESTINATIONS[arrivedId];
    if(d) {
      const ra = document.getElementById('rocket-arrival');
      document.getElementById('ra-emoji').textContent = d.arrivalEmoji;
      document.getElementById('ra-title').textContent = d.arrivalTitle;
      document.getElementById('ra-msg').textContent = d.arrivalMsg;
      ra.classList.add('show');
      setTimeout(() => ra.classList.remove('show'), 4500);
    }

    // Open destination info
    setTimeout(() => {
      if(arrivedId in missionLookup) {
        openMission(arrivedId);
      } else if(arrivedId !== 'sun') {
        openPlanet(arrivedId, true);
      } else {
        openSun();
      }
    }, 800);
  }
}

// ─── AUDIO SYSTEM (WARM STELLARDRONE / INTERSTELLAR AMBIENT SYNTH) ───────────
let audioCtx = null;
let audioEnabled = false;
let ambientMaster = null;
let masterUserVolume = 0.75; // 0.0 to 1.0 controlled by #audio-vol-slider
let _isMusicDucked = false;  // true while TTS voiceover is speaking (80% duck)

function _effectiveBgmGain() {
  const base = 0.56 * masterUserVolume;
  return _isMusicDucked ? base * 0.20 : base;
}

function _effectiveAmbientGain() {
  const base = 0.09 * masterUserVolume;
  return _isMusicDucked ? base * 0.20 : base;
}

// Automatically ducks background music by 80% during any voice narration
function setMusicDuck(isDucking) {
  _isMusicDucked = !!isDucking;
  if (!audioCtx || !audioEnabled) return;
  const now = audioCtx.currentTime;
  const ramp = isDucking ? 0.25 : 0.9;
  if (bgmMaster) {
    bgmMaster.gain.cancelScheduledValues(now);
    bgmMaster.gain.setValueAtTime(bgmMaster.gain.value, now);
    bgmMaster.gain.linearRampToValueAtTime(_effectiveBgmGain(), now + ramp);
  }
  if (ambientMaster) {
    ambientMaster.gain.cancelScheduledValues(now);
    ambientMaster.gain.setValueAtTime(ambientMaster.gain.value, now);
    ambientMaster.gain.linearRampToValueAtTime(_effectiveAmbientGain(), now + ramp);
  }
  if (tourScoreGain) {
    const tBase = 0.22 * masterUserVolume;
    tourScoreGain.gain.cancelScheduledValues(now);
    tourScoreGain.gain.setValueAtTime(tourScoreGain.gain.value, now);
    tourScoreGain.gain.linearRampToValueAtTime(isDucking ? tBase * 0.20 : tBase, now + ramp);
  }
}

function createReverb(ctx, secs, decay) {
  const conv = ctx.createConvolver();
  const sr = ctx.sampleRate, len = Math.floor(sr * secs);
  const buf = ctx.createBuffer(2, len, sr);
  for(let c=0; c<2; c++) {
    const d = buf.getChannelData(c);
    for(let i=0; i<len; i++) {
      // Smooth exponential decay with gentle low-pass warmth
      d[i] = (Math.random()*2-1) * Math.pow(1-i/len, decay) * 0.75;
    }
  }
  conv.buffer = buf;
  return conv;
}

function initAudio() {
  if(audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // ambientMaster: warm sub-harmonic room resonance
  const reverb = createReverb(audioCtx, 8.5, 2.8);
  const reverbGain = audioCtx.createGain(); reverbGain.gain.value = 0.65;
  reverb.connect(reverbGain);
  ambientMaster = audioCtx.createGain();
  ambientMaster.gain.value = 0;
  reverbGain.connect(ambientMaster);
  ambientMaster.connect(audioCtx.destination);
  const dry = audioCtx.createGain(); dry.gain.value = 0.20;
  dry.connect(ambientMaster);

  // Warm, velvety sub-bass fifths (C1 32.7 Hz, G1 49.0 Hz, C2 65.41 Hz)
  [[32.70, 0.16],[49.00, 0.10],[65.41, 0.08]].forEach(([f, g]) => {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = f;
    gain.gain.value = g; osc.connect(gain); gain.connect(dry); osc.start();
  });

  audioEnabled = true;
  syncAudioBtn();
}

function syncAudioBtn() {
  const btn = document.getElementById('audio-btn');
  if(!btn) return;
  btn.innerHTML = (audioEnabled && masterUserVolume > 0.005) ? '&#128266;' : '&#128263;';
  btn.classList.toggle('active', audioEnabled && masterUserVolume > 0.005);
}

// ─── PLANETARIUM BGM: "Stellardrone / Mass Effect Galaxy Pad" ────────────────
// Lush, warm, evolving major/minor 7th & 9th analog-style pad synthesizer:
//   - Progression: Cmaj9 → Am9 → Fmaj9(#11) → G6add9 → Em9 → Dm9 (14s per chord)
//   - Dual detuned warm oscillators (sine + filtered triangle/saw) per voice
//   - Slow breathing low-pass filter sweep (220 Hz – 640 Hz)
//   - Soft celestial harmonic chime overtones (zero harsh static or noise!)

let bgmNodes = [];
let bgmMaster = null;
let bgmPadVoices = [];
let bgmChordInterval = null;
let bgmMotifInterval = null;

function startPlanetariumBGM() {
  if(!audioCtx || bgmMaster) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;

  // Lush cosmic hall convolution reverb
  const hall  = createReverb(ctx, 7.5, 2.5);
  const hallG = ctx.createGain(); hallG.gain.value = 0.68;
  hall.connect(hallG);

  // Master bus with warm lowpass mastering filter so nothing ever sounds piercing
  const masterLp = ctx.createBiquadFilter();
  masterLp.type = 'lowpass';
  masterLp.frequency.value = 1850;
  masterLp.Q.value = 0.35;

  bgmMaster = ctx.createGain();
  bgmMaster.gain.setValueAtTime(0, now);
  bgmMaster.gain.linearRampToValueAtTime(_effectiveBgmGain(), now + 5.5);
  hallG.connect(masterLp);
  masterLp.connect(bgmMaster);
  bgmMaster.connect(ctx.destination);

  const dry = ctx.createGain(); dry.gain.value = 0.26;
  dry.connect(masterLp);

  // ── LAYER 1: Deep Warm Sub-Bass Pedal (glides with chord roots) ──
  const subOsc = ctx.createOscillator();
  const subSub = ctx.createOscillator();
  const subFilt = ctx.createBiquadFilter();
  const subGain = ctx.createGain();
  subOsc.type = 'sine'; subOsc.frequency.value = 65.41; // C2
  subSub.type = 'triangle'; subSub.frequency.value = 32.70; // C1
  subFilt.type = 'lowpass'; subFilt.frequency.value = 140; subFilt.Q.value = 0.4;
  subGain.gain.value = 0.16;
  subOsc.connect(subFilt); subSub.connect(subFilt);
  subFilt.connect(subGain); subGain.connect(dry); subGain.connect(hall);
  subOsc.start(now); subSub.start(now);
  bgmNodes.push(subOsc, subSub);

  // ── LAYER 2: Lush Evolving 6-Voice Analog Pad (7th & 9th voicings) ──
  const CHORDS = [
    // Cmaj9: C2, C3, E3, G3, B3, D4
    { root: 65.41, notes: [130.81, 164.81, 196.00, 246.94, 293.66, 392.00] },
    // Am9: A1, A2, C3, E3, G3, B3
    { root: 55.00, notes: [110.00, 130.81, 164.81, 196.00, 246.94, 329.63] },
    // Fmaj9(#11): F1, F2, A2, C3, E3, G3, B3
    { root: 43.65, notes: [87.31, 130.81, 164.81, 196.00, 246.94, 349.23] },
    // G6(add9): G1, G2, B2, D3, E3, A3
    { root: 49.00, notes: [98.00, 123.47, 146.83, 164.81, 220.00, 293.66] },
    // Em9: E1, E2, G2, B2, D3, F#3
    { root: 41.20, notes: [82.41, 123.47, 146.83, 185.00, 246.94, 329.63] },
    // Dm9: D2, A2, C3, E3, F3, A3
    { root: 73.42, notes: [110.00, 130.81, 164.81, 174.61, 220.00, 293.66] },
  ];
  const PAD_GAINS = [0.032, 0.028, 0.024, 0.020, 0.017, 0.014];

  bgmPadVoices = CHORDS[0].notes.map((freq, vi) => {
    // Dual oscillator per voice: warm triangle + softly detuned sawtooth through a deep lowpass filter
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const mixG = ctx.createGain();
    const sawG = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    const lfo  = ctx.createOscillator();
    const lfoG = ctx.createGain();

    oscA.type = 'triangle';
    oscA.frequency.value = freq;
    oscA.detune.value = -4.5 + vi * 1.2;

    oscB.type = 'sawtooth';
    oscB.frequency.value = freq;
    oscB.detune.value = +4.5 - vi * 1.1;
    sawG.gain.value = 0.28; // subtle analog warmth

    filt.type = 'lowpass';
    filt.frequency.value = 310 + vi * 55;
    filt.Q.value = 0.45;

    // Slow breathing filter LFO (0.04–0.09 Hz = 11–25 second cycle)
    lfo.type = 'sine';
    lfo.frequency.value = 0.042 + vi * 0.009;
    lfoG.gain.value = 110 + vi * 20;
    lfo.connect(lfoG);
    lfoG.connect(filt.frequency);

    mixG.gain.value = PAD_GAINS[vi];
    oscA.connect(filt);
    oscB.connect(sawG);
    sawG.connect(filt);
    filt.connect(mixG);
    mixG.connect(hall);
    mixG.connect(dry);

    oscA.start(now); oscB.start(now); lfo.start(now);
    bgmNodes.push(oscA, oscB, lfo);
    return { oscA, oscB, filt, mixG };
  });

  // Smoothly morph chords every 14 seconds with a 3.8-second portamento glide
  let chordIdx = 0;
  bgmChordInterval = setInterval(() => {
    if (!ctx || !bgmMaster) return;
    chordIdx = (chordIdx + 1) % CHORDS.length;
    const next = CHORDS[chordIdx];
    const t = ctx.currentTime;
    subOsc.frequency.setTargetAtTime(next.root, t, 3.2);
    subSub.frequency.setTargetAtTime(next.root * 0.5, t, 3.2);
    bgmPadVoices.forEach(({ oscA, oscB, filt }, vi) => {
      const f = next.notes[vi];
      oscA.frequency.setTargetAtTime(f, t, 3.5);
      oscB.frequency.setTargetAtTime(f, t, 3.5);
      filt.frequency.setTargetAtTime(290 + vi * 55 + (chordIdx % 2) * 45, t, 3.5);
    });
  }, 14000);

  // ── LAYER 3: Sparse, Dreamy "Galaxy Map" Soft Harmonic Drops ──
  // Warm, slow-attack sine droplets in C Lydian / Major 9th every 16 seconds
  function playGalaxyPulse() {
    if(!ctx || !bgmMaster) return;
    const notes = [523.25, 659.25, 783.99, 987.77, 587.33, 659.25, 392.00];
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const freq = notes[(chordIdx + i * 2) % notes.length];
      const delay = i * 2.4 + Math.random() * 0.4;
      const at = ctx.currentTime + delay;
      const osc = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = freq;
      lp.type = 'lowpass'; lp.frequency.value = 1100;
      // Soft swell attack (0.45s) and long tail (4.2s) — never percussive or harsh
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(0.016, at + 0.45);
      g.gain.exponentialRampToValueAtTime(0.0008, at + 4.4);
      osc.connect(lp); lp.connect(g); g.connect(hall);
      osc.start(at); osc.stop(at + 4.6);
    }
  }
  setTimeout(playGalaxyPulse, 4000);
  bgmMotifInterval = setInterval(playGalaxyPulse, 16000);
}

function stopPlanetariumBGM(fadeTime=2.5) {
  if(bgmChordInterval){ clearInterval(bgmChordInterval); bgmChordInterval=null; }
  if(bgmMotifInterval){ clearInterval(bgmMotifInterval); bgmMotifInterval=null; }
  if(bgmMaster && audioCtx) {
    const now = audioCtx.currentTime;
    bgmMaster.gain.cancelScheduledValues(now);
    bgmMaster.gain.linearRampToValueAtTime(0, now + fadeTime);
  }
  setTimeout(() => {
    bgmNodes.forEach(n => {
      try {
        if(n._isBellTimer) { n._stop(); return; }
        n.stop ? n.stop() : n.disconnect();
      } catch(e){}
    });
    bgmNodes = []; bgmPadVoices = []; bgmMaster = null;
  }, fadeTime*1000+100);
}

function playUIClick() {
  if(!audioCtx || !audioEnabled || masterUserVolume <= 0.005) return;
  const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime+0.07);
  g.gain.setValueAtTime(0.09 * masterUserVolume, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.10);
  osc.connect(g); g.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime+0.11);
}

// ─── PER-PLANET AMBIENT HARMONIC SIGNATURE (ZERO WHITE-NOISE HISS) ───────────
let currentAmbienceNodes = [];

function playPlanetAmbience(id) {
  if(!audioCtx || !audioEnabled || masterUserVolume <= 0.005) return;
  const ctx = audioCtx, now = ctx.currentTime;
  currentAmbienceNodes.forEach(({gainNode,sourceNode})=>{
    try { gainNode.gain.cancelScheduledValues(now); gainNode.gain.setValueAtTime(gainNode.gain.value,now); gainNode.gain.linearRampToValueAtTime(0,now+1.5); sourceNode.stop(now+1.6); } catch(e){}
  });
  currentAmbienceNodes = [];

  const vScale = (_isMusicDucked ? 0.20 : 0.85) * masterUserVolume;
  function track(g,src){ currentAmbienceNodes.push({gainNode:g,sourceNode:src}); }
  function env(g,peak,fi,hold,fo,t0){
    const p = peak * vScale;
    g.gain.setValueAtTime(0,t0);
    g.gain.linearRampToValueAtTime(p,t0+fi);
    g.gain.setValueAtTime(p,t0+fi+hold);
    g.gain.linearRampToValueAtTime(0,t0+fi+hold+fo);
  }
  function osc(type,freq,peak,fi,hold,fo,offset) {
    const o=ctx.createOscillator(),filt=ctx.createBiquadFilter(),g=ctx.createGain(),t0=now+(offset||0);
    o.type=type; o.frequency.setValueAtTime(freq,now);
    filt.type='lowpass'; filt.frequency.setValueAtTime(Math.min(1800, freq*3.5), now);
    env(g,peak,fi,hold,fo,t0);
    o.connect(filt); filt.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(now+(offset||0)+fi+hold+fo+0.05); track(g,o);
  }

  // Warm harmonic chord signatures for each world — no gaseous white noise!
  switch(id) {
    case 'sun':
      // Deep, warm golden harmonic chord (C2, G2, D3, A3) — silent of any gas/static noise
      [[65.41,0.09],[98.00,0.07],[146.83,0.05],[220.00,0.035]].forEach(([f,v],i)=>osc('sine',f,v,1.2,2.2,1.8,i*0.12));
      break;
    case 'mercury':
      [[523.25,0.045],[659.25,0.035],[783.99,0.03]].forEach(([f,v],i)=>osc('sine',f,v,0.3,1.2,1.5,i*0.25));
      break;
    case 'venus':
      [[73.42,0.08],[110.00,0.06],[164.81,0.045]].forEach(([f,v],i)=>osc('triangle',f,v,1.2,2.0,1.8,i*0.18));
      break;
    case 'earth':
      [[261.63,0.07],[329.63,0.055],[392.00,0.05],[493.88,0.035]].forEach(([f,v],i)=>osc('sine',f,v,1.0,2.4,1.6,i*0.15));
      break;
    case 'mars':
      [[146.83,0.07],[220.00,0.055],[261.63,0.045]].forEach(([f,v],i)=>osc('triangle',f,v,1.1,2.0,1.8,i*0.2));
      break;
    case 'jupiter':
      [[43.65,0.11],[65.41,0.085],[98.00,0.06],[130.81,0.04]].forEach(([f,v],i)=>osc('sine',f,v,1.2,2.6,1.8,i*0.15));
      break;
    case 'saturn':
      [[220.00,0.06],[329.63,0.05],[440.00,0.04],[659.25,0.03]].forEach(([f,v],i)=>osc('sine',f,v,0.8,2.2,2.0,i*0.22));
      break;
    case 'uranus':
      [[392.00,0.045],[493.88,0.04],[587.33,0.035]].forEach(([f,v],i)=>osc('sine',f,v,1.4,2.0,1.8,i*0.2));
      break;
    case 'neptune':
      [[55.00,0.09],[82.41,0.07],[123.47,0.05],[164.81,0.035]].forEach(([f,v],i)=>osc('sine',f,v,1.5,2.4,1.8,i*0.2));
      break;
    case 'pluto':
      [[523.25,0.035],[659.25,0.03],[987.77,0.022]].forEach(([f,v],i)=>osc('sine',f,v,1.8,1.8,2.2,i*0.3));
      break;
    default: break;
  }
}

function playPlanetOpen() {
  if(!audioCtx || !audioEnabled || masterUserVolume <= 0.005) return;
  [440, 554.37, 659.25].forEach((f, i) => {
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    osc.type = 'sine';
    const t0 = audioCtx.currentTime + i*0.06;
    osc.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.09 * masterUserVolume, t0+0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t0+0.38);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(t0); osc.stop(t0+0.4);
  });
}

function playCorrect() {
  if(!audioCtx || !audioEnabled || masterUserVolume <= 0.005) return;
  [523.25, 659.25, 783.99].forEach((f, i) => {
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    osc.type = 'triangle';
    const t0 = audioCtx.currentTime + i*0.1;
    osc.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.16 * masterUserVolume, t0+0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t0+0.28);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(t0); osc.stop(t0+0.32);
  });
}

function playWrong() {
  if(!audioCtx || !audioEnabled || masterUserVolume <= 0.005) return;
  const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(130, audioCtx.currentTime+0.25);
  g.gain.setValueAtTime(0.10 * masterUserVolume, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.28);
  osc.connect(g); g.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime+0.3);
}

function playRocketLaunch() {
  if(!audioCtx || !audioEnabled || masterUserVolume <= 0.005) return;
  const now = audioCtx.currentTime;
  // Warm low-frequency thruster rumble (filtered sine sweep + soft lowpass rumble)
  const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(55, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 2.2);
  const lp = audioCtx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 240;
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.22 * masterUserVolume, now + 0.25);
  g.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
  osc.connect(lp); lp.connect(g); g.connect(audioCtx.destination);
  osc.start(now); osc.stop(now + 2.45);
}

function setMasterVolume(val) {
  masterUserVolume = Math.max(0, Math.min(1, val));
  const slider = document.getElementById('audio-vol-slider');
  if (slider && Math.abs(parseFloat(slider.value) - masterUserVolume * 100) > 1) {
    slider.value = String(Math.round(masterUserVolume * 100));
  }
  if (!audioCtx) {
    if (masterUserVolume > 0) {
      initAudio();
      audioCtx.resume();
      startPlanetariumBGM();
    }
    syncAudioBtn();
    return;
  }
  if (masterUserVolume <= 0.005) {
    audioEnabled = false;
  } else if (!audioEnabled) {
    audioEnabled = true;
    audioCtx.resume();
    if (!bgmMaster) startPlanetariumBGM();
  }
  const now = audioCtx.currentTime;
  if (bgmMaster) {
    bgmMaster.gain.cancelScheduledValues(now);
    bgmMaster.gain.setValueAtTime(bgmMaster.gain.value, now);
    bgmMaster.gain.linearRampToValueAtTime(audioEnabled ? _effectiveBgmGain() : 0, now + 0.15);
  }
  if (ambientMaster) {
    ambientMaster.gain.cancelScheduledValues(now);
    ambientMaster.gain.setValueAtTime(ambientMaster.gain.value, now);
    ambientMaster.gain.linearRampToValueAtTime(audioEnabled ? _effectiveAmbientGain() : 0, now + 0.15);
  }
  syncAudioBtn();
}

function toggleAudio() {
  if(!audioCtx) {
    initAudio();
    audioCtx.resume();
    startPlanetariumBGM();
    if(ambientMaster) {
      ambientMaster.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientMaster.gain.linearRampToValueAtTime(_effectiveAmbientGain(), audioCtx.currentTime+1.5);
    }
    syncAudioBtn();
    return;
  }
  audioEnabled = !audioEnabled;
  if(audioEnabled) {
    if (masterUserVolume <= 0.02) {
      masterUserVolume = 0.75;
      const slider = document.getElementById('audio-vol-slider');
      if (slider) slider.value = '75';
    }
    audioCtx.resume();
    if(ambientMaster) {
      ambientMaster.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientMaster.gain.linearRampToValueAtTime(_effectiveAmbientGain(), audioCtx.currentTime+1.2);
    }
    if (!bgmMaster) startPlanetariumBGM();
    else {
      bgmMaster.gain.cancelScheduledValues(audioCtx.currentTime);
      bgmMaster.gain.linearRampToValueAtTime(_effectiveBgmGain(), audioCtx.currentTime+1.2);
    }
  } else {
    if(ambientMaster) {
      ambientMaster.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientMaster.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.8);
    }
    stopPlanetariumBGM(0.8);
  }
  syncAudioBtn();
}
document.getElementById('audio-btn').addEventListener('click', toggleAudio);
(function _wireAudioSlider() {
  const slider = document.getElementById('audio-vol-slider');
  if (!slider) return;
  slider.addEventListener('input', (e) => {
    setMasterVolume(parseFloat(e.target.value) / 100);
  });
})();

// ─── GAMIFICATION ─────────────────────────────────────────────────────────────
let explorerScore = 0;
const visitedPlanets = new Set();
const completedQuizzes = new Set();
const unlockedAchievements = new Set();
let rocketFlightCount = 0;
let tourCompletedCount = 0;

const ACHIEVEMENTS = [
  // Exploration achievements — require at least 1 quiz first
  {id:'first_step',    name:'First Explorer', desc:'Visit a planet AND complete its quiz',      icon:'🚀', check:()=>visitedPlanets.size>=1 && completedQuizzes.size>=1},
  {id:'half_tour',     name:'Half Tour',      desc:'Visit 4 planets and complete their quizzes',icon:'🪐', check:()=>completedQuizzes.size>=4},
  {id:'grand_tour',    name:'Grand Tour',     desc:'Complete all 8 planet quizzes',             icon:'🏆', check:()=>completedQuizzes.size>=8},
  // Quiz achievements
  {id:'quiz_starter',  name:'Quiz Starter',   desc:'Complete your first planet quiz',           icon:'🧠', check:()=>completedQuizzes.size>=1},
  {id:'scholar',       name:'Solar Scholar',  desc:'Complete 4 planet quizzes',                 icon:'⭐', check:()=>completedQuizzes.size>=4},
  {id:'master_scholar',name:'Master Scholar', desc:'Ace all 8 planet quizzes',                  icon:'🌟', check:()=>completedQuizzes.size>=8},
  // Action achievements
  {id:'rocket_rider',  name:'Rocket Rider',   desc:'Complete a rocket flight',                  icon:'🔥', check:()=>rocketFlightCount>=1},
  {id:'tour_taker',    name:'Planetarium Pro',desc:'Complete the full guided solar tour',       icon:'🎬', check:()=>tourCompletedCount>=1},
];

function awardPoints(pts) {
  explorerScore += pts;
  const sv = document.getElementById('score-value');
  sv.textContent = explorerScore;
  sv.classList.remove('score-flash');
  void sv.offsetWidth;
  sv.classList.add('score-flash');
  const popup = document.getElementById('xp-popup');
  if(popup) {
    const sd = document.getElementById('score-display');
    if(sd) { const r=sd.getBoundingClientRect(); popup.style.left=Math.round(r.left+r.width/2)+'px'; popup.style.top=Math.round(r.top)+'px'; }
    popup.textContent = '+'+pts+' XP';
    popup.classList.remove('xp-popup-fly');
    void popup.offsetWidth;
    popup.classList.add('xp-popup-fly');
  }
  updatePlanetCounter();
  checkLevelUp();
}

function updatePlanetCounter() {
  const el = document.getElementById('planet-counter-value');
  // Cap at 8/8 (the 8 classical planets; Sun is routed via openSun and excluded).
  const count = Math.min(8, [...visitedPlanets].filter(id => id !== 'sun').length);
  if(el) el.textContent = count + '/8';
}
updatePlanetCounter();

// ─── EXPLORER LEVEL SYSTEM ───────────────────────────────────────────────────
const EXPLORER_LEVELS = [
  { name: 'CADET',      threshold:     0 },
  { name: 'NAVIGATOR',  threshold:   500 },
  { name: 'PILOT',      threshold:  1200 },
  { name: 'COMMANDER',  threshold:  2500 },
  { name: 'ADMIRAL',    threshold:  5000 },
  { name: 'STARFARER',  threshold:  9000 },
  { name: 'LEGEND',     threshold: 15000 },
];

let explorerLevel = 0;

function updateRankBadge(levelIndex) {
  const badge = document.getElementById('rank-name');
  if(badge) badge.textContent = EXPLORER_LEVELS[levelIndex].name;
}

function playLevelFanfare() {
  if(!audioCtx || !audioEnabled) return;
  const ctx = audioCtx;
  ctx.resume();
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99];
  const offsets = [0, 0.18, 0.36];
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.55, now + 0.04);
  master.gain.setValueAtTime(0.55, now + 0.7);
  master.gain.linearRampToValueAtTime(0, now + 1.05);
  master.connect(ctx.destination);
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now + offsets[i]);
    g.gain.setValueAtTime(0, now+offsets[i]); g.gain.linearRampToValueAtTime(0.7, now+offsets[i]+0.06);
    g.gain.setValueAtTime(0.7, now+offsets[i]+0.55); g.gain.linearRampToValueAtTime(0, now+offsets[i]+0.95);
    osc.connect(g); g.connect(master); osc.start(now+offsets[i]); osc.stop(now+offsets[i]+1.0);
    const osc2 = ctx.createOscillator(); const g2 = ctx.createGain();
    osc2.type = 'triangle'; osc2.frequency.setValueAtTime(freq*2, now+offsets[i]);
    g2.gain.setValueAtTime(0, now+offsets[i]); g2.gain.linearRampToValueAtTime(0.18, now+offsets[i]+0.06);
    g2.gain.linearRampToValueAtTime(0, now+offsets[i]+0.85);
    osc2.connect(g2); g2.connect(master); osc2.start(now+offsets[i]); osc2.stop(now+offsets[i]+0.9);
  });
}

function showLevelUpCard(rankName) {
  const card = document.getElementById('levelup-card');
  const rankEl = document.getElementById('levelup-rank');
  if(!card || !rankEl) return;
  rankEl.textContent = rankName;
  card.classList.remove('show'); void card.offsetWidth; card.classList.add('show');
}

function checkLevelUp() {
  let newLevel = 0;
  for(let i = EXPLORER_LEVELS.length - 1; i >= 0; i--) {
    if(explorerScore >= EXPLORER_LEVELS[i].threshold) { newLevel = i; break; }
  }
  if(newLevel > explorerLevel) {
    explorerLevel = newLevel;
    updateRankBadge(newLevel);
    showLevelUpCard(EXPLORER_LEVELS[newLevel].name);
    playLevelFanfare();
  }
}

(function initRankBadge() {
  const badge = document.getElementById('rank-name');
  if(badge) badge.textContent = EXPLORER_LEVELS[0].name;
})();

let _toastTimer = null;
function showToast(title, desc, icon='★', isAchievement=false) {
  const toast = document.getElementById('achievement-toast');
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-label').textContent = isAchievement ? 'Achievement Unlocked' : '— Notice —';
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-desc').textContent = desc;
  toast.classList.remove('show');
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  if(_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(()=>toast.classList.remove('show'), isAchievement ? 6000 : 3600);
}

function checkAchievements() {
  // Stagger the toasts. showToast drives a single shared #achievement-toast and
  // a single timer, and this loop unlocks synchronously — so simultaneous
  // unlocks all fired at the same +400ms and only the last was ever visible.
  // The thresholds are deliberately paired (quiz 1 unlocks first_step +
  // quiz_starter, quiz 4 unlocks half_tour + scholar, quiz 8 unlocks
  // grand_tour + master_scholar), so half the achievements showed no toast.
  let _queued = 0;
  ACHIEVEMENTS.forEach(ach => {
    if(!unlockedAchievements.has(ach.id) && ach.check()) {
      unlockedAchievements.add(ach.id);
      setTimeout(() => showToast(ach.name, ach.desc, ach.icon, true), 400 + (_queued++) * 6200);
      awardPoints(200);
    }
  });
}

function onPlanetVisit(id) {
  if(id === 'sun') {
    checkMissionComplete('planet_visited', {id:'sun'});
    return;
  }
  if(!visitedPlanets.has(id)) {
    visitedPlanets.add(id);
    awardPoints(50);
    triggerDiscovery(id);
    setTimeout(checkAchievements, 500);
  }
  checkMissionComplete('planet_visited', {id});
}

let _discHideTimer = null;
function triggerDiscovery(id) {
  const pdata = PLANETS.find(p=>p.id===id);
  if(!pdata) return;
  const ov = document.getElementById('discovery-overlay');
  const card = document.getElementById('discovery-card');
  if(!ov || !card) return;
  document.getElementById('disc-planet-name').textContent = pdata.name;
  document.getElementById('disc-tagline').textContent = pdata.tagline || '';
  // Scatter star particles
  ov.querySelectorAll('.disc-star').forEach(s=>s.remove());
  for(let i=0;i<8;i++){
    const s=document.createElement('div');
    s.className='disc-star';
    s.textContent=['★','✦','✧','⊹'][i%4];
    s.style.cssText=`left:${30+Math.random()*40}%;top:${20+Math.random()*60}%;animation-delay:${Math.random()*.4}s;color:rgba(0,255,120,.8)`;
    ov.appendChild(s);
  }
  ov.querySelectorAll('.disc-ring').forEach(r=>r.classList.remove('animate'));
  card.classList.remove('show','hide');
  void card.offsetWidth;
  card.classList.add('show');
  requestAnimationFrame(()=>ov.querySelectorAll('.disc-ring').forEach(r=>r.classList.add('animate')));
  // One shared #discovery-card, so an untracked timer from a previous discovery
  // would fire mid-display of the next one and yank it off screen early
  // (easy to hit with the planet-nav arrows, which can beat the 3.2s dwell).
  if(_discHideTimer) clearTimeout(_discHideTimer);
  _discHideTimer = setTimeout(()=>{
    _discHideTimer = null;
    card.classList.remove('show');
    card.classList.add('hide');
    setTimeout(()=>card.classList.remove('hide'),500);
  }, 3200);
}

// ─── ACHIEVEMENT PANEL ────────────────────────────────────────────────────────
function openAchievementPanel() {
  closeSideMenu();
  const list = document.getElementById('ach-list');
  document.getElementById('ach-score-val').textContent = explorerScore;
  list.innerHTML = '';
  ACHIEVEMENTS.forEach(ach => {
    const unlocked = unlockedAchievements.has(ach.id);
    const el = document.createElement('div');
    el.className = 'ach-item ' + (unlocked ? 'unlocked' : 'locked');
    el.innerHTML = `
      <div class="ach-icon">${unlocked ? ach.icon : '🔒'}</div>
      <div class="ach-info">
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
      </div>
      <div class="ach-badge ${unlocked?'unlocked':'locked'}">${unlocked?'EARNED':'LOCKED'}</div>`;
    list.appendChild(el);
  });
  closeAllPanels({keepTour:true});
  document.getElementById('achievement-panel').classList.add('open');
}

document.getElementById('ach-close').addEventListener('click', () => {
  document.getElementById('achievement-panel').classList.remove('open');
});
document.getElementById('achievement-panel').addEventListener('click', e => {
  if(e.target === document.getElementById('achievement-panel'))
    document.getElementById('achievement-panel').classList.remove('open');
});
document.getElementById('achievements-btn').addEventListener('click', openAchievementPanel);

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
const QUIZ = {
  sun:[
    {q:'How many planet Earths could fit inside the Sun?',opts:['About 1,000','About 13,000','About 1.3 million','About 1 billion'],ans:2},
    {q:'How long does sunlight take to reach Earth?',opts:['8 seconds','8 minutes','8 hours','8 days'],ans:1},
    {q:'The Sun contains what percentage of all the mass in our solar system?',opts:['50%','75%','90%','99.86%'],ans:3},
    {q:'What is the temperature at the Sun\'s core?',opts:['5,500°C','500,000°C','15 million°C','1 billion°C'],ans:2},
  ],
  mercury:[
    {q:'Which planet is actually the hottest in the Solar System?',opts:['Mercury','Venus','Mars','Jupiter'],ans:1},
    {q:'Mercury\'s iron core occupies what fraction of its radius?',opts:['25%','50%','85%','99%'],ans:2},
    {q:'Despite being close to the Sun, Mercury has ice — where?',opts:['Equatorial plains','Permanently shadowed craters','High-altitude clouds','Lava tubes'],ans:1},
  ],
  venus:[
    {q:'Venus\'s surface atmospheric pressure compared to Earth\'s is:',opts:['5×','30×','90×','250×'],ans:2},
    {q:'How does Venus rotate on its axis?',opts:['Same direction as Earth','Backwards (retrograde)','Sideways like Uranus','It is tidally locked'],ans:1},
    {q:'The thick clouds of Venus are mainly composed of:',opts:['Water vapor','Methane','Sulfuric acid','Carbon monoxide'],ans:2},
  ],
  earth:[
    {q:'What percentage of Earth\'s surface is covered by ocean?',opts:['50%','60%','71%','85%'],ans:2},
    {q:'Earth\'s atmosphere is primarily made of:',opts:['Oxygen (O₂)','Nitrogen (N₂)','Carbon dioxide (CO₂)','Argon (Ar)'],ans:1},
    {q:'Earth\'s magnetic field is generated by:',opts:['The Moon\'s gravity','Solar radiation','The liquid outer iron core','Tectonic movement'],ans:2},
  ],
  mars:[
    {q:'The tallest volcano in the Solar System is on Mars — its name?',opts:['Mauna Kea','Maat Mons','Olympus Mons','Maxwell Montes'],ans:2},
    {q:'How many moons does Mars have?',opts:['0','1','2','4'],ans:2},
    {q:'Mars\'s moon Phobos is spiraling inward and will eventually:',opts:['Escape to deep space','Crash or break apart into a ring','Stay in its current orbit','Merge with Deimos'],ans:1},
  ],
  jupiter:[
    {q:'Jupiter\'s Great Red Spot is:',opts:['A dormant super-volcano','A persistent anticyclonic storm','An ancient meteor impact','A polar magnetic vortex'],ans:1},
    {q:'Jupiter is primarily composed of:',opts:['Rock and iron','Water and silicates','Hydrogen and helium','Liquid carbon dioxide'],ans:2},
    {q:'Approximately how many moons does Jupiter have?',opts:['12','53','95+','Over 200'],ans:2},
  ],
  saturn:[
    {q:'Saturn\'s rings are primarily made of:',opts:['Fine rock dust','Ice and rock particles','Gaseous clouds','Metallic hydrogen'],ans:1},
    {q:'Which is Saturn\'s largest moon, with a thick nitrogen atmosphere?',opts:['Enceladus','Titan','Rhea','Tethys'],ans:1},
    {q:'Roughly how many moons does Saturn have (2024 count)?',opts:['18','53','82','146+'],ans:3},
  ],
  uranus:[
    {q:'Why does Uranus experience extreme 42-year-long seasons?',opts:['Its massive size','It rotates on its side (98° tilt)','It has almost no atmosphere','It\'s extremely far from the Sun'],ans:1},
    {q:'Uranus\'s distinctive blue-green color is caused by:',opts:['Water ice clouds','Ammonia crystals','Methane gas absorption','Sulfur dioxide haze'],ans:2},
    {q:'How many confirmed moons does Uranus have?',opts:['5','13','27','52'],ans:2},
  ],
  neptune:[
    {q:'Neptune\'s largest moon, which orbits backwards, is:',opts:['Proteus','Triton','Nereid','Despina'],ans:1},
    {q:'Wind speeds on Neptune can reach approximately:',opts:['200 km/h','600 km/h','2100 km/h','5800 km/h'],ans:2},
    {q:'Neptune was discovered in 1846 primarily through:',opts:['Direct telescope observation','Mathematical prediction from orbital data','A spacecraft flyby','Radio telescope signals'],ans:1},
  ],
  pluto:[
    {q:'What famous shape did the New Horizons spacecraft discover on Pluto\'s surface?',opts:['A giant smiley face','A bright nitrogen-ice heart (Tombaugh Regio)','A volcanic ring','A deep blue ocean'],ans:1},
    {q:'Which spacecraft made the first close-up flyby of Pluto in July 2015?',opts:['Voyager 1','Cassini','New Horizons','Juno'],ans:2},
    {q:'Pluto\'s largest moon Charon is so big compared to Pluto that they:',opts:['Crash into each other every century','Share the same atmosphere','Orbit a point in space between them like a binary pair','Spin in opposite directions'],ans:2},
    {q:'What are Pluto\'s towering 3,500-meter mountains made of?',opts:['Volcanic basalt','Rock-hard frozen water ice','Solid iron','Compressed dust'],ans:1},
  ],
};

let activeQuiz = null;
let quizStreak = 0;
let quizTimerId = null;

function showQuizFlash(correct) {
  const flash = document.getElementById('quiz-flash');
  flash.className = correct ? 'flash-correct' : 'flash-wrong';
  flash.textContent = correct ? '✓ CORRECT' : '✗ WRONG';
  flash.style.opacity = '1';
  flash.style.pointerEvents = 'none';
  setTimeout(() => { flash.style.opacity = '0'; }, 500);
}

window.launchQuiz = function(planetId) {
  playUIClick();
  const questions = QUIZ[planetId];
  if(!questions) return;
  if(quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; }
  quizStreak = 0;
  activeQuiz = {planetId, questions, current:0, score:0};
  const pdata = PLANETS.find(p=>p.id===planetId);
  document.getElementById('quiz-planet-name').textContent = pdata.name + ' — Knowledge Check';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-result').innerHTML = '';
  document.getElementById('quiz-next').style.display = 'none';
  renderQuizQuestion();
  closeAllPanels({keepTour:true});
  document.getElementById('quiz-modal').classList.add('open');
};

function renderQuizQuestion() {
  if(!activeQuiz) return;
  if(quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; }
  const {questions, current} = activeQuiz;
  const q = questions[current];
  document.getElementById('quiz-progress').textContent = `Question ${current+1} / ${questions.length}`;
  document.getElementById('quiz-question').textContent = q.q;
  const fb = document.getElementById('quiz-feedback');
  fb.textContent = ''; fb.className = 'quiz-feedback';
  const streakEl = document.getElementById('quiz-streak');
  if(quizStreak >= 2) {
    streakEl.textContent = `🔥 x${quizStreak} Streak!`;
    streakEl.style.display = 'block';
  } else {
    streakEl.style.display = 'none';
  }
  document.getElementById('quiz-next').style.display = 'none';
  const opts = document.getElementById('quiz-options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleQuizAnswer(i));
    opts.appendChild(btn);
  });
  const timerBar = document.getElementById('quiz-timer-bar');
  timerBar.style.transition = 'none';
  timerBar.style.width = '100%';
  void timerBar.offsetWidth;
  timerBar.style.transition = 'width 15s linear';
  timerBar.style.width = '0%';
  let elapsed = 0;
  quizTimerId = setInterval(() => {
    elapsed += 250;
    if(elapsed >= 15000) {
      clearInterval(quizTimerId); quizTimerId = null;
      if(activeQuiz && document.getElementById('quiz-options').querySelector('.quiz-option:not([disabled])')) {
        quizStreak = 0;
        document.getElementById('quiz-options').querySelectorAll('.quiz-option').forEach((btn, i) => {
          btn.disabled = true;
          if(i === q.ans) btn.classList.add('correct');
        });
        const fb2 = document.getElementById('quiz-feedback');
        fb2.textContent = '⏱ Time\'s up! — correct: ' + q.opts[q.ans];
        fb2.className = 'quiz-feedback wrong';
        document.getElementById('quiz-streak').style.display = 'none';
        showQuizFlash(false);
        playWrong();
        if(activeQuiz.current < questions.length - 1) {
          document.getElementById('quiz-next').style.display = 'block';
        } else {
          setTimeout(showQuizResult, 700);
        }
      }
    }
  }, 250);
}

function handleQuizAnswer(chosen) {
  if(!activeQuiz) return;
  if(quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; }
  const timerBar = document.getElementById('quiz-timer-bar');
  const computedWidth = timerBar.getBoundingClientRect().width;
  const parentWidth = timerBar.parentElement.getBoundingClientRect().width;
  timerBar.style.transition = 'none';
  timerBar.style.width = (parentWidth > 0 ? (computedWidth / parentWidth * 100) : 0) + '%';
  const {questions, current} = activeQuiz;
  const q = questions[current];
  const correct = chosen === q.ans;
  document.getElementById('quiz-options').querySelectorAll('.quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if(i === q.ans) btn.classList.add('correct');
    else if(i === chosen && !correct) btn.classList.add('wrong');
  });
  const fb = document.getElementById('quiz-feedback');
  if(correct) {
    quizStreak++;
    const multiplier = Math.min(quizStreak, 5);
    const pts = 100 * multiplier;
    activeQuiz.score++;
    // Track points actually awarded. The result card used to compute score*100,
    // which ignores the streak multiplier entirely — a 3/3 run awards
    // 100+200+300=600 but the card claimed "300 pts earned this round".
    activeQuiz.points = (activeQuiz.points || 0) + pts;
    fb.textContent = '✓ Correct! +' + pts + ' points' + (multiplier > 1 ? ' (x' + multiplier + ')' : '');
    fb.className = 'quiz-feedback correct';
    awardPoints(pts);
    playCorrect();
    showQuizFlash(true);
    const streakEl = document.getElementById('quiz-streak');
    if(quizStreak >= 2) { streakEl.textContent = `🔥 x${quizStreak} Streak!`; streakEl.style.display = 'block'; }
  } else {
    quizStreak = 0;
    fb.textContent = '✗ Incorrect — correct: ' + q.opts[q.ans];
    fb.className = 'quiz-feedback wrong';
    playWrong();
    showQuizFlash(false);
    document.getElementById('quiz-streak').style.display = 'none';
  }
  if(current < questions.length - 1) {
    document.getElementById('quiz-next').style.display = 'block';
  } else {
    setTimeout(showQuizResult, 700);
  }
}

document.getElementById('quiz-next').addEventListener('click', () => {
  playUIClick();
  activeQuiz.current++;
  renderQuizQuestion();
});

function showQuizResult() {
  if(!activeQuiz) return;
  const {planetId, score, questions} = activeQuiz;
  const earned = activeQuiz.points || 0;
  completedQuizzes.add(planetId);
  checkAchievements();
  checkMissionComplete('quiz_completed', {planetId});
  const pct = Math.round(score/questions.length*100);
  const grade = pct===100?'Perfect Score!':pct>=67?'Great Work!':pct>=33?'Keep Learning!':'Try Again!';
  document.getElementById('quiz-options').innerHTML = '';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-next').style.display = 'none';
  document.getElementById('quiz-progress').textContent = 'Complete!';
  document.getElementById('quiz-question').textContent = grade;
  const result = document.getElementById('quiz-result');
  result.innerHTML = `<div class="quiz-score-display">${score}<span style="font-size:24px;color:var(--dim)">/${questions.length}</span></div><div class="quiz-score-sub">${pct}% accuracy — ${earned} pts earned this round</div><button class="quiz-retry-btn" id="quiz-retry-btn">Retry Quiz ↺</button>`;
  result.style.display = 'block';
  document.getElementById('quiz-retry-btn').addEventListener('click', () => {
    playUIClick(); window.launchQuiz(planetId);
  });
  if(pct === 100) showToast('Perfect Score!', PLANETS.find(p=>p.id===planetId).name+' master!', '🏆');
  activeQuiz = null;
}

document.getElementById('quiz-close').addEventListener('click', () => {
  document.getElementById('quiz-modal').classList.remove('open');
  if(quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; }
  activeQuiz = null;
  quizStreak = 0;
  playUIClick();
});
document.getElementById('quiz-modal').addEventListener('click', e => {
  if(e.target === document.getElementById('quiz-modal')) {
    document.getElementById('quiz-modal').classList.remove('open');
    if(quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; }
    activeQuiz = null;
    quizStreak = 0;
  }
});

// ─── PLANET COMPARISON BAR ───────────────────────────────────────────────────
const PLANET_COLORS = {mercury:'#b5b5b5',venus:'#e8c97a',earth:'#4b9cd3',mars:'#c1440e',jupiter:'#c88940',saturn:'#e8d878',uranus:'#7de0e0',neptune:'#4b70dd',pluto:'#c4a882'};
const TRUE_SIZES = {mercury:0.38,venus:0.95,earth:1.0,mars:0.53,jupiter:11.2,saturn:9.45,uranus:4.0,neptune:3.88,pluto:0.19,sun:109};

function buildComparisonBar() {
  const bar = document.getElementById('comparison-bar');
  bar.innerHTML = '';
  const maxSize = 11.2; // Jupiter
  const scaleH = 80; // max height in px
  // Sun
  const sunEl = document.createElement('div');
  sunEl.className='cmp-item';
  const sunSphere=document.createElement('div');
  sunSphere.className='cmp-sphere';
  const sunPx=Math.round(TRUE_SIZES.sun/maxSize*scaleH*1.8);
  sunSphere.style.cssText=`width:${sunPx}px;height:${sunPx}px;background:radial-gradient(circle at 38% 32%,#fff8d0,#ffe040 40%,#ff8000 75%,#cc4000);box-shadow:0 0 ${sunPx/2}px rgba(255,180,0,.5)`;
  const sunLabel=document.createElement('div');
  sunLabel.className='cmp-label'; sunLabel.textContent='Sun';
  sunEl.appendChild(sunSphere); sunEl.appendChild(sunLabel);
  sunEl.addEventListener('click',()=>openSun());
  bar.appendChild(sunEl);

  // Skip the Sun — it is rendered by hand above. Including it here emitted a
  // second, grey (no PLANET_COLORS entry) 779px sphere inside an 80px bar.
  PLANETS.filter(p=>p.id!=='sun').forEach(p=>{
    const item=document.createElement('div'); item.className='cmp-item';
    const sphere=document.createElement('div'); sphere.className='cmp-sphere';
    const px=Math.max(4,Math.round(TRUE_SIZES[p.id]/maxSize*scaleH));
    sphere.style.cssText=`width:${px}px;height:${px}px;background:radial-gradient(circle at 38% 32%,${PLANET_COLORS[p.id]||'#888'},${PLANET_COLORS[p.id]||'#444'} 70%,#111);`;
    const lbl=document.createElement('div'); lbl.className='cmp-label'; lbl.textContent=p.name;
    item.appendChild(sphere); item.appendChild(lbl);
    item.addEventListener('click',()=>openPlanet(p.id,true));
    bar.appendChild(item);
  });
}
buildComparisonBar();

document.getElementById('comparison-toggle').addEventListener('click',()=>{
  const bar=document.getElementById('comparison-bar');
  const btn=document.getElementById('comparison-toggle');
  bar.classList.toggle('show'); btn.classList.toggle('active');
  closeSideMenu();
});

// ─── TRUE SCALE MODE ─────────────────────────────────────────────────────────
const NORMAL_SIZES = {};
const NORMAL_ORBITS = {};
const TRUE_ORBIT_SCALE = 6; // 1 AU = 6 scene units
const TRUE_AU = {mercury:0.39,venus:0.72,earth:1.0,mars:1.52,jupiter:5.2,saturn:9.58,uranus:19.2,neptune:30.05,pluto:39.5};
let trueScaleMode = false;

PLANETS.forEach(p=>{ NORMAL_SIZES[p.id]=p.size; NORMAL_ORBITS[p.id]=p.orbitRadius; });

let scaleOrbitRings = [];
function setScaleMode(trueScale) {
  trueScaleMode = trueScale;
  // TRUE_AU has no 'sun' key, so including the Sun here made orbitRadius NaN,
  // which produced an all-NaN orbit-ring geometry that the y≈0 cleanup filter
  // below could never match (Math.abs(NaN) < 0.01 is false) — so one broken
  // Line leaked into the scene on every toggle. It also scaled the Sun to
  // radius 54.5, swallowing the inner planets.
  PLANETS.filter(p=>p.id!=='sun').forEach(p=>{
    const pm=planetMeshes.find(x=>x.pdata.id===p.id);
    if(!pm) return;
    const newSize = trueScale ? TRUE_SIZES[p.id]*0.5 : NORMAL_SIZES[p.id];
    const newOrbit = trueScale ? TRUE_AU[p.id]*TRUE_ORBIT_SCALE : NORMAL_ORBITS[p.id];
    p.size = newSize;
    p.orbitRadius = newOrbit;
    const scaleFactor = newSize / NORMAL_SIZES[p.id];
    pm.mesh.scale.setScalar(scaleFactor);
  });
  // Remove old scale-generated orbit rings
  scaleOrbitRings.forEach(l=>scene.remove(l));
  scaleOrbitRings=[];
  // Remove initial orbit rings (they're Line objects at y=0)
  const toRemove=[];
  scene.children.forEach(c=>{if(c.isLine && c.geometry && c.geometry.attributes.position){
    const y=c.geometry.attributes.position.getY(0);
    if(Math.abs(y)<0.01) toRemove.push(c);
  }});
  toRemove.forEach(c=>scene.remove(c));
  // Recreate orbit rings for new radii (Sun excluded — it has no orbit)
  PLANETS.filter(p=>p.id!=='sun').forEach(p=>{
    const ring=createOrbitRing(p.orbitRadius);
    scene.add(ring);
    scaleOrbitRings.push(ring);
  });
}

document.getElementById('scale-toggle').addEventListener('click',()=>{
  trueScaleMode=!trueScaleMode;
  document.getElementById('scale-toggle').classList.toggle('active',trueScaleMode);
  const st=document.getElementById('scale-toggle');
  st.innerHTML=trueScaleMode
    ?'&#9668; Artist View<span class="smenu-hint">Back to artistic distances</span>'
    :'&#9654; True Scale Mode<span class="smenu-hint">Real AU orbital distances</span>';
  setScaleMode(trueScaleMode);
  if(trueScaleMode){
    animateCameraTo({x:0,y:80,z:160},{x:0,y:0,z:0});
  } else {
    animateCameraTo({x:0,y:28,z:55},{x:0,y:0,z:0});
  }
});

document.getElementById('gravity-toggle').addEventListener('click', () => toggleGravityWell(true));
document.getElementById('gravity-hud-btn').addEventListener('click', () => toggleGravityWell(false));

// ─── SIDE MENU ───────────────────────────────────────────────────────────────
function openSideMenu() {
  document.getElementById('side-menu').classList.add('open');
  document.getElementById('side-menu-overlay').classList.add('show');
}
function closeSideMenu() {
  document.getElementById('side-menu').classList.remove('open');
  document.getElementById('side-menu-overlay').classList.remove('show');
}
document.getElementById('menu-btn').addEventListener('click', openSideMenu);
document.getElementById('side-menu-close').addEventListener('click', closeSideMenu);
document.getElementById('side-menu-overlay').addEventListener('click', closeSideMenu);
document.getElementById('explore-launcher').addEventListener('click', openSideMenu);

// ─── PANEL MANAGEMENT ────────────────────────────────────────────────────────
// ESC closes any open panel
document.addEventListener('keydown', e => {
  if(e.key !== 'Escape') return;
  if(document.getElementById('tour-lightbox').classList.contains('show')) {
    document.getElementById('tour-lightbox').classList.remove('show'); return;
  }
  if(document.getElementById('hint-overlay').classList.contains('show')) {
    document.getElementById('hint-skip').click(); return;
  }
  if(document.getElementById('quiz-modal').classList.contains('open')) {
    document.getElementById('quiz-modal').classList.remove('open');
    if(quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; }
    activeQuiz = null;
    quizStreak = 0;
    return;
  }
  if(document.getElementById('moon-detail').classList.contains('open')) {
    document.getElementById('moon-detail').classList.remove('open'); return;
  }
  if(document.getElementById('achievement-panel').classList.contains('open')) {
    document.getElementById('achievement-panel').classList.remove('open'); return;
  }
  if(document.getElementById('mission-panel').classList.contains('open')) {
    closeMissionPanel(); return;
  }
  if(document.getElementById('rocket-launchpad').classList.contains('open')) {
    closeRocketLaunchpad(); return;
  }
  if(document.getElementById('side-menu').classList.contains('open')) {
    closeSideMenu(); return;
  }
  if(document.getElementById('info-panel').classList.contains('open')) {
    closePanel();
    animateCameraTo({x:0,y:28,z:55},{x:0,y:0,z:0});
    currentPlanet=null;
    document.getElementById('location-label').textContent='Overview';
    pushHistory({type:'overview'});
  }
});

// Canvas click closes panels (but not during tour or rocket flight)
renderer.domElement.addEventListener('click', () => {
  if(rocketFlight) return;
  if(document.getElementById('apollo-popup').classList.contains('show')) return;
}, false);

// First-visit menu hint — pulse the menu button 3 times on first load
setTimeout(() => {
  const mb = document.getElementById('menu-btn');
  mb.classList.add('first-visit');
  mb.addEventListener('animationend', () => mb.classList.remove('first-visit'), {once:true});
}, 3500);

// ─── APOLLO SITE CLICK HANDLER ───────────────────────────────────────────────
(function(){
  const popup=document.getElementById('apollo-popup');
  renderer.domElement.addEventListener('click',e=>{
    if(popup.classList.contains('show')) {
      popup.classList.remove('show'); return;
    }
    // Check apollo markers
    mouse.x=(e.clientX/window.innerWidth)*2-1;
    mouse.y=-(e.clientY/window.innerHeight)*2+1;
    raycaster.setFromCamera(mouse,camera);
    const ee=planetMeshes.find(p=>p.pdata.id==='earth');
    if(!ee) return;
    const moonPivot=ee.group.children.find(c=>c.userData.moonSpeed);
    if(!moonPivot||!moonPivot.children[0]) return;
    const moonMesh=moonPivot.children[0];
    const markers=moonMesh.children.filter(c=>c.userData.apolloSite);
    const hits=raycaster.intersectObjects(markers);
    if(hits.length>0){
      const site=hits[0].object.userData.apolloSite;
      document.getElementById('apollo-title').textContent=`${site.name} (${site.year})`;
      document.getElementById('apollo-crew').textContent=`Crew: ${site.crew}`;
      document.getElementById('apollo-desc').textContent=site.desc;
      popup.style.left=(e.clientX+16)+'px';
      popup.style.top=Math.min(e.clientY-20, window.innerHeight-160)+'px';
      popup.classList.add('show');
    }
  },true);
})();

// ─── PLANET NAV BAR ──────────────────────────────────────────────────────────
// Only include celestial bodies (not mission probes from PLANETS array)
const PLANET_ORDER = ['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','pluto'];
const PLANET_LABELS = {sun:'The Sun ☀', mercury:'Mercury', venus:'Venus', earth:'Earth', mars:'Mars', jupiter:'Jupiter', saturn:'Saturn', uranus:'Uranus', neptune:'Neptune', pluto:'Pluto'};
let pnavIdx = 0;

function updatePnavLabel() {
  const id = PLANET_ORDER[pnavIdx];
  document.getElementById('pnav-label').textContent = PLANET_LABELS[id] || id;
  document.getElementById('pnav-prev').style.opacity = '1';
  document.getElementById('pnav-next').style.opacity = '1';
}

// Circular nav — wrap around at both ends
document.getElementById('pnav-prev').addEventListener('click', () => {
  pnavIdx = (pnavIdx - 1 + PLANET_ORDER.length) % PLANET_ORDER.length;
  navigatePlanetNav();
});
document.getElementById('pnav-next').addEventListener('click', () => {
  pnavIdx = (pnavIdx + 1) % PLANET_ORDER.length;
  navigatePlanetNav();
});

function navigatePlanetNav() {
  updatePnavLabel();
  const id = PLANET_ORDER[pnavIdx];
  if(id === 'sun') {
    openSun();
  } else {
    openPlanet(id);
  }
}

// Sync pnavIdx when a planet is opened by click
function syncPnavIdx(id) {
  const idx = PLANET_ORDER.indexOf(id);
  if(idx >= 0) { pnavIdx = idx; updatePnavLabel(); triggerNavPing(); }
}

// ─── PROCEDURAL MISSION ART & SCHEMATIC GENERATOR ────────────────────────────
const _missionArtCache = {};
const MISSION_ART_SPECS = {
  'photos/missions/iss/exterior.jpg': {
    tag:'ISS // LEO 408 KM', title:'INTERNATIONAL SPACE STATION', accent:'#44ccff',
    art:`<path d="M0 360 Q400 280 800 370 L800 450 L0 450 Z" fill="#062858" opacity="0.8"/>
      <path d="M0 360 Q400 280 800 370" fill="none" stroke="#44ccff" stroke-width="4" opacity="0.7"/>
      <line x1="120" y1="205" x2="680" y2="205" stroke="#99bbdd" stroke-width="8"/>
      <rect x="330" y="188" width="140" height="34" rx="8" fill="#d8e8f8" stroke="#44ccff" stroke-width="2"/>
      <rect x="380" y="155" width="40" height="100" rx="6" fill="#bfd6ec" stroke="#44ccff" stroke-width="2"/>
      ${[145,185,240,280,520,560,615,655].map(x=>`<rect x="${x-14}" y="82" width="28" height="108" fill="#c88a28" stroke="#ffd27a" stroke-width="1.5"/><rect x="${x-14}" y="220" width="28" height="108" fill="#c88a28" stroke="#ffd27a" stroke-width="1.5"/>`).join('')}`
  },
  'photos/missions/iss/earth_view.jpg': {
    tag:'ISS // ORBITAL HORIZON', title:'EARTH LIMB & AURORA', accent:'#00e890',
    art:`<defs><radialGradient id="eg" cx="50%" cy="110%" r="85%"><stop offset="0%" stop-color="#1d78d8"/><stop offset="68%" stop-color="#08285c"/><stop offset="100%" stop-color="#000412"/></radialGradient></defs>
      <circle cx="400" cy="540" r="360" fill="url(#eg)" stroke="#55ccff" stroke-width="4"/>
      <path d="M90 250 Q260 175 430 220 T720 195" fill="none" stroke="#00ff99" stroke-width="18" opacity="0.38" stroke-linecap="round"/>
      <path d="M120 235 Q280 160 450 205 T700 180" fill="none" stroke="#66ffcc" stroke-width="7" opacity="0.65" stroke-linecap="round"/>
      <polygon points="0,40 190,115 175,145 0,75" fill="#1a2c44" stroke="#44ccff" stroke-width="2"/>`
  },
  'photos/missions/iss/cupola.jpg': {
    tag:'ISS // NODE-3 CUPOLA', title:'CUPOLA OBSERVATION DOME', accent:'#66ddff',
    art:`<circle cx="400" cy="225" r="165" fill="#0b4a8c" stroke="#304860" stroke-width="18"/>
      <path d="M265 180 Q360 120 480 175 T550 265" fill="none" stroke="#ffffff" stroke-width="22" opacity="0.35" stroke-linecap="round"/>
      <circle cx="400" cy="225" r="72" fill="none" stroke="#182638" stroke-width="14"/>
      ${[0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180;return `<line x1="${400+Math.cos(r)*72}" y1="${225+Math.sin(r)*72}" x2="${400+Math.cos(r)*165}" y2="${225+Math.sin(r)*165}" stroke="#182638" stroke-width="12"/>`;}).join('')}
      <circle cx="400" cy="225" r="72" fill="none" stroke="#44ccff" stroke-width="2"/>`
  },
  'photos/missions/hubble/telescope.jpg': {
    tag:'HST // 547 KM ORBIT', title:'HUBBLE SPACE TELESCOPE', accent:'#88ccff',
    art:`<g transform="translate(400,215) rotate(-18)">
      <rect x="-25" y="-140" width="50" height="95" fill="#cc8a28" stroke="#ffd480" stroke-width="2"/>
      <rect x="-25" y="45" width="50" height="95" fill="#cc8a28" stroke="#ffd480" stroke-width="2"/>
      <rect x="-95" y="-42" width="190" height="84" rx="10" fill="#cfdce8" stroke="#66bbff" stroke-width="2.5"/>
      <rect x="-135" y="-32" width="45" height="64" rx="4" fill="#99b2c8" stroke="#66bbff" stroke-width="2"/>
      <polygon points="95,-42 145,-72 135,-30" fill="#dce8f5" stroke="#66bbff" stroke-width="2"/>
      <ellipse cx="95" cy="0" rx="10" ry="36" fill="#08182e" stroke="#44ccff" stroke-width="2"/>
    </g>`
  },
  'photos/missions/hubble/deep_field.jpg': {
    tag:'HST // ULTRA DEEP FIELD', title:'10,000 ANCIENT GALAXIES', accent:'#bb88ff',
    art:`${[[160,130,36,16,25,'#ffcc66'],[580,145,44,18,-30,'#77ccff'],[390,215,52,24,15,'#ff88cc'],[230,295,32,15,-40,'#99eeff'],[610,290,38,16,35,'#ffd888'],[470,120,24,12,-15,'#bb99ff'],[290,175,26,26,0,'#ffaa55'],[510,260,28,14,50,'#88ffcc']].map(([x,y,rx,ry,rot,c])=>`<g transform="translate(${x},${y}) rotate(${rot})"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${c}" opacity="0.35"/><ellipse cx="0" cy="0" rx="${rx*0.45}" ry="${ry*0.45}" fill="#fff" opacity="0.85"/></g>`).join('')}`
  },
  'photos/missions/hubble/nebula.jpg': {
    tag:'HST // M16 EAGLE NEBULA', title:'PILLARS OF CREATION', accent:'#ffaa55',
    art:`<path d="M180 390 L230 130 Q255 95 280 135 L310 390 Z" fill="#6e3a1e" opacity="0.82" stroke="#ffbb66" stroke-width="2"/>
      <path d="M340 390 L385 165 Q410 135 430 170 L455 390 Z" fill="#582c18" opacity="0.82" stroke="#ff9955" stroke-width="2"/>
      <path d="M485 390 L520 215 Q540 190 558 220 L580 390 Z" fill="#462214" opacity="0.8" stroke="#ff8844" stroke-width="1.5"/>
      <circle cx="255" cy="115" r="8" fill="#fff"/><circle cx="408" cy="150" r="7" fill="#aeeeff"/><circle cx="538" cy="204" r="6" fill="#ffd888"/>`
  },
  'photos/missions/jwst/telescope.jpg': {
    tag:'JWST // L2 LAGRANGE POINT', title:'18-SEGMENT GOLD MIRROR ARRAY', accent:'#ffd24d',
    art:`<polygon points="150,295 400,355 650,295 570,225 230,225" fill="#8866aa" opacity="0.45" stroke="#ccaaff" stroke-width="2"/>
      <polygon points="175,280 400,335 625,280 555,218 245,218" fill="#aa88cc" opacity="0.45" stroke="#eeddff" stroke-width="1.5"/>
      ${[[0,-64],[-55,-32],[55,-32],[-55,32],[0,64],[55,32],[0,0]].map(([dx,dy])=>`<polygon points="${400+dx},${165+dy-30} ${400+dx+26},${165+dy-15} ${400+dx+26},${165+dy+15} ${400+dx},${165+dy+30} ${400+dx-26},${165+dy+15} ${400+dx-26},${165+dy-15}" fill="#e8b428" stroke="#fff2a8" stroke-width="2"/>`).join('')}`
  },
  'photos/missions/jwst/deep_field.jpg': {
    tag:'JWST // SMACS 0723', title:'GRAVITATIONAL LENSING DEEP FIELD', accent:'#ffbb44',
    art:`<circle cx="400" cy="215" r="45" fill="#fff4d0" opacity="0.28"/>
      <path d="M290 155 A135 135 0 0 1 485 115" fill="none" stroke="#ff8844" stroke-width="5" stroke-linecap="round"/>
      <path d="M515 265 A135 135 0 0 1 325 320" fill="none" stroke="#ffaa55" stroke-width="5" stroke-linecap="round"/>
      <path d="M265 245 A145 145 0 0 1 285 165" fill="none" stroke="#66ccff" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(400,215)"><line x1="-70" y1="0" x2="70" y2="0" stroke="#ffd878" stroke-width="2"/><line x1="-38" y1="-64" x2="38" y2="64" stroke="#ffd878" stroke-width="2"/><line x1="-38" y1="64" x2="38" y2="-64" stroke="#ffd878" stroke-width="2"/><circle cx="0" cy="0" r="10" fill="#fff"/></g>`
  },
  'photos/missions/jwst/carina.jpg': {
    tag:'JWST // NGC 3324 NIRCAM', title:'COSMIC CLIFFS — CARINA NEBULA', accent:'#ff9944',
    art:`<path d="M0 250 Q140 210 260 245 T510 195 T800 230 L800 450 L0 450 Z" fill="#7a2e14" opacity="0.85" stroke="#ffaa55" stroke-width="3"/>
      <path d="M0 250 Q140 210 260 245 T510 195 T800 230" fill="none" stroke="#ffdd99" stroke-width="5" opacity="0.6"/>
      <g transform="translate(260,125)"><line x1="-38" y1="0" x2="38" y2="0" stroke="#aeeeff" stroke-width="2"/><line x1="-20" y1="-34" x2="20" y2="34" stroke="#aeeeff" stroke-width="2"/><line x1="-20" y1="34" x2="20" y2="-34" stroke="#aeeeff" stroke-width="2"/><circle cx="0" cy="0" r="6" fill="#fff"/></g>`
  },
  'photos/missions/voyager/pale_blue_dot.jpg': {
    tag:'VOYAGER 1 // 6.0 BILLION KM', title:'PALE BLUE DOT — FEB 14, 1990', accent:'#66d4ff',
    art:`<polygon points="460,0 560,0 360,450 260,450" fill="#ffbb77" opacity="0.16"/>
      <polygon points="520,0 570,0 370,450 320,450" fill="#88ddff" opacity="0.22"/>
      <circle cx="435" cy="215" r="22" fill="none" stroke="#66d4ff" stroke-width="1.5" stroke-dasharray="5 4"/>
      <circle cx="435" cy="215" r="4" fill="#99eeff"/>
      <text x="468" y="220" fill="#88eeff" font-family="Orbitron,sans-serif" font-size="13" letter-spacing="2">EARTH (0.12 PX)</text>`
  },
  'photos/missions/voyager/jupiter.jpg': {
    tag:'VOYAGER 1 // JUPITER APPROACH', title:'GREAT RED SPOT — TURBULENT VORTEX', accent:'#ff9944',
    art:`<rect x="60" y="75" width="680" height="280" rx="18" fill="#b87432"/>
      <rect x="60" y="105" width="680" height="42" fill="#e6c48a"/>
      <rect x="60" y="185" width="680" height="58" fill="#964618"/>
      <rect x="60" y="275" width="680" height="38" fill="#dfb878"/>
      <ellipse cx="450" cy="215" rx="95" ry="52" fill="#cc3314" stroke="#ffaa77" stroke-width="4"/>
      <ellipse cx="450" cy="215" rx="58" ry="30" fill="none" stroke="#ffddaa" stroke-width="2" stroke-dasharray="10 6"/>`
  },
  'photos/missions/voyager/golden_record.jpg': {
    tag:'VOYAGER 1 & 2 // INTERSTELLAR PLAQUE', title:'THE GOLDEN RECORD', accent:'#ffd24d',
    art:`<circle cx="400" cy="215" r="145" fill="#c8961e" stroke="#ffea88" stroke-width="4"/>
      <circle cx="400" cy="215" r="115" fill="none" stroke="#ffea88" stroke-width="1" opacity="0.5"/>
      <circle cx="400" cy="215" r="42" fill="#8a620c" stroke="#ffea88" stroke-width="2"/>
      ${[0,25,55,82,115,148,175,210,245,280,315,340].map(a=>{const r=a*Math.PI/180;return `<line x1="330" y1="250" x2="${330+Math.cos(r)*68}" y2="${250+Math.sin(r)*68}" stroke="#fff4b8" stroke-width="1.8"/>`;}).join('')}
      <circle cx="465" cy="150" r="20" fill="none" stroke="#fff4b8" stroke-width="2"/><circle cx="515" cy="150" r="20" fill="none" stroke="#fff4b8" stroke-width="2"/><line x1="485" y1="150" x2="495" y2="150" stroke="#fff4b8" stroke-width="2"/>`
  },
  'photos/missions/perseverance/rover.jpg': {
    tag:'MARS 2020 // JEZERO CRATER', title:'PERSEVERANCE ROVER & SUPERCAM', accent:'#ff7744',
    art:`<path d="M0 300 Q240 265 520 295 T800 275 L800 450 L0 450 Z" fill="#7c2810"/>
      <rect x="250" y="210" width="160" height="52" rx="8" fill="#d8e0e8" stroke="#ff8844" stroke-width="2.5"/>
      <rect x="370" y="135" width="14" height="78" fill="#b8c4d0"/>
      <rect x="352" y="118" width="52" height="28" rx="5" fill="#e8f0f8" stroke="#ff8844" stroke-width="2"/>
      <line x1="404" y1="132" x2="620" y2="310" stroke="#ff2222" stroke-width="3" stroke-dasharray="8 4"/>
      <circle cx="620" cy="310" r="14" fill="#ffaa33" opacity="0.8"/>
      ${[265,330,395].map(x=>`<circle cx="${x}" cy="292" r="24" fill="#222a34" stroke="#99aabb" stroke-width="4"/>`).join('')}`
  },
  'photos/missions/perseverance/ingenuity.jpg': {
    tag:'MARS HELICOPTER // 72 FLIGHTS', title:'INGENUITY ROTORCRAFT IN FLIGHT', accent:'#ff9966',
    art:`<path d="M0 330 Q380 295 800 335 L800 450 L0 450 Z" fill="#6e220c"/>
      <ellipse cx="400" cy="355" rx="55" ry="12" fill="#000" opacity="0.45"/>
      <rect x="374" y="175" width="52" height="48" rx="6" fill="#d8c090" stroke="#ffbb66" stroke-width="2"/>
      <line x1="400" y1="125" x2="400" y2="175" stroke="#ccd8e8" stroke-width="6"/>
      <ellipse cx="400" cy="140" rx="145" ry="10" fill="#88ccff" opacity="0.45" stroke="#bfe8ff" stroke-width="2"/>
      <ellipse cx="400" cy="156" rx="145" ry="10" fill="#88ccff" opacity="0.45" stroke="#bfe8ff" stroke-width="2"/>
      <line x1="380" y1="223" x2="335" y2="285" stroke="#ccd8e8" stroke-width="3"/><line x1="420" y1="223" x2="465" y2="285" stroke="#ccd8e8" stroke-width="3"/>`
  },
  'photos/missions/perseverance/surface.jpg': {
    tag:'MASTCAM-Z // JEZERO DELTA', title:'ANCIENT RIVER DELTA STRATA', accent:'#ff8855',
    art:`<path d="M0 215 L180 155 L390 175 L590 140 L800 190 L800 450 L0 450 Z" fill="#8c3214"/>
      <path d="M0 275 Q300 245 800 285 L800 450 L0 450 Z" fill="#64200a"/>
      <path d="M240 450 L365 280 M520 450 L435 280" stroke="#c86438" stroke-width="6" stroke-dasharray="10 8"/>`
  },
  'photos/missions/juno/spacecraft.jpg': {
    tag:'JUNO // POLAR ORBITER', title:'JUNO SOLAR ARRAY SPACECRAFT', accent:'#ffcc44',
    art:`<circle cx="620" cy="340" r="210" fill="#c88238" opacity="0.85"/>
      <g transform="translate(330,205)">
        ${[0,120,240].map(a=>`<g transform="rotate(${a})"><rect x="28" y="-16" width="155" height="32" fill="#1c4d8c" stroke="#ffcc44" stroke-width="2"/></g>`).join('')}
        <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="#e8d4a0" stroke="#ffcc44" stroke-width="2.5"/>
      </g>`
  },
  'photos/missions/juno/jupiter_cloud.jpg': {
    tag:'JUNOCAM // NORTH POLAR CYCLONES', title:'JUPITER CIRCUMPOLAR VORTICES', accent:'#55ccff',
    art:`<circle cx="400" cy="215" r="155" fill="#1b4d7e" stroke="#66ccff" stroke-width="3"/>
      <circle cx="400" cy="215" r="42" fill="#e89448" stroke="#fff0c0" stroke-width="3"/>
      ${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<circle cx="${400+Math.cos(r)*95}" cy="${215+Math.sin(r)*95}" r="26" fill="#d87834" stroke="#ffdd99" stroke-width="2"/>`;}).join('')}`
  },
  'photos/missions/juno/great_red_spot.jpg': {
    tag:'JUNOCAM // PERIJOVE PASS', title:'GREAT RED SPOT ANTICYCLONE', accent:'#ff7744',
    art:`<ellipse cx="400" cy="215" rx="220" ry="115" fill="#b83214" stroke="#ff9966" stroke-width="4"/>
      <ellipse cx="400" cy="215" rx="155" ry="78" fill="#d84820" stroke="#ffbb88" stroke-width="2.5" stroke-dasharray="18 8"/>
      <ellipse cx="400" cy="215" rx="85" ry="42" fill="#8f1e08" stroke="#ffd8b0" stroke-width="2"/>`
  },
  'photos/missions/new_horizons/pluto.jpg': {
    tag:'NEW HORIZONS // JULY 14, 2015', title:'PLUTO FLYBY ENCOUNTER', accent:'#c4a882',
    art:`<circle cx="400" cy="215" r="140" fill="#a68868" stroke="#e8d4b8" stroke-width="3"/>
      <path d="M395 215 C395 185 350 180 355 218 C360 250 398 272 415 288 C432 272 468 250 472 218 C476 180 432 185 415 215 Z" fill="#efe8d8" opacity="0.9"/>`
  },
  'photos/missions/new_horizons/heart.jpg': {
    tag:'LORRI + RALPH // TOMBAUGH REGIO', title:'SPUTNIK PLANITIA NITROGEN HEART', accent:'#f0e6d2',
    art:`<rect x="80" y="70" width="640" height="290" rx="16" fill="#5e321e"/>
      <path d="M390 190 C390 130 285 120 295 200 C305 268 395 310 420 335 C445 310 530 268 540 200 C550 120 445 130 420 190 Z" fill="#f2ece0" stroke="#ffffff" stroke-width="3"/>`
  },
  'photos/missions/new_horizons/charon.jpg': {
    tag:'NEW HORIZONS // BINARY SYSTEM', title:'PLUTO & CHARON BARYCENTER', accent:'#99bbff',
    art:`<circle cx="270" cy="215" r="88" fill="#b89878" stroke="#ead8c0" stroke-width="2.5"/>
      <circle cx="555" cy="215" r="48" fill="#88909a" stroke="#ccd4e0" stroke-width="2"/>
      <path d="M515 190 A48 48 0 0 1 595 190" fill="#8a3828"/>
      <circle cx="385" cy="215" r="10" fill="none" stroke="#00d4ff" stroke-width="2"/><line x1="370" y1="215" x2="400" y2="215" stroke="#00d4ff" stroke-width="2"/><line x1="385" y1="200" x2="385" y2="230" stroke="#00d4ff" stroke-width="2"/>`
  },
  'photos/missions/cassini/rings.jpg': {
    tag:'CASSINI ISS // BACKLIT RINGS', title:'SATURN RING PLANE & CASSINI DIVISION', accent:'#ebd288',
    art:`<ellipse cx="400" cy="215" rx="310" ry="78" fill="none" stroke="#e8d088" stroke-width="26" opacity="0.82"/>
      <ellipse cx="400" cy="215" rx="245" ry="60" fill="none" stroke="#040814" stroke-width="8"/>
      <ellipse cx="400" cy="215" rx="195" ry="46" fill="none" stroke="#cbb068" stroke-width="16" opacity="0.7"/>
      <circle cx="400" cy="215" r="88" fill="#18140c" stroke="#ffe499" stroke-width="3"/>`
  },
  'photos/missions/cassini/enceladus.jpg': {
    tag:'CASSINI // SOUTH POLAR PLUMES', title:'ENCELADUS CRYO-VOLCANIC GEYSERS', accent:'#88eeff',
    art:`<circle cx="400" cy="165" r="88" fill="#e6f4ff" stroke="#88ddff" stroke-width="3"/>
      <path d="M365 248 L330 385 M388 252 L375 395 M412 252 L425 395 M435 248 L470 385" stroke="#99eeff" stroke-width="14" opacity="0.55" stroke-linecap="round"/>`
  },
  'photos/missions/cassini/saturn.jpg': {
    tag:'CASSINI // GRAND FINALE 2017', title:'RING-GRAZING ORBITAL DIVE', accent:'#f0c868',
    art:`<circle cx="220" cy="260" r="180" fill="#d8bc70" stroke="#ffe89e" stroke-width="3"/>
      <path d="M360 60 Q450 220 520 390" fill="none" stroke="#e8d498" stroke-width="38" opacity="0.55"/>
      <circle cx="475" cy="185" r="24" fill="#d8e4f0" stroke="#00d4ff" stroke-width="2.5"/>`
  },
  'photos/missions/sun/corona.jpg': {
    tag:'SDO / AIA 171 Å // SOLAR CORONA', title:'MAGNETIC CORONAL LOOPS', accent:'#ffaa22',
    art:`<circle cx="400" cy="215" r="115" fill="#ff9900" stroke="#ffee77" stroke-width="4"/>
      <path d="M300 155 C210 90 210 290 305 265" fill="none" stroke="#ffdd55" stroke-width="6"/>
      <path d="M495 155 C590 90 590 290 495 265" fill="none" stroke="#ffdd55" stroke-width="6"/>`
  },
  'photos/missions/sun/parker.jpg': {
    tag:'PARKER SOLAR PROBE // 690,000 KM/H', title:'TOUCHING THE SOLAR CORONA', accent:'#ffcc44',
    art:`<circle cx="160" cy="215" r="145" fill="#ff7700" stroke="#ffdd66" stroke-width="4"/>
      <polygon points="480,165 545,215 480,265" fill="#e8f0f8" stroke="#ffcc44" stroke-width="3"/>
      <line x1="480" y1="145" x2="480" y2="285" stroke="#00d4ff" stroke-width="6"/>`
  },
  'photos/missions/mercury/caloris.jpg': {
    tag:'MESSENGER // CALORIS BASIN', title:'1,550 KM IMPACT BASIN', accent:'#cccccc',
    art:`<circle cx="400" cy="215" r="135" fill="#8c8882" stroke="#d0ccc4" stroke-width="3"/>
      <circle cx="370" cy="195" r="65" fill="none" stroke="#e0d8c8" stroke-width="4" stroke-dasharray="12 6"/>
      <circle cx="370" cy="195" r="38" fill="none" stroke="#c8c0b0" stroke-width="2"/>`
  },
  'photos/missions/mercury/messenger.jpg': {
    tag:'MESSENGER // POLAR RADAR', title:'SHADOWED POLAR CRATER ICE', accent:'#66ddff',
    art:`<circle cx="400" cy="215" r="130" fill="#706c68" stroke="#b8b4ae" stroke-width="3"/>
      <ellipse cx="400" cy="105" rx="58" ry="22" fill="#00d4ff" opacity="0.75" stroke="#ffffff" stroke-width="2"/>`
  },
  'photos/missions/venus/magellan.jpg': {
    tag:'MAGELLAN // SAR RADAR', title:'MAAT MONS VOLCANIC SHIELD', accent:'#ffaa33',
    art:`<path d="M80 335 L335 150 L400 175 L465 145 L720 335 Z" fill="#b86218" stroke="#ffcc55" stroke-width="3"/>
      <path d="M375 162 Q400 245 520 335" fill="none" stroke="#ffdd66" stroke-width="8"/>`
  },
  'photos/missions/venus/venera.jpg': {
    tag:'VENERA 13 // SURFACE LANDER', title:'BASALT SLABS AT 465°C / 92 ATM', accent:'#ffbb44',
    art:`<rect x="60" y="75" width="680" height="165" fill="#d88a24" opacity="0.7"/>
      <path d="M60 240 L740 240 L740 365 L60 365 Z" fill="#5c3412"/>
      <polygon points="330,260 470,260 510,335 290,335" fill="#9a8878" stroke="#ffcc66" stroke-width="2"/>`
  },
  'photos/missions/earth/apollo.jpg': {
    tag:'APOLLO 11 // MARE TRANQUILLITATIS', title:'EARTHRISE OVER LUNAR HORIZON', accent:'#44aaff',
    art:`<path d="M0 310 Q400 265 800 315 L800 450 L0 450 Z" fill="#7a7a80" stroke="#bcbcc4" stroke-width="2"/>
      <circle cx="400" cy="170" r="68" fill="#1e78d8" stroke="#88ddff" stroke-width="3"/>
      <path d="M360 150 Q405 130 435 165 T390 210" fill="#44aa55" opacity="0.85"/>`
  },
  'photos/missions/uranus/voyager2.jpg': {
    tag:'VOYAGER 2 // JAN 24, 1986', title:'CRESCENT URANUS & VERTICAL RINGS', accent:'#7de8e8',
    art:`<ellipse cx="400" cy="215" rx="52" ry="165" fill="none" stroke="#7de8e8" stroke-width="4" opacity="0.65"/>
      <circle cx="400" cy="215" r="88" fill="#58c8d0" stroke="#aef8f8" stroke-width="3"/>`
  },
  'photos/missions/uranus/miranda.jpg': {
    tag:'MIRANDA // VERONA RUPES', title:'20 KM ICE CLIFFS OF MIRANDA', accent:'#88eeff',
    art:`<path d="M80 345 L280 135 L460 145 L515 320 L720 335 Z" fill="#5e7c8c" stroke="#99eeff" stroke-width="3"/>
      <line x1="460" y1="145" x2="515" y2="320" stroke="#ffffff" stroke-width="5"/>`
  },
  'photos/missions/neptune/triton.jpg': {
    tag:'VOYAGER 2 // TRITON FLYBY', title:'TRITON NITROGEN ICE GEYSERS', accent:'#6699ff',
    art:`<path d="M0 305 Q400 270 800 310 L800 450 L0 450 Z" fill="#8aa4c8" stroke="#cce0ff" stroke-width="2"/>
      <path d="M340 290 L340 140 L540 125" fill="none" stroke="#334466" stroke-width="14" stroke-linecap="round"/>
      <circle cx="610" cy="145" r="55" fill="#3264d8" stroke="#77aaff" stroke-width="2"/>`
  },
  'photos/missions/neptune/dark_spot.jpg': {
    tag:'VOYAGER 2 // 2,100 KM/H WINDS', title:'GREAT DARK SPOT & SCOOTER CLOUDS', accent:'#4b70dd',
    art:`<rect x="70" y="75" width="660" height="280" rx="18" fill="#1e44b8"/>
      <ellipse cx="400" cy="210" rx="125" ry="62" fill="#0b1b58" stroke="#6699ff" stroke-width="3"/>
      <path d="M295 165 Q410 145 505 170" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>`
  }
};

function resolveMissionPhoto(src, fallbackCaption='') {
  if(!src || src.startsWith('data:')) return src;
  if(_missionArtCache[src]) return _missionArtCache[src];
  const spec = MISSION_ART_SPECS[src] || {
    tag: 'DEEP SPACE TELEMETRY',
    title: (fallbackCaption || src.split('/').pop().replace('.jpg','')).toUpperCase(),
    accent: '#00d4ff',
    art: `<circle cx="400" cy="215" r="95" fill="none" stroke="#00d4ff" stroke-width="3" stroke-dasharray="10 6"/><circle cx="400" cy="215" r="42" fill="#00d4ff" opacity="0.35"/>`
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#020716"/>
        <stop offset="55%" stop-color="#061430"/>
        <stop offset="100%" stop-color="#020610"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#bg)"/>
    <g stroke="rgba(0,212,255,0.08)" stroke-width="1">
      <line x1="0" y1="90" x2="800" y2="90"/><line x1="0" y1="180" x2="800" y2="180"/><line x1="0" y1="270" x2="800" y2="270"/><line x1="0" y1="360" x2="800" y2="360"/>
      <line x1="160" y1="0" x2="160" y2="450"/><line x1="320" y1="0" x2="320" y2="450"/><line x1="480" y1="0" x2="480" y2="450"/><line x1="640" y1="0" x2="640" y2="450"/>
    </g>
    <g fill="#ffffff" opacity="0.65">
      <circle cx="75" cy="55" r="1.5"/><circle cx="145" cy="120" r="1.2"/><circle cx="235" cy="48" r="1.8"/><circle cx="675" cy="64" r="1.6"/><circle cx="725" cy="140" r="1.3"/><circle cx="620" cy="110" r="1.5"/><circle cx="110" cy="295" r="1.4"/><circle cx="695" cy="285" r="1.7"/>
    </g>
    ${spec.art}
    <path d="M22,52 L22,20 L54,20 M778,52 L778,20 L746,20 M22,398 L22,430 L54,430 M778,398 L778,430 L746,430" fill="none" stroke="${spec.accent}" stroke-width="2.5" opacity="0.8"/>
    <rect x="0" y="388" width="800" height="62" fill="rgba(2,6,18,0.86)"/>
    <line x1="0" y1="388" x2="800" y2="388" stroke="${spec.accent}" stroke-width="1.5" opacity="0.55"/>
    <text x="32" y="411" fill="${spec.accent}" font-family="Orbitron,Segoe UI,sans-serif" font-size="11" font-weight="700" letter-spacing="2.5">${spec.tag}</text>
    <text x="32" y="433" fill="#e8f4ff" font-family="Orbitron,Segoe UI,sans-serif" font-size="15" font-weight="800" letter-spacing="1.5">${spec.title}</text>
  </svg>`;
  const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  _missionArtCache[src] = uri;
  return uri;
}

// ─── MISSIONS SYSTEM ─────────────────────────────────────────────────────────
const missionLookup = {};
MISSIONS.forEach(m => missionLookup[m.id] = m);

function openMission(id) {
  const m = MISSIONS.find(x => x.id === id);
  if(!m) return;

  // Fly camera to mission object
  const mObj = missionMeshes.find(x => x.mission.id === id);
  if(mObj) {
    const wpos = new THREE.Vector3();
    mObj.group.getWorldPosition(wpos);
    animateCameraTo(
      {x: wpos.x + 4, y: wpos.y + 2.5, z: wpos.z + 4},
      {x: wpos.x, y: wpos.y, z: wpos.z}
    );
  }

  const statusClass = m.status === 'active' ? 'active' : m.status === 'complete' ? 'complete' : 'planned';
  const statusLabel = m.status === 'active' ? '&#9679; Active Mission' : m.status === 'complete' ? '&#9670; Mission Complete' : '&#9672; Planned';

  const statsHTML = Object.entries(m.stats).map(([k,v]) =>
    `<div class="stat-box"><div class="stat-label">${k.charAt(0).toUpperCase()+k.slice(1).replace(/_/g,' ')}</div><div class="stat-value">${v}</div></div>`
  ).join('');

  const gallerySlides = m.photos.map(p => ({
    url: resolveMissionPhoto(p.src, p.caption),
    title: m.name + ' — ' + p.caption,
    caption: p.caption,
    credit: m.agency + ' · Mission Schematic'
  }));

  const photosHTML = m.photos.map((p, i) => {
    const cls = 'mission-photo' + (i===0 ? ' mission-photo-wide' : '');
    const dataUri = resolveMissionPhoto(p.src, p.caption);
    return `<img class="${cls}" src="${dataUri}" alt="${p.caption}" title="${p.caption}" data-slide-idx="${i}">`;
  }).join('');

  const factsHTML = m.facts.map(f => `<li>${f}</li>`).join('');
  const voiceKey = 'mission_' + m.id;

  const liveISSHTML = id === 'iss' ? `
    <div class="iss-live-box">
      <div class="iss-live-header">
        <span>● LIVE ORBITAL TELEMETRY (NORAD #25544)</span>
        <span>${_issLiveTelemetry.live ? 'ONLINE' : 'ORBITAL MODEL'}</span>
      </div>
      <div class="iss-live-coords" id="iss-live-telemetry-readout">
        <div>LAT: <strong>${_issLiveTelemetry.lat.toFixed(4)}°</strong></div>
        <div>LON: <strong>${_issLiveTelemetry.lon.toFixed(4)}°</strong></div>
        <div>ALT: <strong>${_issLiveTelemetry.alt.toFixed(1)} km</strong></div>
        <div>VEL: <strong>${Math.round(_issLiveTelemetry.vel).toLocaleString()} km/h</strong></div>
      </div>
    </div>` : '';

  const scrollEl = document.getElementById('mission-scroll');
  scrollEl.innerHTML = `
    <div class="mission-badge">&#9672; ${m.type} &mdash; ${m.agency.split('/')[0].trim()}</div>
    <div id="mission-panel-name">${m.name}</div>
    <div id="mission-panel-tagline">${m.tagline}</div>
    <div class="mission-status-badge ${statusClass}">${statusLabel}</div>
    <div class="panel-speak-row">
      <button id="mission-speak-btn" class="speak-btn-shared" data-body="${voiceKey}">
        <span>&#128266;</span>
        <span id="mission-speak-label">Hear Spacecraft Speak</span>
        <span class="speak-wave"><i></i><i></i><i></i><i></i></span>
      </button>
      <button id="mission-speak-more-btn" class="speak-more-shared" data-body="${voiceKey}">
        <span>Tell Me More &#8635;</span>
      </button>
    </div>
    <div id="mission-voice-transcript" class="voice-transcript-box"></div>
    ${liveISSHTML}
    <div class="mission-photo-grid">${photosHTML}</div>
    <div id="mission-nasa-gallery" class="nasa-gallery-section"></div>
    <div class="mission-desc">${m.desc}</div>
    <div class="panel-section">
      <h3>Mission Data</h3>
      <div class="mission-stats-grid">${statsHTML}</div>
    </div>
    <div class="panel-section">
      <h3>Key Facts</h3>
      <ul class="fact-list">${factsHTML}</ul>
    </div>`;

  scrollEl.querySelectorAll('.mission-photo').forEach(img => {
    img.addEventListener('click', () => {
      openLightboxCarousel(gallerySlides, parseInt(img.dataset.slideIdx || '0', 10));
    });
  });

  const spkBtn = document.getElementById('mission-speak-btn');
  const moreBtn = document.getElementById('mission-speak-more-btn');
  if (spkBtn) spkBtn.addEventListener('click', () => speakAsPlanet(voiceKey, false));
  if (moreBtn) moreBtn.addEventListener('click', () => speakAsPlanet(voiceKey, true));

  const fbSpecs = m.photos.map(p => ({ src: p.src, title: p.caption }));
  fetchNasaGallery(`${m.name} NASA spacecraft`, document.getElementById('mission-nasa-gallery'), fbSpecs);

  document.getElementById('location-label').textContent = m.short || m.name;
  closeAllPanels({keepTour:true});
  document.getElementById('mission-panel').classList.add('open');
}

function closeMissionPanel() {
  document.getElementById('mission-panel').classList.remove('open');
  if (_speakingPlanet && (_speakingPlanet.startsWith('mission_') || _speakingPlanet.startsWith('frontier_'))) {
    stopNarration();
    _speakingPlanet = null;
    _syncSpeakBtn();
  }
}

document.getElementById('mission-panel-close').addEventListener('click', closeMissionPanel);

function buildMissionsDropdown() {
  const container = document.getElementById('missions-dropdown');
  const title = document.getElementById('missions-dropdown-title');
  container.innerHTML = '';
  container.appendChild(title);

  MISSIONS.forEach(m => {
    const item = document.createElement('div');
    item.className = 'mission-drop-item';
    const colorHex = '#' + m.color.toString(16).padStart(6,'0');
    const statusClass = m.status === 'active' ? 'active' : 'complete';
    const statusText = m.status === 'active' ? 'ACTIVE' : 'COMPLETE';
    item.innerHTML = `
      <div class="mission-drop-dot" style="background:${colorHex};box-shadow:0 0 6px ${colorHex}88"></div>
      <div style="flex:1;min-width:0">
        <div class="mission-drop-name">${m.name}</div>
        <div class="mission-drop-sub">${m.type} &middot; ${m.agency.split('/')[0].trim()} &middot; ${m.launched}</div>
      </div>
      <div class="mission-drop-status ${statusClass}">${statusText}</div>`;
    item.addEventListener('click', () => {
      openMission(m.id);
      document.getElementById('missions-dropdown').classList.remove('open');
      document.getElementById('missions-btn').classList.remove('active');
    });
    container.appendChild(item);
  });
}
buildMissionsDropdown();

document.getElementById('missions-btn').addEventListener('click', () => {
  const btn = document.getElementById('missions-btn');
  const dd = document.getElementById('missions-dropdown');
  btn.classList.toggle('active');
  dd.classList.toggle('open');
  closeSideMenu();
  if(dd.classList.contains('open')) {
    const close = (e) => {
      if(!dd.contains(e.target) && e.target !== btn) {
        dd.classList.remove('open');
        btn.classList.remove('active');
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 10);
  }
});

// Replay actions for both cinematics.
document.getElementById('replay-intro-btn').addEventListener('click', () => {
  closeSideMenu();
  closeAllPanels({keepMenu:false});
  stopNarration();
  _forceIntroReplay = true;
  const cd = document.getElementById('cinematic');
  cd.style.display = ''; cd.style.opacity = ''; cd.style.transition = '';
  runCinematic();
});
document.getElementById('replay-premiere-btn').addEventListener('click', () => {
  closeSideMenu();
  closeAllPanels({keepMenu:false});
  stopNarration();
  startCinematicPremiere();
});

// ─── REAL 3D CAMERA FLY-IN & CARL SAGAN "PALE BLUE DOT" INTRO ────────────────
let _saganAudioEl = null;

function runCinematic() {
  let seenIntro = false;
  try { seenIntro = localStorage.getItem('ue_seen_intro') === '1'; } catch (e) {}
  if (seenIntro && !_forceIntroReplay) { _enterAfterIntro(); return; }
  _forceIntroReplay = false;
  try { localStorage.setItem('ue_seen_intro', '1'); } catch (e) {}

  _introActive = true;
  const div    = document.getElementById('cinematic');
  const canvas = document.getElementById('cine-canvas');
  const textDiv= document.getElementById('cine-text');
  const progEl = document.getElementById('cine-progress-legacy');
  const ctx    = canvas.getContext('2d');
  div.style.display = '';
  div.style.opacity = '1';
  div.classList.add('active');

  // Lock user orbit controls and freeze orbital drift so our 3D camera spline
  // sweeps cleanly past Saturn's rings, Jupiter, and the Pale Blue Dot of Earth
  const _wasPaused = paused;
  paused = true;
  controls.enabled = false;

  let W, H, dead = false;
  let _cineSkipKeys = null;
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  // Subtle warp starlight particles overlaid transparently on the real 3D scene
  const stars = Array.from({length: 180}, () => ({
    x: (Math.random()-0.5)*1600,
    y: (Math.random()-0.5)*1600,
    z: Math.random()*1000 + 1,
    pz: 1000,
    r: Math.random()*1.1+0.3
  }));

  // Exact Carl Sagan "Pale Blue Dot" monologue synced line-by-line to the 3D fly-in:
  // [appearAtSeconds, HTML subtitle, spokenText]
  const SCRIPT = [
    [ 0.8, "From this distant vantage point,<br>the Earth might not seem of any particular interest.",
           "From this distant vantage point, the Earth might not seem of any particular interest." ],
    [ 7.5, "But for us, it's different.<br><em>Look again at that dot.</em>",
           "But for us, it's different. Look again at that dot." ],
    [13.2, "That's here. That's home. <em>That's us.</em>",
           "That's here. That's home. That's us." ],
    [18.8, "On it everyone you love, everyone you know,<br>every human being who ever was, lived out their lives.",
           "On it everyone you love, everyone you know, every human being who ever was, lived out their lives." ],
    [26.5, "On a mote of dust — <em>suspended in a sunbeam.</em>",
           "On a mote of dust, suspended in a sunbeam." ],
    [32.5, "To me, it underscores our responsibility to preserve and cherish<br><em>the pale blue dot, the only home we've ever known.</em>",
           "To me, it underscores our responsibility to preserve and cherish the pale blue dot, the only home we've ever known." ],
  ];
  const TOTAL = 40.0;

  // Attempt to play real Carl Sagan Pale Blue Dot audio clip if present or reachable,
  // with automatic seamless fallback to English Web Speech narration synced per line.
  let _usingExternalSaganAudio = false;
  try {
    const audioCandidates = [
      'audio/sagan_pale_blue_dot.mp3',
      'https://upload.wikimedia.org/wikipedia/commons/e/e5/Carl_Sagan_-_Pale_Blue_Dot.ogg'
    ];
    const probeAudio = new Audio();
    probeAudio.crossOrigin = 'anonymous';
    probeAudio.preload = 'auto';
    probeAudio.volume = 0.95;
    let candIdx = 0;
    const tryNextSource = () => {
      if (dead || candIdx >= audioCandidates.length) return;
      probeAudio.src = audioCandidates[candIdx++];
      const playPromise = probeAudio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          if (dead) { probeAudio.pause(); return; }
          _usingExternalSaganAudio = true;
          _saganAudioEl = probeAudio;
          stopNarration(); // cancel TTS fallback if real audio succeeded
          setMusicDuck(true);
        }).catch(() => {
          tryNextSource();
        });
      }
    };
    probeAudio.addEventListener('ended', () => setMusicDuck(false));
    tryNextSource();
  } catch (e) {
    _usingExternalSaganAudio = false;
  }

  // Helper to get world position of a planet for our 3D camera keyframes
  function getPlanetWorldPos(id, fallbackVec) {
    const pm = planetMeshes.find(p => p.pdata.id === id);
    if (!pm) return fallbackVec.clone();
    const v = new THREE.Vector3();
    pm.group.getWorldPosition(v);
    return v;
  }

  const saturnPos  = getPlanetWorldPos('saturn',  new THREE.Vector3(30, 0, 12));
  const jupiterPos = getPlanetWorldPos('jupiter', new THREE.Vector3(-22, 0, 15));
  const earthPos   = getPlanetWorldPos('earth',   new THREE.Vector3(12, 0, 6));
  const sunPos     = new THREE.Vector3(0, 0, 0);

  // 6-keyframe 3D camera spline through the live Solar System:
  // 0: Deep interstellar space looking toward the distant Sun
  // 1: Sweeping inward past the outer ice giants toward Saturn
  // 2: Close dramatic pass right over Saturn's illuminated ring plane
  // 3: Banking past Jupiter's churning cloud bands & Great Red Spot
  // 4: Poignant close approach to the Pale Blue Dot of Earth
  // 5: Ascending smoothly into the grand Solar System cockpit overview
  const CAM_KEYFRAMES = [
    { t: 0.0,  pos: new THREE.Vector3(saturnPos.x * 2.8, 52, saturnPos.z * 2.8 + 135), look: sunPos.clone() },
    { t: 6.5,  pos: saturnPos.clone().add(new THREE.Vector3(14, 7.5, 16)),             look: saturnPos.clone() },
    { t: 13.0, pos: saturnPos.clone().add(new THREE.Vector3(-5.5, 2.6, 6.2)),          look: saturnPos.clone() },
    { t: 20.0, pos: jupiterPos.clone().add(new THREE.Vector3(6.8, 2.8, 7.2)),          look: jupiterPos.clone() },
    { t: 27.5, pos: earthPos.clone().add(new THREE.Vector3(2.8, 1.1, 3.1)),            look: earthPos.clone() },
    { t: 34.5, pos: earthPos.clone().add(new THREE.Vector3(4.2, 2.2, 4.8)),            look: earthPos.clone() },
    { t: 40.0, pos: new THREE.Vector3(0, 28, 55),                                      look: sunPos.clone() },
  ];

  function update3DFlyInCamera(sec) {
    let k0 = CAM_KEYFRAMES[0], k1 = CAM_KEYFRAMES[CAM_KEYFRAMES.length - 1];
    for (let i = 0; i < CAM_KEYFRAMES.length - 1; i++) {
      if (sec >= CAM_KEYFRAMES[i].t && sec <= CAM_KEYFRAMES[i + 1].t) {
        k0 = CAM_KEYFRAMES[i];
        k1 = CAM_KEYFRAMES[i + 1];
        break;
      }
    }
    const span = Math.max(0.001, k1.t - k0.t);
    const raw = Math.max(0, Math.min(1, (sec - k0.t) / span));
    // Smooth cosine ease between waypoints
    const ease = 0.5 - 0.5 * Math.cos(raw * Math.PI);
    camera.position.lerpVectors(k0.pos, k1.pos, ease);
    controls.target.lerpVectors(k0.look, k1.look, ease);
    controls.update();
  }

  let elapsed = 0, lastTs = null;
  let curLineIdx = -1, lineEl = null;

  function endCinematic() {
    if(dead) return;
    dead = true;
    _introActive = false;
    window.removeEventListener('resize', resize);
    if (_cineSkipKeys) {
      document.removeEventListener('keydown', _cineSkipKeys);
      _cineSkipKeys = null;
    }
    if (_saganAudioEl) {
      try { _saganAudioEl.pause(); _saganAudioEl.currentTime = 0; } catch(e){}
      _saganAudioEl = null;
    }
    stopNarration();
    setMusicDuck(false);
    paused = _wasPaused;
    controls.enabled = true;
    if(lineEl) lineEl.style.opacity = '0';
    div.style.transition = 'opacity 1.4s ease';
    div.style.opacity = '0';
    setTimeout(() => { div.classList.remove('active'); div.style.display = 'none'; }, 1500);
    stopCinematicScore();
    setTimeout(_enterAfterIntro, 900);
  }

  document.getElementById('cine-skip').addEventListener('click', endCinematic, {once:true});

  _cineSkipKeys = (e) => {
    if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      endCinematic();
    }
  };
  document.addEventListener('keydown', _cineSkipKeys);

  function frame(ts) {
    if(dead) return;
    if(!lastTs) lastTs = ts;
    elapsed += (ts - lastTs) / 1000;
    lastTs = ts;

    // Move the real 3D Three.js camera along the interstellar-to-Earth spline
    update3DFlyInCamera(elapsed);

    // Clear 2D overlay canvas so the live 3D solar system shines through crystal clear
    ctx.clearRect(0, 0, W, H);

    // Subtle cinematic letterbox vignette around edges for subtitle legibility
    const vg = ctx.createRadialGradient(W*0.5, H*0.5, Math.min(W,H)*0.28, W*0.5, H*0.5, Math.max(W,H)*0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,3,14,0.58)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // Subtle interstellar warp streaks during the initial high-speed approach (0-12s)
    if (elapsed < 14) {
      const warpIntensity = Math.max(0, 1 - elapsed / 14);
      const speed = 1.5 + warpIntensity * 7.5;
      const cx = W * 0.5, cy = H * 0.5;
      stars.forEach(s => {
        s.pz = s.z;
        s.z -= speed * 4.2;
        if (s.z <= 1) {
          s.x = (Math.random()-0.5)*1600;
          s.y = (Math.random()-0.5)*1600;
          s.z = 1000; s.pz = 1000;
        }
        const sx = (s.x/s.z)*W*0.5+cx, sy = (s.y/s.z)*H*0.5+cy;
        const px = (s.x/s.pz)*W*0.5+cx, py = (s.y/s.pz)*H*0.5+cy;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(185,225,255,${(warpIntensity * 0.45).toFixed(3)})`;
        ctx.lineWidth = s.r * 0.6;
        ctx.stroke();
      });
    }

    // Progress bar
    if(progEl) progEl.style.width = Math.min(100, (elapsed/TOTAL*100)).toFixed(1)+'%';

    // Manage Pale Blue Dot subtitle lines + English voice sync
    for(let i=0; i<SCRIPT.length; i++) {
      const [startAt, htmlText, spokenText] = SCRIPT[i];
      const hideAt = (i < SCRIPT.length-1) ? SCRIPT[i+1][0]-0.45 : TOTAL - 0.5;

      if(elapsed >= startAt && elapsed < hideAt) {
        if(curLineIdx !== i) {
          curLineIdx = i;
          textDiv.innerHTML = `<div class="cine-line">${htmlText}<div style="font-size:11px;letter-spacing:.22em;color:rgba(0,212,255,.65);margin-top:10px;font-family:Orbitron,sans-serif">— CARL SAGAN · PALE BLUE DOT</div></div>`;
          lineEl = textDiv.querySelector('.cine-line');
          requestAnimationFrame(() => lineEl && lineEl.classList.add('show'));
          if (!_usingExternalSaganAudio && spokenText) {
            speakNarration(spokenText, { rate: 0.86, pitch: 0.88 });
          }
        }
      } else if(curLineIdx === i && elapsed >= hideAt) {
        if(lineEl) lineEl.classList.remove('show');
        curLineIdx = -1; lineEl = null;
      }
    }

    if(elapsed >= TOTAL) { endCinematic(); return; }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  // Initialise and fade in the space ambient soundtrack
  if(!audioCtx) initAudio();
  if(audioCtx) {
    audioCtx.resume();
    audioEnabled = true;
    syncAudioBtn();
    if(ambientMaster) {
      ambientMaster.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientMaster.gain.setValueAtTime(0, audioCtx.currentTime);
      ambientMaster.gain.linearRampToValueAtTime(_effectiveAmbientGain(), audioCtx.currentTime+4);
    }
    playCinematicScore();
  }
}

// ─── CINEMATIC SCORE — Warm Orchestral Swell (Zero Static Noise) ──────────────
let cinematicScoreNodes = [];
function playCinematicScore() {
  if(!audioCtx) return;
  const t = audioCtx.currentTime;
  const nodes = [];

  const scoreMaster = audioCtx.createGain();
  const peakGain = 0.24 * masterUserVolume;
  scoreMaster.gain.setValueAtTime(0, t);
  scoreMaster.gain.linearRampToValueAtTime(peakGain, t + 6);
  scoreMaster.gain.setValueAtTime(peakGain, t + 33);
  scoreMaster.gain.linearRampToValueAtTime(0, t + 41);
  scoreMaster.connect(audioCtx.destination);

  const cineReverb = createReverb(audioCtx, 9, 2.8);
  const revG = audioCtx.createGain(); revG.gain.value = 0.72;
  cineReverb.connect(revG); revG.connect(scoreMaster);
  const dry = audioCtx.createGain(); dry.gain.value = 0.30; dry.connect(scoreMaster);

  // Deep warm sub-bass pedal (C1 / G1)
  [32.70, 65.41].forEach((freq, i) => {
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    const filt = audioCtx.createBiquadFilter();
    osc.type = 'sine'; osc.frequency.value = freq;
    filt.type = 'lowpass'; filt.frequency.value = 110; filt.Q.value = 0.4;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(i===0 ? 0.18 : 0.10, t + 5);
    g.gain.setValueAtTime(i===0 ? 0.18 : 0.10, t + 34);
    g.gain.linearRampToValueAtTime(0, t + 41);
    osc.connect(filt); filt.connect(g); g.connect(dry);
    osc.start(t); osc.stop(t + 42); nodes.push(osc);
  });

  // Warm evolving string/pad chords: Cmaj9 → Em7 → Fmaj9 → G6
  const CINE_CHORDS = [
    { freqs: [130.81, 164.81, 196.00, 246.94, 293.66], start: 0,  dur: 11 },
    { freqs: [164.81, 196.00, 246.94, 293.66, 329.63], start: 10, dur: 11 },
    { freqs: [174.61, 220.00, 261.63, 329.63, 392.00], start: 20, dur: 11 },
    { freqs: [130.81, 196.00, 261.63, 329.63, 493.88], start: 30, dur: 11 },
  ];
  CINE_CHORDS.forEach(({ freqs, start, dur }) => {
    freqs.forEach((freq, vi) => {
      const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
      const filt = audioCtx.createBiquadFilter();
      osc.type = vi < 2 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (vi - 2) * 3.5;
      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(240, t + start);
      filt.frequency.linearRampToValueAtTime(580 + vi * 70, t + start + dur * 0.5);
      filt.Q.value = 0.45;
      g.gain.setValueAtTime(0, t + start);
      g.gain.linearRampToValueAtTime(0.026, t + start + 2.5);
      g.gain.setValueAtTime(0.026, t + start + dur - 2.0);
      g.gain.linearRampToValueAtTime(0, t + start + dur);
      osc.connect(filt); filt.connect(g); g.connect(cineReverb); g.connect(dry);
      osc.start(t + start); osc.stop(t + start + dur + 0.5); nodes.push(osc);
    });
  });

  cinematicScoreNodes = nodes;
  cinematicScoreNodes._master = scoreMaster;
}

function stopCinematicScore() {
  if(cinematicScoreNodes._master && audioCtx) {
    const t = audioCtx.currentTime;
    cinematicScoreNodes._master.gain.cancelScheduledValues(t);
    cinematicScoreNodes._master.gain.linearRampToValueAtTime(0, t + 1.8);
  }
  setTimeout(() => {
    cinematicScoreNodes.forEach(n => { try { n.stop(); } catch(e){} });
    cinematicScoreNodes = [];
  }, 2000);
}

// ─── GUIDED TOUR: COSMOS-STYLE NARRATION ─────────────────────────────────────
// Each stop: sagan = narrator voice (italic, wonder-filled, personal)
//            wowFacts = [{icon, headline, body}] — one at a time, kids cycle through
const TOUR_STOPS = [
  {
    planetId: null, title: 'THE SUN', subtitle: 'The Star That Made You',
    sagan: "Everything you've ever known — every person, every city, every ocean, every idea — exists because of this one blazing ball of gas. Without it, Earth would be a frozen rock drifting in darkness. The Sun didn't just make life possible. It made YOU possible.",
    wowFacts: [
      {icon:'☀️', headline:'1.3 MILLION EARTHS FIT INSIDE IT', body:'If the Sun were hollow, you could pack 1.3 million planet Earths inside. That\'s so big your brain genuinely cannot picture it — and that\'s okay. The universe is under no obligation to make sense to us.'},
      {icon:'⚡', headline:'YOU\'RE LOOKING 8 MINUTES INTO THE PAST', body:'Right now, the sunlight hitting your face left the Sun 8 minutes ago. You\'re not seeing the Sun as it is — you\'re seeing it as it WAS. Every time you look at the sky, you\'re time-traveling.'},
      {icon:'🔥', headline:'IT WILL OUTLIVE EVERY HUMAN CIVILIZATION', body:'The Sun is 4.6 billion years old and has enough fuel for another 5 billion years. Every civilization that has ever existed — every empire, every language, every song — has lived and died in just a blink of its life.'},
    ],
    photos: ['photos/missions/sun/corona.jpg', 'photos/missions/sun/parker.jpg'], mood: 'warm'
  },
  {
    planetId: 'mercury', title: 'MERCURY', subtitle: 'The World of Extremes',
    sagan: "Mercury is the closest planet to the Sun, yet it is NOT the hottest. That fact alone should tell you: the universe loves surprises. This scarred, airless world swings between blistering heat and bone-crushing cold every single day.",
    wowFacts: [
      {icon:'🌡️', headline:'600°C TEMPERATURE SWING — IN ONE DAY', body:'During the day, Mercury\'s surface hits 430°C. At night, it plunges to -180°C. That\'s a swing of over 600 degrees — because with no atmosphere, there\'s nothing to hold in the warmth. No air means no protection. None.'},
      {icon:'❄️', headline:'ICE ON THE CLOSEST PLANET TO THE SUN', body:'Hidden in deep craters near Mercury\'s poles, where sunlight never reaches, are thick deposits of water ice. A world baking in sunlight has frozen water tucked in its shadows. Space is wild.'},
      {icon:'⏱️', headline:'A YEAR SHORTER THAN YOUR SCHOOL TERM', body:'Mercury orbits the Sun in just 88 Earth days. If you lived there, you\'d have your birthday more than 4 times a year. The universe would owe you a lot of cake.'},
    ],
    photos: ['photos/missions/mercury/caloris.jpg', 'photos/missions/mercury/messenger.jpg'], mood: 'intense'
  },
  {
    planetId: 'venus', title: 'VENUS', subtitle: 'Earth\'s Evil Twin',
    sagan: "Venus looks beautiful from a distance — the brightest star in our evening sky. But get closer, and you'd find a nightmare world of crushing pressure, acid rain, and temperatures hot enough to melt lead. It is Earth's twin gone terribly, terribly wrong. And it is a warning.",
    wowFacts: [
      {icon:'🌧️', headline:'IT RAINS SULFURIC ACID', body:'High in Venus\'s atmosphere, clouds of sulfuric acid form and rain down — but it\'s so hot below that the acid evaporates before it hits the ground. The rain never lands. This place will not negotiate with you.'},
      {icon:'🔄', headline:'THE SUN RISES IN THE WEST HERE', body:'Venus rotates backwards compared to every other planet. If you stood on Venus (briefly, before being crushed and melted), the Sun would rise in the west and set in the east. And a day there lasts longer than its year.'},
      {icon:'⚠️', headline:'A CAUTIONARY TALE FOR EARTH', body:'Venus and Earth are almost the same size and made of the same stuff. But a runaway greenhouse effect turned Venus into a 465°C furnace. Some scientists say Venus shows us what Earth could become if we\'re not careful with our atmosphere.'},
    ],
    photos: ['photos/missions/venus/magellan.jpg', 'photos/missions/venus/venera.jpg'], mood: 'dark'
  },
  {
    planetId: 'earth', title: 'EARTH', subtitle: 'The Pale Blue Dot',
    sagan: "\"Look again at that dot. That's here. That's home. That's us.\" In 1990, Carl Sagan asked NASA to turn the Voyager 1 camera around when it was 6 billion km away. It took one photo. Earth was a tiny speck of light — a mote of dust suspended in a sunbeam. Everything that has ever happened in human history happened on that dot.",
    wowFacts: [
      {icon:'💙', headline:'THE ONLY LIFE IN THE UNIVERSE — SO FAR', body:'We have explored our solar system pretty well. We have sent probes to every planet, photographed thousands of worlds, and listened for signals across the galaxy. And in all that vastness, life has been found in exactly one place: here. That makes this dot precious beyond words.'},
      {icon:'🌊', headline:'71% WATER — AND WE BARELY KNOW IT', body:'Earth is the only planet with liquid water oceans, and those oceans cover 71% of the surface. Yet we\'ve explored less than 20% of them. There are mountains under the sea taller than Everest, and creatures down there that look like aliens. You live on a mostly unexplored world.'},
      {icon:'🧲', headline:'AN INVISIBLE SHIELD PROTECTS ALL LIFE', body:'Earth has a magnetic field generated deep in its iron core. It deflects the solar wind — a constant stream of deadly charged particles from the Sun. Without this invisible shield, the solar wind would slowly strip away our atmosphere, just as it did on Mars billions of years ago.'},
    ],
    photos: ['photos/missions/earth/apollo.jpg', 'photos/missions/iss/earth_view.jpg'], mood: 'hopeful'
  },
  {
    planetId: 'mars', title: 'MARS', subtitle: 'The Next Giant Leap',
    sagan: "Mars haunts us. It may be the most studied world beyond Earth — and still it surprises us. Ancient rivers carved its surface. Something happened here billions of years ago. The question that keeps scientists awake at night: was there ever life on Mars? And the wild part is... we might find out in your lifetime.",
    wowFacts: [
      {icon:'🏔️', headline:'A VOLCANO SO TALL IT POKES OUT OF THE ATMOSPHERE', body:'Olympus Mons is 21 km high — nearly 3× taller than Mount Everest. It\'s so wide (600 km across) that if you stood in the middle, you wouldn\'t know you were on a volcano. The edges would be below the horizon. Your brain cannot see it all at once.'},
      {icon:'🤖', headline:'A ROBOT IS THERE RIGHT NOW', body:'The Perseverance rover is actively driving across Mars as you read this. It has already collected rock samples that might contain fossilized signs of ancient life. When those samples return to Earth (planned for the 2030s), it could be the most important scientific discovery in human history.'},
      {icon:'🌊', headline:'MARS HAD OCEANS — WHERE DID THEY GO?', body:'Billions of years ago, Mars had liquid water oceans, rivers, and possibly rain. Scientists can see the ancient shorelines. Something catastrophic happened: Mars lost its magnetic field, the solar wind stripped its atmosphere, and the water either froze underground or escaped to space. A world died.'},
    ],
    photos: ['photos/missions/perseverance/rover.jpg', 'photos/missions/perseverance/surface.jpg'],
    mood: 'adventurous'
  },
  {
    planetId: 'jupiter', title: 'JUPITER', subtitle: 'The Shield of the Solar System',
    sagan: "Jupiter is so massive it barely counts as a planet — it\'s almost a star. Its gravity rules this solar system like an invisible hand, hurling asteroids away from Earth, capturing comets, and sheltering us from cosmic debris. Without Jupiter acting as our guardian, life on Earth might have been wiped out long ago.",
    wowFacts: [
      {icon:'🌀', headline:'A STORM OLDER THAN THE USA — BIGGER THAN EARTH', body:'The Great Red Spot is a storm that has been raging continuously for at least 350 years. It was already swirling when your great-great-great-great-great-grandparents were alive. At its widest, it was 3× the size of Earth. It\'s slowly shrinking — but it\'s still bigger than our entire planet.'},
      {icon:'🌊', headline:'EUROPA: AN OCEAN WORLD THAT MIGHT HAVE LIFE', body:'Jupiter\'s moon Europa has a liquid water ocean twice the size of all Earth\'s oceans — hidden under a thick shell of ice. Warm water near the seafloor. Chemical energy from undersea vents. It has everything life needs. NASA is sending a spacecraft there to find out.'},
      {icon:'🛡️', headline:'JUPITER TOOK A COMET BULLET FOR EARTH', body:'In 1994, the comet Shoemaker-Levy 9 broke apart and slammed into Jupiter in 21 separate explosions. Each impact was larger than Earth. Scientists believe Jupiter\'s gravity deflects or absorbs many comets and asteroids that would otherwise head toward the inner solar system — and us.'},
    ],
    photos: ['photos/missions/juno/great_red_spot.jpg', 'photos/missions/juno/jupiter_cloud.jpg'],
    mood: 'epic'
  },
  {
    planetId: 'saturn', title: 'SATURN', subtitle: 'The Most Beautiful Object in the Solar System',
    sagan: "Nothing prepares you for seeing Saturn through a telescope for the first time. Even professional astronomers report the same reaction: disbelief. It looks fake — too perfect, too symmetrical, too unreal. But it\'s more real than anything you\'ve ever seen. And those rings are made of billions of chunks of ice, each one catching sunlight, casting individual shadows.",
    wowFacts: [
      {icon:'💿', headline:'RINGS 282,000 KM WIDE — BUT ONLY 10 METRES THICK', body:'Saturn\'s rings stretch almost as far as the distance from Earth to the Moon — but they\'re only about as thick as a 3-story building. If you scaled the rings down to the size of a vinyl record, they would be thinner than the plastic the record is made of.'},
      {icon:'🫧', headline:'SATURN WOULD FLOAT IN A BATHTUB', body:'Saturn is so enormous (764 Earths could fit inside it) yet so made of light gases, that its average density is less than water. If you could find a bathtub big enough, Saturn would float. It is, essentially, an enormous cosmic bubble.'},
      {icon:'💧', headline:'ENCELADUS IS SHOOTING WATER INTO SPACE RIGHT NOW', body:'Saturn\'s tiny moon Enceladus has geysers erupting from cracks in its ice shell, shooting water vapor hundreds of kilometres into space. That water comes from a warm, salty ocean beneath the ice. It has the ingredients for life. And it\'s actively launching them into space where we can study them.'},
    ],
    photos: ['photos/missions/cassini/rings.jpg', 'photos/missions/cassini/enceladus.jpg'],
    mood: 'majestic'
  },
  {
    planetId: 'uranus', title: 'URANUS', subtitle: 'The World That Got Knocked Over',
    sagan: "Something enormous hit Uranus billions of years ago — so hard it knocked the entire planet onto its side. Now it rolls around the Sun like a bowling ball. Each pole gets 42 years of constant sunlight, then 42 years of total darkness. The universe doesn\'t care about symmetry. It just keeps surprising us.",
    wowFacts: [
      {icon:'↔️', headline:'IT ROLLS AROUND THE SUN ON ITS SIDE', body:'Uranus is tilted 98° — meaning it\'s essentially on its side. Imagine lying down and rolling sideways around a fire. That\'s what Uranus does around the Sun. Scientists think a Mars-sized object smashed into it during the solar system\'s wild early history.'},
      {icon:'🥶', headline:'COLDER THAN NEPTUNE — EVEN THOUGH IT\'S CLOSER', body:'Despite being closer to the Sun, Uranus is somehow colder than Neptune (-224°C vs -214°C). Nobody fully understands why. There are currently no spacecraft studying Uranus. It\'s the most mysterious planet we\'ve ever seen up close — which means there are questions only you might one day help answer.'},
      {icon:'💎', headline:'IT MIGHT RAIN DIAMONDS', body:'Deep inside Uranus, the extreme pressure may be turning carbon atoms into actual diamonds that rain down through the atmosphere. Diamond rain. Scientists have recreated this in labs and confirmed it\'s possible. Somewhere out there, it is quite literally raining diamonds.'},
    ],
    photos: ['photos/missions/uranus/voyager2.jpg', 'photos/missions/uranus/miranda.jpg'],
    mood: 'mysterious'
  },
  {
    planetId: 'neptune', title: 'NEPTUNE', subtitle: 'The Edge of the Known',
    sagan: "Neptune was found not by looking through a telescope, but by doing math. Scientists noticed Uranus wasn\'t orbiting quite right, predicted there must be another planet pulling on it, and pointed a telescope exactly where the math said to look. They found Neptune the first night. Pure human reason, reaching out into the dark and touching something real.",
    wowFacts: [
      {icon:'🌪️', headline:'THE FASTEST WINDS IN THE SOLAR SYSTEM', body:'Neptune\'s winds reach 2,100 km/h — faster than the speed of sound on Earth. We\'re not sure why. Neptune receives almost no sunlight yet generates enormous weather systems. It has internal heat from when it formed. This cold, dark world is not quiet.'},
      {icon:'🔭', headline:'DISCOVERED BY MATH BEFORE ANYONE SAW IT', body:'In 1846, a French mathematician named Urbain Le Verrier calculated exactly where Neptune had to be, based on Uranus\'s wobbly orbit. He told an observatory to look at a specific spot in the sky. Neptune was found within 1 degree of where math said it would be. Mathematics can reveal things invisible to the eye.'},
      {icon:'🌀', headline:'TRITON: A MOON THAT ORBITS BACKWARDS', body:'Neptune\'s largest moon, Triton, orbits in the OPPOSITE direction to everything else. That means it was captured — a wandering Kuiper Belt object that got pulled in by Neptune\'s gravity. One day (in about 3.6 billion years) it will be pulled apart and form a ring system that will outshine Saturn\'s.'},
    ],
    photos: ['photos/missions/neptune/triton.jpg', 'photos/missions/neptune/dark_spot.jpg'],
    mood: 'cold'
  },
  {
    planetId: 'pluto', title: 'PLUTO', subtitle: 'The Heart of the Outer Solar System',
    sagan: "In 2015, after a nine-year journey across 5 billion kilometres, the New Horizons spacecraft flew past Pluto — and humanity saw this tiny world for the very first time. What we found left scientists speechless: mountains as tall as the Rockies, blue skies, and a giant heart. A heart. The universe put a heart on Pluto. We didn\'t deserve that.",
    wowFacts: [
      {icon:'❤️', headline:'PLUTO HAS A HEART', body:'Tombaugh Regio — nicknamed "The Heart" — is a 1,600 km wide region of bright nitrogen ice shaped unmistakably like a heart. Nobody expected it. When New Horizons sent back that first image in 2015, the entire science team burst into tears. Sometimes the universe is just kind.'},
      {icon:'🏔️', headline:'MOUNTAINS OF FROZEN WATER', body:'Pluto has mountain ranges made of water ice reaching 3,500 metres tall. Those mountains are as old as the solar system itself — 4 billion years — and they\'re still standing, preserved in the deep freeze of the outer solar system. Some things last.'},
      {icon:'💙', headline:'PLUTO HAS BLUE SKIES', body:'When New Horizons looked back at Pluto from the far side, it saw something unexpected: a haze of blue. Pluto has blue skies — caused by nitrogen haze particles scattering light just like Earth\'s atmosphere does. In the most unlikely, distant, cold corner of our solar system... there\'s blue.'},
    ],
    photos: ['photos/missions/new_horizons/pluto.jpg', 'photos/missions/new_horizons/heart.jpg'],
    mood: 'ethereal'
  }
];

let tourActive = false, tourStopIdx = 0;
let tourAudioNodes = [];
let tourScoreGain = null;
let tourCamAnim = null; // {target, startPos, startLook, endPos, endLook, progress}

let _tourSavedSpeed = null;
// startTour saved speedMult but not `paused`, so exiting the tour always
// un-paused the sim and stamped the ⏸ glyph on — losing a deliberate pause.
let _tourSavedPaused = false;
// Handle for the deferred Sagan-quote reveal, so endTour can cancel it.
let _saganShowTimer = null;

function startTour() {
  tourActive = true;
  tourStopIdx = 0;
  closePanel();
  closeMissionPanel();
  closeRocketLaunchpad();
  // Pause simulation during tour so planets don't drift while camera flies to them
  _tourSavedSpeed = speedMult;
  _tourSavedPaused = paused;
  paused = true;
  document.getElementById('tc-play').innerHTML = '&#9654;';
  document.getElementById('tc-play').classList.remove('active');
  document.getElementById('tour-panel').classList.add('open');
  document.getElementById('tour-btn').classList.add('active');
  playTourAmbience();
  showTourStop(0);
}

function endTour() {
  tourActive = false;
  tourCamAnim = null;
  controls.enabled = true; // always restore controls on tour exit
  clearTimeout(_saganShowTimer); _saganShowTimer = null;
  _hideSaganOverlay();
  document.getElementById('tour-panel').classList.remove('open');
  document.getElementById('tour-btn').classList.remove('active');
  stopTourAudio();
  // Resume simulation
  if(_tourSavedSpeed !== null) {
    paused = _tourSavedPaused;
    speedMult = _tourSavedSpeed;
    _tourSavedSpeed = null;
    const tp = document.getElementById('tc-play');
    tp.innerHTML = paused ? '&#9654;' : '&#9646;&#9646;';
    tp.classList.toggle('active', !paused);
  }
}

let _tourWowIdx = 0; // which wow-fact is currently showing
// Bumped on every showTourStop() call. The warp-flash defers panel population
// by ~2.2s, during which the user can hit Next again or exit the tour entirely;
// stale callbacks compare against this and bail instead of populating the panel
// for the wrong stop or re-installing a camera animation after the tour ended.
let _tourNavSeq = 0;

// ── Sagan floating-quote overlay helpers ────────────────────────────────────
let _saganQTimer = null;
function _showSaganOverlay(text) {
  const el = document.getElementById('tour-sagan-quote'); if(!el) return;
  document.getElementById('tsq-text').textContent = `"${text}"`;
  document.getElementById('tsq-author').textContent = '— Carl Sagan';
  clearTimeout(_saganQTimer); el.classList.remove('show'); void el.offsetWidth;
  setTimeout(() => el.classList.add('show'), 80);
  _saganQTimer = setTimeout(() => el.classList.remove('show'), 9000);
}
function _hideSaganOverlay() {
  clearTimeout(_saganQTimer);
  const el = document.getElementById('tour-sagan-quote'); if(el) el.classList.remove('show');
}
// ── Warp-speed hyperspace transition ─────────────────────────────────────────
function _showRocketFlash(destName, cb) {
  const el = document.getElementById('tour-rocket-flash'); if(!el){cb();return;}
  const cvs = document.getElementById('tour-warp-canvas');
  const inner = document.getElementById('trf-inner');

  inner.innerHTML = `<div style="font-size:2.2em;margin-bottom:10px;filter:drop-shadow(0 0 12px rgba(120,200,255,.9))">🚀</div>
    <div style="font-size:.6em;letter-spacing:.22em;color:rgba(120,200,255,.7);margin-bottom:6px">NAVIGATING TO</div>
    <div>${destName}</div>`;

  // ── Hyperspace warp canvas animation ──────────────────────────────────────
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  const cx = W / 2, cy = H / 2;

  // 280 stars — each has a random angle, starting near center
  const stars = Array.from({length: 280}, () => ({
    angle: Math.random() * Math.PI * 2,
    r: Math.random() * 40 + 5,   // starting radius
    speed: Math.random() * 14 + 8,
    width: Math.random() * 1.4 + 0.4,
    bright: Math.random() * 0.5 + 0.5
  }));

  let dead = false;
  let phase = 0; // 0=accel, 1=full warp, 2=decel+fade

  const TOTAL_MS = 1800;
  const startTs = performance.now();

  function drawFrame(ts) {
    if(dead) return;
    const elapsed = ts - startTs;
    const frac = Math.min(1, elapsed / TOTAL_MS);

    // Speed curve: ramp up fast, hold, then slow
    let warpFrac;
    if(frac < 0.25) warpFrac = frac / 0.25;          // 0→1 ramp up
    else if(frac < 0.75) warpFrac = 1;                // full warp
    else warpFrac = 1 - (frac - 0.75) / 0.25;         // 1→0 slow down

    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      // Move star outward from center
      s.r += s.speed * warpFrac;

      const sx = cx + Math.cos(s.angle) * s.r;
      const sy = cy + Math.sin(s.angle) * s.r;
      // Streak length proportional to warp speed
      const streakLen = s.speed * warpFrac * 6;
      const ex = sx - Math.cos(s.angle) * streakLen;
      const ey = sy - Math.sin(s.angle) * streakLen;

      const alpha = Math.min(1, s.bright * warpFrac);
      const grad = ctx.createLinearGradient(ex, ey, sx, sy);
      grad.addColorStop(0, `rgba(160,210,255,0)`);
      grad.addColorStop(0.6, `rgba(200,230,255,${alpha * 0.6})`);
      grad.addColorStop(1,   `rgba(255,255,255,${alpha})`);

      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width * (0.5 + warpFrac * 0.5);
      ctx.stroke();

      // Wrap around — reset star when it exits screen
      if(sx < -50 || sx > W+50 || sy < -50 || sy > H+50) {
        s.r = Math.random() * 20 + 2;
      }
    });

    if(!dead) requestAnimationFrame(drawFrame);
  }

  el.classList.add('show');
  requestAnimationFrame(drawFrame);

  // After TOTAL_MS, fade out overlay, then call back after fly-in starts
  setTimeout(() => {
    dead = true;
    ctx.clearRect(0, 0, W, H);
    el.classList.remove('show');
    setTimeout(cb, 420);
  }, TOTAL_MS);
}

function showTourStop(idx) {
  tourStopIdx = idx;
  _tourWowIdx = 0;
  const stop = TOUR_STOPS[idx];
  _hideSaganOverlay();
  const seq = ++_tourNavSeq;

  const _populate = () => {
    // Superseded by a newer stop, or the tour was exited while the warp flash
    // was still playing. Bailing here is what stops flyTourCamera() from
    // re-disabling OrbitControls and latching the camera onto a planet forever.
    if(seq !== _tourNavSeq || !tourActive) return;
    // ── Planet identity ───────────────────────────────────────────────────────
    document.getElementById('tour-planet-title').textContent = stop.title;
    document.getElementById('tour-planet-subtitle').textContent = stop.subtitle;

    // ── Sagan narrator quote ──────────────────────────────────────────────────
    document.getElementById('tour-sagan-text').textContent = stop.sagan || '';

    // ── Wow-fact card (first fact) ────────────────────────────────────────────
    showTourWowFact(stop, 0);

    // ── Photos ────────────────────────────────────────────────────────────────
    const photosEl = document.getElementById('tour-photos');
    if(stop.photos && stop.photos.length > 0) {
      photosEl.innerHTML = stop.photos.map((p, i) => {
        const resolved = resolveMissionPhoto(p, stop.title);
        return `<img class="tour-photo" src="${resolved}" alt="${stop.title}" style="transition-delay:${i*0.15}s" onclick="window.openTourLightbox('${p}')">`;
      }).join('');
      setTimeout(() => photosEl.querySelectorAll('.tour-photo').forEach(img => img.classList.add('show')), 400);
    } else {
      photosEl.innerHTML = '';
    }

    // ── Progress dots ─────────────────────────────────────────────────────────
    document.getElementById('tour-progress').innerHTML = TOUR_STOPS.map((_, i) =>
      `<div class="tour-dot${i===idx?' active':i<idx?' visited':''}"></div>`
    ).join('');

    // ── Nav ───────────────────────────────────────────────────────────────────
    document.getElementById('tour-stop-num').textContent = `${idx + 1} / ${TOUR_STOPS.length}`;
    document.getElementById('tour-prev').style.visibility = idx === 0 ? 'hidden' : '';
    document.getElementById('tour-next').textContent = idx === TOUR_STOPS.length - 1 ? 'Finish \u2713' : 'Next \u2192';

    // Scroll to top
    document.getElementById('tour-scroll').scrollTop = 0;

    shiftTourMood(stop.mood);

    // ── Camera fly + cinematic title card + Sagan quote overlay ──────────────
    flyTourCamera(stop, () => {
      showTourTitleCard(stop.title, stop.subtitle, () => {});
      // Show floating Sagan quote 2.5s after camera arrives. Tracked and
      // guarded: the handle used to be discarded, so exiting the tour inside
      // this window popped the quote up over the normal app view, where
      // _saganQTimer then held it for a further 9 seconds.
      clearTimeout(_saganShowTimer);
      if(stop.sagan) _saganShowTimer = setTimeout(() => {
        if(tourActive && seq === _tourNavSeq) _showSaganOverlay(stop.sagan);
      }, 2500);
    });
  };

  // Rocket-flash transition for all stops after the first
  if(idx > 0) {
    _showRocketFlash(stop.title, _populate);
  } else {
    _populate();
  }
}

function showTourWowFact(stop, factIdx) {
  const facts = stop.wowFacts || [];
  if(!facts.length) return;
  const fact = facts[factIdx];

  // Animate card out then in
  const card = document.getElementById('tour-wow-card');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';

  document.getElementById('tour-wow-icon').textContent = fact.icon;
  document.getElementById('tour-wow-headline').textContent = fact.headline;
  document.getElementById('tour-wow-body').textContent = fact.body;
  document.getElementById('tour-wow-counter').textContent = `${factIdx + 1} of ${facts.length}`;

  const prevBtn = document.getElementById('tour-wow-prev');
  const nextBtn = document.getElementById('tour-wow-next');
  prevBtn.disabled = factIdx === 0;
  nextBtn.disabled = factIdx === facts.length - 1;
}

// Wow-fact nav buttons
document.getElementById('tour-wow-prev').addEventListener('click', () => {
  if(_tourWowIdx > 0) { _tourWowIdx--; showTourWowFact(TOUR_STOPS[tourStopIdx], _tourWowIdx); }
});
document.getElementById('tour-wow-next').addEventListener('click', () => {
  const facts = TOUR_STOPS[tourStopIdx].wowFacts || [];
  if(_tourWowIdx < facts.length - 1) { _tourWowIdx++; showTourWowFact(TOUR_STOPS[tourStopIdx], _tourWowIdx); }
});

function flyTourCamera(stop, onArrived) {
  let endPos, endLook, trackPlanet = null;

  if(!stop.planetId) {
    // Sun — cinematic close-up: approach from the side, slightly above
    endPos = new THREE.Vector3(8, 5, 14);
    endLook = new THREE.Vector3(0, 0, 0);
  } else {
    const pm = planetMeshes.find(p => p.pdata.id === stop.planetId);
    if(pm) {
      const wpos = new THREE.Vector3();
      pm.group.getWorldPosition(wpos);
      const sz = pm.pdata.size;
      // Get tight close-up: camera sits at ~3.5x planet radius away, slightly
      // above and to the side so the planet fills ~30% of the viewport.
      // Direction: approach from a fixed angle relative to scene center
      const dir = wpos.clone().normalize(); // outward from sun
      const up  = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(dir, up).normalize();
      const dist = Math.max(sz * 4.5, 3.5); // minimum 3.5 units
      endPos = wpos.clone()
        .add(dir.clone().multiplyScalar(dist * 0.7))
        .add(right.clone().multiplyScalar(dist * 0.5))
        .add(new THREE.Vector3(0, dist * 0.35, 0));
      endLook = wpos.clone();
      trackPlanet = pm;
    } else {
      endPos = new THREE.Vector3(0, 28, 55);
      endLook = new THREE.Vector3(0, 0, 0);
    }
  }

  // Lock out user orbit controls during fly so nothing fights the animation
  controls.enabled = false;

  tourCamAnim = {
    startPos: camera.position.clone(),
    startLook: controls.target.clone(),
    endPos,
    endLook,
    progress: 0,
    speed: 0.62,   // ease-out cubic — full fly takes ~1.6s at 60fps
    onArrived,
    arrived: false,
    trackPlanet,
    trackOffset: null
  };
}

// Called from animate() loop — runs whether or not sim is paused
function updateTourCamera(delta) {
  if(!tourCamAnim) return;
  // Belt-and-braces: if the tour ended while an animation was live, drop it
  // rather than keep lerping the camera onto a planet every frame.
  if(!tourActive) { tourCamAnim = null; controls.enabled = true; return; }

  if(!tourCamAnim.arrived) {
    // ── Fly-in phase ──
    tourCamAnim.progress = Math.min(1, tourCamAnim.progress + delta * tourCamAnim.speed);
    // Smooth-in + ease-out: quintic makes the launch feel snappy then decelerates
    const p = tourCamAnim.progress;
    const t = p < 0.5
      ? 16 * p * p * p * p * p                              // ease-in quintic
      : 1 - Math.pow(-2 * p + 2, 5) / 2;                   // ease-out quintic
    camera.position.lerpVectors(tourCamAnim.startPos, tourCamAnim.endPos, t);
    controls.target.lerpVectors(tourCamAnim.startLook, tourCamAnim.endLook, t);
    controls.update();

    if(tourCamAnim.progress >= 1) {
      tourCamAnim.arrived = true;
      // Restore user controls now that we've arrived
      controls.enabled = true;
      if(tourCamAnim.trackPlanet) {
        const wpos = new THREE.Vector3();
        tourCamAnim.trackPlanet.group.getWorldPosition(wpos);
        tourCamAnim.trackOffset = camera.position.clone().sub(wpos);
      }
      if(tourCamAnim.onArrived) tourCamAnim.onArrived();
    }
  } else if(tourCamAnim.trackPlanet) {
    // ── After arrival: keep camera loosely locked to planet ──
    const wpos = new THREE.Vector3();
    tourCamAnim.trackPlanet.group.getWorldPosition(wpos);
    const targetCamPos = wpos.clone().add(tourCamAnim.trackOffset);
    camera.position.lerp(targetCamPos, Math.min(1, delta * 3));
    controls.target.lerp(wpos, Math.min(1, delta * 3));
    controls.update();
  }
}


function showTourTitleCard(title, subtitle, cb, color) {
  const card = document.getElementById('tour-title-card');
  document.getElementById('tour-title-name').textContent = title;
  document.getElementById('tour-title-sub').textContent = subtitle;
  if (color) {
    const hex = color.replace('#','');
    const r = parseInt(hex.slice(0,2),16)||0, g = parseInt(hex.slice(2,4),16)||212, b = parseInt(hex.slice(4,6),16)||255;
    card.style.setProperty('--arrival-color', `${r},${g},${b}`);
  } else {
    card.style.setProperty('--arrival-color', '0,212,255');
  }
  card.classList.add('show');
  setTimeout(() => {
    card.classList.remove('show');
    setTimeout(cb, 700);
  }, 1800);
}

function playTourAmbience() {
  if(!audioCtx) initAudio();
  if(!audioCtx) return;
  audioCtx.resume();
  const t = audioCtx.currentTime;

  tourScoreGain = audioCtx.createGain();
  tourScoreGain.gain.setValueAtTime(0, t);
  tourScoreGain.gain.linearRampToValueAtTime(0.22, t + 3);
  tourScoreGain.connect(audioCtx.destination);

  const reverb = createReverb(audioCtx, 9, 2.8);
  const reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.6;
  reverb.connect(reverbGain);
  reverbGain.connect(tourScoreGain);

  // Slowly evolving Cmaj9 pad — warm, curious, wonder-inspiring
  [65.41, 130.81, 164.81, 196, 246.94, 261.63, 293.66, 329.63, 392].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const filt = audioCtx.createBiquadFilter();
    osc.type = i < 3 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 6;
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(300 + i*50, t);
    filt.frequency.linearRampToValueAtTime(600 + i*50, t + 8);
    filt.Q.value = 0.7;
    g.gain.value = i < 3 ? 0.018 : 0.010;
    const lfo = audioCtx.createOscillator();
    const lfoG = audioCtx.createGain();
    lfo.frequency.value = 0.03 + i * 0.015 + Math.random() * 0.02;
    lfoG.gain.value = 0.003;
    lfo.connect(lfoG); lfoG.connect(g.gain); lfo.start();
    osc.connect(filt); filt.connect(g); g.connect(reverb);
    osc.start(); tourAudioNodes.push(osc, lfo);
  });

  // Gentle stardust shimmer
  [783.99, 1046.5, 1318.5].forEach(freq => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    g.gain.value = 0.003;
    osc.connect(g); g.connect(reverb); osc.start();
    tourAudioNodes.push(osc);
  });
}

function shiftTourMood(mood) {
  if(!audioCtx || !tourScoreGain) return;
  const t = audioCtx.currentTime;
  const gains = {warm:0.22,intense:0.20,dark:0.17,hopeful:0.25,adventurous:0.24,epic:0.28,majestic:0.26,mysterious:0.20,cold:0.16,ethereal:0.19};
  tourScoreGain.gain.linearRampToValueAtTime(gains[mood] || 0.22, t + 2.5);
}

function stopTourAudio() {
  if(tourScoreGain && audioCtx) {
    tourScoreGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
  }
  setTimeout(() => {
    tourAudioNodes.forEach(n => { try { n.stop(); } catch(e){} });
    tourAudioNodes = [];
    tourScoreGain = null;
  }, 2500);
}

window.openTourLightbox = function(src, caption='') {
  openLightboxCarousel([{
    url: resolveMissionPhoto(src, caption),
    title: caption || 'Solar System Reconnaissance',
    caption: caption || 'High-resolution planetary & mission imagery',
    credit: 'NASA / JPL-Caltech / Solar Explorer'
  }], 0);
};

// Tour event listeners
document.getElementById('tour-btn').addEventListener('click', () => {
  closeSideMenu();
  if(tourActive) endTour(); else startTour();
});
document.getElementById('tour-next').addEventListener('click', () => {
  if(tourStopIdx >= TOUR_STOPS.length - 1) {
    tourCompletedCount++;
    checkAchievements();
    endTour();
    return;
  }
  showTourStop(tourStopIdx + 1);
});
document.getElementById('tour-prev').addEventListener('click', () => {
  if(tourStopIdx > 0) showTourStop(tourStopIdx - 1);
});
document.getElementById('tour-exit').addEventListener('click', endTour);

// ─── FLOATING SPACE QUOTES ───────────────────────────────────────────────────
const SPACE_QUOTES = [
  {text: "The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever.", author: "Konstantin Tsiolkovsky"},
  {text: "That's one small step for man, one giant leap for mankind.", author: "Neil Armstrong"},
  {text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan"},
  {text: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson"},
  {text: "For small creatures such as we, the vastness is bearable only through love.", author: "Carl Sagan"},
  {text: "I know the sky is not the limit, because there are footprints on the Moon.", author: "Buzz Aldrin"},
  {text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan"},
  {text: "To confine our attention to terrestrial matters would be to limit the human spirit.", author: "Stephen Hawking"},
  {text: "Space is for everybody. It's not just for a few people in science or math.", author: "Christa McAuliffe"},
  {text: "The Earth is a very small stage in a vast cosmic arena.", author: "Carl Sagan"},
  {text: "In the context of infinity, how can anything be impossible?", author: "Isaac Asimov"},
  {text: "We are all connected to each other biologically, to the earth chemically, to the rest of the universe atomically.", author: "Neil deGrasse Tyson"},
];
let quoteTimer = null;
function startQuoteRotation() {
  const el = document.createElement('div');
  el.id = 'floating-quote';
  el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:80;font-family:Georgia,serif;font-size:13px;color:rgba(160,190,220,.4);text-align:center;max-width:600px;pointer-events:none;opacity:0;transition:opacity 3s ease;letter-spacing:.02em;line-height:1.7';
  document.body.appendChild(el);

  function showQuote() {
    const q = SPACE_QUOTES[Math.floor(Math.random() * SPACE_QUOTES.length)];
    el.innerHTML = `"${q.text}"<br><span style="font-size:10px;color:rgba(120,160,200,.3);letter-spacing:.1em">\u2014 ${q.author}</span>`;
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 12000);
  }
  showQuote();
  quoteTimer = setInterval(showQuote, 25000);
}
// Start quotes 30s after page load
setTimeout(startQuoteRotation, 30000);

// ─── COMET FLYBYS ────────────────────────────────────────────────────────────
let cometMeshes = [];
function createComet() {
  const cometGroup = new THREE.Group();

  // Comet nucleus
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 8),
    new THREE.MeshBasicMaterial({color: 0xccddff})
  );
  cometGroup.add(nucleus);

  // Comet glow
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 12),
    new THREE.MeshBasicMaterial({color: 0x88bbff, transparent: true, opacity: 0.3, side: THREE.BackSide})
  );
  cometGroup.add(glow);

  // Tail — particle trail using line
  const tailGeo = new THREE.BufferGeometry();
  const tailPts = [];
  for(let i = 0; i < 60; i++) {
    tailPts.push(i * 0.3, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05);
  }
  tailGeo.setAttribute('position', new THREE.Float32BufferAttribute(tailPts, 3));
  const tail = new THREE.Line(tailGeo, new THREE.LineBasicMaterial({
    color: 0x6699cc, transparent: true, opacity: 0.35
  }));
  cometGroup.add(tail);

  // Ion tail (blue, straighter)
  const ionGeo = new THREE.BufferGeometry();
  const ionPts = [];
  for(let i = 0; i < 40; i++) {
    ionPts.push(i * 0.5, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
  }
  ionGeo.setAttribute('position', new THREE.Float32BufferAttribute(ionPts, 3));
  const ion = new THREE.Line(ionGeo, new THREE.LineBasicMaterial({
    color: 0x4488ff, transparent: true, opacity: 0.2
  }));
  cometGroup.add(ion);

  // Random hyperbolic-like trajectory
  const angle = Math.random() * Math.PI * 2;
  const inclination = (Math.random() - 0.5) * 0.6;
  const dist = 90 + Math.random() * 30;
  const speed = 0.0003 + Math.random() * 0.0004;

  cometGroup.userData = {
    angle, inclination, dist, speed,
    progress: 0,
    alive: true
  };

  cometGroup.position.set(
    Math.cos(angle) * dist,
    Math.sin(inclination) * 20,
    Math.sin(angle) * dist
  );

  scene.add(cometGroup);
  cometMeshes.push(cometGroup);
}

function updateComets() {
  cometMeshes.forEach(c => {
    if(!c.userData.alive) return;
    c.userData.progress += c.userData.speed;
    const p = c.userData.progress;
    const a = c.userData.angle + p;
    // Parabolic approach and departure
    const r = c.userData.dist * (1 - 0.7 * Math.exp(-p * p * 4));
    c.position.set(
      Math.cos(a) * r,
      Math.sin(c.userData.inclination) * 20 * Math.cos(p * 2),
      Math.sin(a) * r
    );
    // Point tail away from sun
    c.lookAt(0, 0, 0);
    c.rotateY(Math.PI);

    if(p > Math.PI) {
      scene.remove(c);
      c.userData.alive = false;
    }
  });
  cometMeshes = cometMeshes.filter(c => c.userData.alive);
}

// Spawn a comet every 60-120 seconds
setInterval(() => { if(cometMeshes.length < 3) createComet(); }, 60000 + Math.random() * 60000);
// Spawn first comet after 15s
setTimeout(createComet, 15000);

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────────────────────
(function() {
  const PLANET_KEYS = {
    '1':'mercury','2':'venus','3':'earth','4':'mars',
    '5':'jupiter','6':'saturn','7':'uranus','8':'neptune','9':'pluto','0':'sun'
  };
  document.addEventListener('keydown', e => {
    // Don't fire when typing in an input/textarea/select
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    // Skip if quiz modal is open
    if(document.getElementById('quiz-modal').classList.contains('open')) return;
    // Skip while the warp intro or cinematic premiere is playing.
    if(_introActive || _cinActive) return;

    const key = e.key;

    // Planet jump: 0–9
    if(PLANET_KEYS[key]) { openPlanet(PLANET_KEYS[key]); return; }

    switch(key) {
      case 'Escape':
        if(document.getElementById('kb-modal').classList.contains('show')) {
          document.getElementById('kb-modal').classList.remove('show'); return;
        }
        closePanel(); break;
      case 't': case 'T':
        closeSideMenu(); if(tourActive) endTour(); else startTour(); break;
      case 'r': case 'R':
        document.getElementById('rocket-mode-btn').click(); break;
      case 'm': case 'M':
        document.getElementById('menu-btn').click(); break;
      case 'c': case 'C':
        document.getElementById('comparison-toggle').click(); break;
      case 's': case 'S':
        document.getElementById('scale-toggle').click(); break;
      case 'g': case 'G':
        toggleGravityWell(false); break;
      case 'f': case 'F':
        toggleHumanFrontier(); break;
      case 'p': case 'P':
        document.getElementById('tc-play').click();
        showToast(paused ? 'ORBITS PAUSED' : 'ORBITS RESUMED', paused ? 'Press P to resume orbital motion' : 'Simulating planetary orbits', paused ? '⏸' : '▶');
        break;
      case 'a': case 'A':
        document.getElementById('audio-btn').click(); break;
      case 'x': case 'X':
        surpriseMe(); break;
      case '?':
        toggleKbModal(); break;
    }
  });
})();

// ─── KEYBOARD SHORTCUT MODAL ─────────────────────────────────────────────────
function toggleKbModal() {
  document.getElementById('kb-modal').classList.toggle('show');
}
document.getElementById('kb-close-btn').addEventListener('click', ()=>{
  document.getElementById('kb-modal').classList.remove('show');
});
document.getElementById('kb-modal').addEventListener('click', e=>{
  if(e.target === e.currentTarget) document.getElementById('kb-modal').classList.remove('show');
});

// ─── SURPRISE ME ──────────────────────────────────────────────────────────────
function surpriseMe() {
  closeSideMenu();
  const opts = PLANETS.map(p=>p.id);
  const pick = opts[Math.floor(Math.random()*opts.length)];
  openPlanet(pick);
}
document.getElementById('surprise-btn').addEventListener('click', ()=>{ surpriseMe(); });

// ─── AMBIENT SOUND INDICATOR ──────────────────────────────────────────────────
function showAmbientIndicator(label) {
  const ind = document.getElementById('ambient-indicator');
  const lbl = document.getElementById('ambient-label');
  if(!ind || !lbl) return;
  lbl.textContent = label;
  ind.classList.add('show');
  clearTimeout(ind._hideTimer);
  ind._hideTimer = setTimeout(()=>ind.classList.remove('show'), 3500);
}

const _panelObserver = new MutationObserver(() => {
  const panel = document.getElementById('info-panel');
  if(panel.classList.contains('open') && currentPlanet) {
    const pdata = PLANETS.find(p=>p.id===currentPlanet);
    if(pdata) showAmbientIndicator(pdata.name + ' Ambience');
  }
});
_panelObserver.observe(document.getElementById('info-panel'), {attributes:true, attributeFilter:['class']});

// Start animation loop AFTER all state variables are initialized
animate();

// ─── FIRST-RUN TUTORIAL (HINTS) ─────────────────────────────────────────────
(function initHints() {
  const TOTAL_STEPS = 4;
  let hintStep = 0;

  const dotsEl = document.getElementById('hint-dots');
  for(let i = 0; i < TOTAL_STEPS; i++) {
    const d = document.createElement('div');
    d.className = 'hint-dot' + (i === 0 ? ' active' : '');
    d.style.cursor = 'pointer';
    d.addEventListener('click', () => goToStep(i));
    dotsEl.appendChild(d);
  }

  function goToStep(n) {
    document.querySelectorAll('.hint-step').forEach((s, i) => {
      s.classList.toggle('active', i === n);
    });
    document.querySelectorAll('.hint-dot').forEach((d, i) => {
      d.classList.toggle('active', i === n);
    });
    const nextBtn = document.getElementById('hint-next');
    nextBtn.textContent = n === TOTAL_STEPS - 1 ? "Let's Go! 🚀" : 'Next →';
    hintStep = n;
  }

  document.getElementById('hint-next').addEventListener('click', () => {
    if(hintStep < TOTAL_STEPS - 1) {
      goToStep(hintStep + 1);
    } else {
      closeHints();
    }
  });

  document.getElementById('hint-skip').addEventListener('click', closeHints);

  function closeHints() {
    const el = document.getElementById('hint-overlay');
    el.style.opacity = '0';
    setTimeout(() => { el.classList.remove('show'); el.style.opacity = ''; }, 400);
    try { localStorage.setItem('ue_hints_seen', '1'); } catch(e){}
  }

  window.maybeShowHints = function() {
    let seen = false;
    try { seen = localStorage.getItem('ue_hints_seen') === '1'; } catch(e){}
    if(seen) return;
    goToStep(0);
    const el = document.getElementById('hint-overlay');
    el.style.opacity = '';
    el.classList.add('show');
  };

  document.addEventListener('keydown', e => {
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if(document.getElementById('quiz-modal').classList.contains('open')) return;
    if(_introActive || _cinActive) return;
    if(e.key === 'h' || e.key === 'H') {
      const el = document.getElementById('hint-overlay');
      if(el.classList.contains('show')) {
        closeHints();
      } else {
        goToStep(0);
        el.style.opacity = '';
        el.classList.add('show');
      }
    }
  });
})();

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE NARRATION — STRICT ENGLISH-ONLY VOICE FILTER + HUD SELECTOR + DUCKING
// ═══════════════════════════════════════════════════════════════════════════════
let _voiceEnabled = true;
let _bestVoice = null;
let _englishVoices = [];

function _initVoices() {
  if (!window.speechSynthesis) return;
  const selectEl = document.getElementById('voice-select');

  const load = () => {
    const allVoices = window.speechSynthesis.getVoices() || [];
    // STRICT ENGLISH FILTER: Only allow voices whose lang starts with 'en' (en-US, en-GB, en-AU, etc.)
    // and explicitly exclude any voice whose name/lang references Spanish or non-English locales.
    _englishVoices = allVoices.filter(v => {
      if (!v || !v.lang) return false;
      const langNorm = v.lang.replace('_', '-').toLowerCase();
      if (!langNorm.startsWith('en-') && langNorm !== 'en') return false;
      const nameLower = (v.name || '').toLowerCase();
      if (nameLower.includes('spanish') || nameLower.includes('español') || nameLower.includes('helena') || nameLower.includes('sabina') || nameLower.includes('pablo')) return false;
      return true;
    });

    // Priority ranking for natural, expressive English narrator voices
    const prefs = [
      'Microsoft Aria Online (Natural)',
      'Microsoft Sonia Online (Natural)',
      'Microsoft Guy Online (Natural)',
      'Microsoft Jenny Online (Natural)',
      'Microsoft Ryan Online (Natural)',
      'Microsoft Brian Online (Natural)',
      'Microsoft Andrew Online (Natural)',
      'Google UK English Male',
      'Google UK English Female',
      'Google US English',
      'Samantha',
      'Daniel',
      'Alex',
      'Microsoft Zira',
      'Microsoft Mark',
      'Microsoft David'
    ];

    let savedVoiceName = '';
    try { savedVoiceName = localStorage.getItem('ue_voice_name') || ''; } catch(e){}

    let chosen = null;
    if (savedVoiceName) {
      chosen = _englishVoices.find(v => v.name === savedVoiceName) || null;
    }
    if (!chosen) {
      for (const p of prefs) {
        const match = _englishVoices.find(v => v.name.includes(p));
        if (match) { chosen = match; break; }
      }
    }
    // Fallback ONLY within _englishVoices — never fall back to allVoices[0] (which can be Spanish!)
    if (!chosen && _englishVoices.length > 0) {
      chosen = _englishVoices[0];
    }
    _bestVoice = chosen;

    if (selectEl) {
      selectEl.innerHTML = '';
      if (_englishVoices.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '🗣 English AI Voice (Default)';
        selectEl.appendChild(opt);
      } else {
        // Sort natural/online voices to top of dropdown
        const sorted = [..._englishVoices].sort((a, b) => {
          const aNat = /natural|online|google|samantha|daniel/i.test(a.name) ? 0 : 1;
          const bNat = /natural|online|google|samantha|daniel/i.test(b.name) ? 0 : 1;
          if (aNat !== bNat) return aNat - bNat;
          return a.name.localeCompare(b.name);
        });
        sorted.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v.name;
          const cleanName = v.name.replace(/^Microsoft\s+/i, '').replace(/\s+Online\s+\(Natural\)/i, ' ★').replace(/\s*-\s*English.*$/i, '');
          opt.textContent = `🗣 ${cleanName} (${v.lang})`;
          if (_bestVoice && v.name === _bestVoice.name) opt.selected = true;
          selectEl.appendChild(opt);
        });
      }
    }
  };

  if (selectEl) {
    selectEl.addEventListener('change', (e) => {
      const picked = _englishVoices.find(v => v.name === e.target.value);
      if (picked) {
        _bestVoice = picked;
        try { localStorage.setItem('ue_voice_name', picked.name); } catch(err){}
        showToast('Narrator Voice Updated', picked.name, '🗣');
        speakNarration(`Ship AI voice calibrated. Ready to explore the cosmos.`, { rate: 0.96, pitch: 1.0 });
      }
    });
  }

  if (window.speechSynthesis.getVoices().length) load();
  window.speechSynthesis.addEventListener('voiceschanged', load);
}
_initVoices();

function speakNarration(text, opts) {
  if (!_voiceEnabled || !window.speechSynthesis) {
    if (opts && opts.onend) opts.onend();
    return;
  }
  const o = opts || {};
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  // Always enforce English locale so browser never synthesizes with a Spanish accent
  if (_bestVoice) {
    utt.voice = _bestVoice;
    utt.lang = _bestVoice.lang || 'en-US';
  } else {
    utt.lang = 'en-US';
  }
  utt.rate   = o.rate   !== undefined ? o.rate   : 0.92;
  utt.pitch  = o.pitch  !== undefined ? o.pitch  : 0.96;
  utt.volume = o.volume !== undefined ? o.volume : 0.95;

  // Duck background music by 80% while voiceover speaks
  setMusicDuck(true);

  utt.onend = () => {
    setMusicDuck(false);
    if (o.onend) o.onend();
  };
  utt.onerror = () => {
    setMusicDuck(false);
    if (o.onerror) o.onerror();
  };
  window.speechSynthesis.speak(utt);
  return utt;
}

function stopNarration() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  setMusicDuck(false);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIRST-PERSON "HEAR ME SPEAK" PLANETS, MOONS, MISSIONS & HUMAN FRONTIER
// Tailored dynamically to the selected Explorer Tier (kids / cadet / director)
// ═══════════════════════════════════════════════════════════════════════════════
const PLANET_VOICES = {
  sun: {
    rate: 0.86, pitch: 0.78,
    tiers: {
      kids: [
        "Hi there, young explorer! I am the Sun, the giant glowing star right in the middle of our solar system! I'm so huge that one point three million planet Earths could fit inside my belly. Every single second, I squeeze hydrogen gas together in my core to make the warm sunshine that lights up your day, grows every tree and flower on Earth, and keeps all the planets cozy in my gravity hug!",
        "Want to hear a cool secret about me? The sunlight tickling your face right now actually left my surface eight minutes and twenty seconds ago! That means whenever you look at daylight, you are literally looking back in time. And look closely at the glowing magnetic loops dancing around my surface—each one of those fiery arches is taller than ten Earths stacked on top of each other!",
        "Even though I look like a ball of fire, I'm actually made of super-heated glowing plasma, and my outer crown—called my corona—is mysteriously hundreds of times hotter than my surface! NASA even built a super-brave spacecraft called the Parker Solar Probe with a special carbon-armor shield that dives right through my glowing crown at six hundred and ninety thousand kilometers an hour!"
      ],
      cadet: [
        "Greetings, Space Cadet. I am the Sun—a G-type main-sequence yellow dwarf star containing ninety-nine point eight-six percent of all the mass in the entire solar system. Deep inside my fifteen-million-degree core, I fuse six hundred and twenty million metric tons of hydrogen into helium every single second, converting four million tons of pure matter directly into radiant energy via Einstein's E equals M C squared.",
        "Notice those silent, glowing arches of plasma looping across my surface? Those are magnetic coronal loops. Because I am a spinning sphere of ionized plasma rather than solid rock, my equator rotates faster than my poles—once every twenty-five days versus thirty-five days near the poles. That differential rotation twists my magnetic field lines until they snap and arch hundreds of thousands of kilometers into space.",
        "Here is a puzzle that still challenges solar physicists: my visible surface, the photosphere, is about five thousand five hundred degrees Celsius, yet my outer atmosphere—the corona—soars past two million degrees! NASA's Parker Solar Probe and ESA's Solar Orbiter are diving right through my corona to discover how magnetic waves and nanoflares superheat my outer crown."
      ],
      director: [
        "Welcome, Mission Director. I am Sol, a Population I G2V main-sequence star at the gravitational barycenter of this planetary system. My core operates at a hydrostatic equilibrium pressure of two hundred and fifty billion atmospheres and a temperature of fifteen point seven million Kelvin, driving the proton-proton fusion chain at a luminosity of three point eight-two-eight times ten to the twenty-sixth watts.",
        "A photon generated in my core undergoes a random walk through my radiative zone—scattering off free electrons and protons for roughly one hundred and seventy thousand years—before reaching my convective zone, surfacing at the photosphere, and crossing one Astronomical Unit to Earth in just four hundred and ninety-nine seconds.",
        "My heliosphere extends well beyond a hundred Astronomical Units, inflated by a supersonic magnetohydrodynamic solar wind streaming at four hundred to eight hundred kilometers per second. Studying my eleven-year magnetic polarity cycle and Alfven-wave coronal heating is critical for protecting humanity's deep-space astronauts and orbital infrastructure."
      ]
    }
  },
  mercury: {
    rate: 1.04, pitch: 1.12,
    tiers: {
      kids: [
        "Hey! Down here! I'm Mercury, the smallest planet and the fastest runner in the whole solar system! Because I orbit right next to the giant Sun, I zoom all the way around it in just eighty-eight Earth days. If you lived on me, you'd get to celebrate your birthday four times for every single year on Earth!",
        "You might think I'm the hottest planet since I'm closest to the Sun, but Venus actually beats me! That's because I don't have a fluffy blanket of air to trap the heat. During the day my rocks bake at four hundred and thirty degrees, and at night I freeze at minus one hundred and eighty degrees—the biggest temperature roller-coaster in the solar system!",
        "Want to know my coolest surprise? Even though I sit right next to the blazing Sun, I have real water ice hiding at my north and south poles! Deep inside shadowy craters where sunlight never ever touches, ancient comets left behind billions of tons of frozen ice!"
      ],
      cadet: [
        "Hi there, Cadet! I'm Mercury, the innermost terrestrial planet. With an average orbital velocity of forty-seven kilometers per second, I whip around the Sun in eighty-eight days. Curiously, I'm locked in a three-to-two spin-orbit resonance: I rotate on my axis exactly three times for every two orbits around the Sun, so a single sunrise-to-sunrise solar day on my surface lasts one hundred and seventy-six Earth days!",
        "If you sliced me open, you'd find a massive surprise: my metallic iron-nickel core makes up eighty-five percent of my entire radius! Planetary scientists believe a giant protoplanet slammed into me billions of years ago, stripping away most of my rocky mantle and leaving behind an exposed iron powerhouse that still generates a magnetic field.",
        "Look at my giant Caloris Basin—an impact crater one thousand five hundred and fifty kilometers wide. The asteroid that carved it hit me so hard that the seismic shockwaves focused on the exact opposite side of my globe, jumbling the crust into a wild mountain maze called the Weird Terrain!"
      ],
      director: [
        "Greetings, Director. I am Mercury, an anomalous high-density silicate-iron world with an uncompressed density of five point three grams per cubic centimeter. My core-to-mantle ratio is the highest of any planet in the system; my partially molten iron-sulfide core spans roughly two thousand and twenty kilometers of my two thousand four hundred and forty kilometer radius, sustaining a dipolar magnetosphere about one percent as strong as Earth's.",
        "As my interior secularly cooled over the past four billion years, my global radius contracted by up to seven kilometers, buckling my single-plate lithosphere into lobate thrust scarps over three kilometers high. Meanwhile, radar telemetry from MESSENGER confirmed thick deposits of water ice and dark organic volatiles cold-trapped in permanently shadowed polar craters.",
        "Because of my deep position in the Sun's gravitational well and forty-sevenpoint-four kilometer-per-second orbital velocity, reaching low Mercury orbit requires more delta-v than reaching Pluto—demanding multiple gravity assists across Earth, Venus, and Mercury itself, as executed by MESSENGER and ESA/JAXA's BepiColombo."
      ]
    }
  },
  venus: {
    rate: 0.92, pitch: 1.02,
    tiers: {
      kids: [
        "Hello, explorer! I'm Venus! From Earth's backyard, I shine like the brightest, prettiest jewel in the evening sky. People call me Earth's twin sister because we're almost the exact same size—but under my golden clouds, I am a wild, super-hot volcano world!",
        "My thick blanket of carbon dioxide gas traps so much heat that my surface is four hundred and sixty-five degrees Celsius, day and night—hot enough to melt lead! And my clouds don't rain water; they rain drops of sulfuric acid that sizzle and evaporate before they even touch my rocky ground!",
        "Even funnier, I spin completely backwards compared to almost every other planet, and I spin so slowly that my day is actually longer than my whole year! If you stood on my surface, you would watch the Sun rise in the west and set in the east!"
      ],
      cadet: [
        "Greetings, Cadet. I am Venus, Earth's sister planet in size and mass, but a dramatic lesson in runaway greenhouse physics. My atmosphere is ninety-six point five percent carbon dioxide, creating a surface pressure of ninety-two atmospheres—the exact crushing pressure you'd feel nine hundred meters deep in Earth's oceans.",
        "Because of that super-dense greenhouse blanket, I am hotter than Mercury at four hundred and sixty-five degrees Celsius across my entire globe, poles included. Even though my retrograde rotation takes two hundred and forty-three Earth days, my upper cloud deck races around the planet in just four days, driven by three-hundred-and-sixty kilometer-per-hour super-rotating winds.",
        "Soviet Venera landers braved my furnace in the nineteen-seventies and eighties, surviving just long enough to photograph flat basaltic rock slabs under an eerie orange sky. Soon, NASA's DAVINCI and VERITAS missions will plunge through my clouds to see if my giant shield volcanoes, like Maat Mons, are still erupting today!"
      ],
      director: [
        "Welcome, Director. I am Venus—a terrestrial world with a radius of six thousand and fifty-two kilometers and a surface governed by a supercritical carbon dioxide atmosphere at ninety-two bar and seven hundred and thirty-seven Kelvin. Early in solar system history, solar irradiance likely evaporated my primordial oceans; photolysis stripped the hydrogen via hydrodynamic escape, leaving a desiccated lithosphere and locking carbon dioxide in the atmosphere rather than carbonate rock.",
        "Lacking plate tectonics, my mantle heat appears to escape through episodic global resurfacing events and massive shield volcanism. Re-analysis of Magellan synthetic aperture radar data recently revealed morphological changes in a volcanic vent on Maat Mons over an eight-month window—the strongest evidence yet of active present-day volcanism.",
        "While my surface is hostile to silicon electronics, the atmospheric layer between fifty and sixty kilometers altitude enjoys approximately one bar pressure and temperatures of twenty to thirty degrees Celsius, making high-altitude aerostats a compelling architecture for future exploration."
      ]
    }
  },
  earth: {
    rate: 0.95, pitch: 1.0,
    tiers: {
      kids: [
        "Hi there! I'm Earth—your home, and the most special world we know of in the whole universe! Out of all the planets and moons circling the Sun, I'm the only one with splashing blue oceans, green forests, fluffy white water clouds, and billions of living creatures—including you!",
        "Seventy-one percent of my surface is covered in liquid water, which makes me glow like a bright blue marble from space. And deep inside my belly, a spinning ball of liquid iron creates an invisible magnetic superhero shield that bounces away dangerous solar storms and paints glowing green auroras across my polar skies!",
        "Look right beside me at my partner, the Moon! It's huge compared to me, and its gentle gravity pulls on my oceans to make the tides go in and out every day, while keeping my spin steady so you get nice, gentle seasons!"
      ],
      cadet: [
        "Welcome home, Space Cadet. I am Earth, orbiting right inside the Sun's habitable Goldilocks Zone at one Astronomical Unit—one hundred and fifty million kilometers out—where water can exist simultaneously as liquid oceans, polar ice caps, and atmospheric vapor.",
        "Unlike every other rocky planet in our solar system, my outer crust is broken into giant tectonic plates that float and recycle on my hot mantle. Plate tectonics acts as a planetary thermostat, cycling carbon over millions of years, while photosynthetic life transformed my atmosphere into twenty-one percent breathable oxygen.",
        "Right now, human civilization is expanding from my surface into low Earth orbit and beyond. Look closely at my orbital neighborhood—you can spot the International Space Station streaking overhead at twenty-eight thousand kilometers per hour!"
      ],
      director: [
        "Greetings, Mission Director. I am Terra—the largest and densest of the inner terrestrial planets, with a mean density of five point five-one grams per cubic centimeter. My geodynamo, driven by Coriolis-organized convection in my liquid iron-nickel outer core, sustains a magnetosphere that deflects the solar wind at a magnetopause standoff distance of roughly ten Earth radii.",
        "My biosphere and geosphere form a tightly coupled disequilibrium system: the carbonate-silicate geochemical cycle and plate subduction regulate atmospheric carbon dioxide over geological timescales, while oxygenic photosynthesis maintains a twenty-one percent dioxygen atmosphere and a stratospheric ozone layer that screens ultraviolet radiation.",
        "My anomalously large Moon—formed via the Theia giant impact four point five billion years ago—stabilizes my axial obliquity between twenty-two point one and twenty-four point five degrees, preventing the chaotic climate swings experienced by Mars."
      ]
    }
  },
  mars: {
    rate: 0.93, pitch: 0.90,
    tiers: {
      kids: [
        "Greetings, explorer! I'm Mars, the famous Red Planet! My dirt and rocks are covered in rusty iron dust, which makes my whole world glow red and orange—and even makes my daytime sky look butterscotch pink and my sunsets glow bright blue!",
        "I may be half the size of Earth, but I have the biggest volcano in the entire solar system! It's called Olympus Mons, and it's three times taller than Mount Everest! I also have a canyon called Valles Marineris that is so long it would stretch all the way across the United States from New York to California!",
        "Right now, I am the only planet in the solar system inhabited entirely by robots! NASA's Perseverance and Curiosity rovers are rolling across my ancient dried-up lakebeds looking for clues of tiny Martian microbes that might have lived in my rivers billions of years ago!"
      ],
      cadet: [
        "Hey there, Cadet! I am Mars, the fourth planet from the Sun. A day on my surface—called a Sol—lasts twenty-four hours and thirty-nine minutes, almost identical to Earth's! Even my axial tilt is twenty-five degrees, giving me four distinct seasons, though my year is nearly twice as long at six hundred and eighty-seven Earth days.",
        "Three and a half billion years ago, I had a thicker atmosphere, rushing rivers, crater lakes, and likely a northern ocean. Because I'm smaller than Earth, my interior cooled faster, my magnetic dynamo shut down, and the solar wind stripped away ninety-nine percent of my air—leaving a thin carbon dioxide atmosphere and freezing my water underground.",
        "In Jezero Crater, NASA's Perseverance rover and the Ingenuity Mars Helicopter—which completed seventy-two powered flights in air just one percent as thick as Earth's—have been exploring an ancient river delta and sealing rock cores for future return to Earth!"
      ],
      director: [
        "Welcome, Mission Director. I am Mars, a differentiated terrestrial world with a surface gravity of zero point three-eight G and a mean surface atmospheric pressure of six point one millibars—right near the triple point of water. Without active plate tectonics to drift my crust over mantle plumes, basaltic hotspot volcanism built the Tharsis Rise and Olympus Mons, a twenty-one point nine kilometer shield volcano.",
        "Orbital spectroscopy and rover geochemistry confirm a Noachian epoch rich in phyllosilicates, sulfates, and fluvial deltaic stratigraphy, followed by a transition to arid Amazonian conditions as my core dynamo ceased roughly four billion years ago and sputtering by the solar wind eroded my volatile inventory.",
        "With abundant subsurface water ice and atmospheric carbon dioxide available for Sabatier in-situ propellant production of liquid methane and oxygen, I am the primary interplanetary target for human surface architectures."
      ]
    }
  },
  jupiter: {
    rate: 0.80, pitch: 0.65,
    tiers: {
      kids: [
        "BOOM! Hello, little explorer! I am Jupiter, the king of the planets! I am so gigantic that you could take every single other planet in the solar system, squish them all together into one ball, and I would still be more than twice as big as all of them combined!",
        "I don't have any solid ground to stand on—I'm a giant swirling ball of hydrogen and helium gas! Look at that giant red oval on my belly: that's the Great Red Spot, a super-hurricane bigger than the entire planet Earth that has been spinning non-stop for over three hundred and fifty years!",
        "I'm also the big brother who protects Earth! My superpower gravity acts like a cosmic vacuum cleaner, catching or flinging away dangerous comets and asteroids before they can bonk into the inner planets. Plus, I have ninety-five moons—including Europa, which hides a giant salty ocean under its icy shell!"
      ],
      cadet: [
        "Greetings, Space Cadet. I am Jupiter, the largest gas giant in the solar system, with three hundred and eighteen times the mass of Earth and eleven times its diameter. Even though I'm enormous, I spin faster than any other planet—completing a full rotation in just nine hours and fifty-five minutes, which flattens my poles and stretches my clouds into高速 jet-stream bands.",
        "Deep beneath my ammonia cloud tops, the weight of my atmosphere crushes hydrogen gas until it turns into liquid metallic hydrogen—an exotic electrically conducting fluid that generates a magnetosphere twenty thousand times stronger than Earth's, stretching all the way past Saturn's orbit!",
        "My four Galilean moons—Io, Europa, Ganymede, and Callisto—are like a miniature solar system of their own. Io is covered in four hundred erupting volcanoes, Ganymede is larger than the planet Mercury, and Europa hides a global liquid ocean containing twice as much water as all of Earth's oceans combined!"
      ],
      director: [
        "Welcome, Director. I am Jupiter, a gas giant comprising seventy-five percent hydrogen and twenty-four percent helium by mass, totaling one point eight-nine-eight times ten to the twenty-seventh kilograms—roughly one-thousandth of a solar mass. My rapid nine-hour-fifty-five-minute rotation drives banded zonal jets and anticyclonic vortices like the Great Red Spot, while Kelvin-Helmholtz contraction causes me to radiate nearly twice as much infrared energy as I receive from the Sun.",
        "At pressures exceeding two megabars inside my interior, molecular hydrogen undergoes a phase transition into liquid metallic hydrogen, powering a dynamo with an equatorial magnetic field of four point two Gauss and trapping relativistic electrons in lethal radiation belts.",
        "Meanwhile, Laplace orbital resonance among Io, Europa, and Ganymede—locked in a four-to-two-to-one period ratio—pumps tidal dissipation into their interiors, driving Io's silicate volcanism and maintaining Europa's subsurface ocean."
      ]
    }
  },
  saturn: {
    rate: 0.86, pitch: 0.78,
    tiers: {
      kids: [
        "Greetings, star traveler! I am Saturn, the jewel of the solar system! Everyone knows me for my dazzling rings, which stretch almost as far as the distance from Earth to the Moon—but did you know they are made of billions of sparkling chunks of pure water ice and frosty rock, spinning around me like a giant cosmic skating rink?",
        "Here's a silly fact about me: even though I'm the second-biggest planet and could hold seven hundred and sixty-four Earths inside me, I'm made of such light, fluffy gases that I'm lighter than water! If you could build a bathtub big enough to hold me, I would float right on top like a giant rubber ducky!",
        "I also have a hundred and forty-six moons! My giant moon Titan has yellow clouds, rain, rivers, and lakes made of liquid methane, and my little icy moon Enceladus shoots giant fountains of ocean water straight into space from cracks at its south pole!"
      ],
      cadet: [
        "Hello, Cadet! I am Saturn. My ring system spans two hundred and eighty-two thousand kilometers across, yet in most places it is only ten meters thick—thinner than a three-story building! If you made a scale model of my rings out of paper, the paper would have to be ten thousand times thinner than a razor blade.",
        "At my north pole sits one of the weirdest sights in the solar system: a six-sided jet stream called the Hexagon, thirty thousand kilometers wide—wider than two Earths—spinning steadily with a massive hurricane eye right at its center!",
        "For thirteen years, the Cassini spacecraft orbited through my system and dropped the Huygens probe onto my moon Titan. Cassini also flew directly through the icy geyser plumes erupting from my moon Enceladus, detecting water, salt, organic molecules, and molecular hydrogen—all the key ingredients for microbial life!"
      ],
      director: [
        "Welcome, Mission Director. I am Saturn, an oblate gas giant with a mean density of zero point six-eight-seven grams per cubic centimeter—the lowest of any planet in the solar system. My main ring system, extending from seven thousand to eighty thousand kilometers above my equatorial cloud deck, consists of ninety-nine percent pure water-ice particles ranging from microns to meters, sculpted by Lindblad resonances and shepherd satellites.",
        "Cassini Grand Finale gravity measurements revealed that my rings have a mass equivalent to roughly forty percent of Mimas and likely formed just one hundred to four hundred million years ago when aicy progenitor satellite wandered inside my Roche limit and was tidally disrupted.",
        "In my satellite system, Titan hosts a one point five bar nitrogen-methane atmosphere with a full cryogenic hydrocarbon hydrological cycle, while Enceladus vents alkaline hydrothermal plumes from a global subsurface ocean, making both worlds premier astrobiological targets."
      ]
    }
  },
  uranus: {
    rate: 0.89, pitch: 0.85,
    tiers: {
      kids: [
        "Whoa—hello there! I'm Uranus, the sideways ice giant! While all the other planets spin like tops, something gigantic bumped into me billions of years ago and knocked me completely onto my side! So I roll around the Sun like a giant blue-green bowling ball!",
        "Because I'm tilted on my side, my seasons are totally wacky: my north pole gets forty-two years of non-stop summer sunshine while my south pole gets forty-two years of freezing winter night! Even my thirteen faint rings and my twenty-seven moons orbit me up-and-down like a Ferris wheel!",
        "Even though Neptune is farther from the Sun than I am, I hold the record for the coldest temperatures on any planet—minus two hundred and twenty-four degrees Celsius! And deep inside my icy belly, the squeezing pressure is so strong that it literally rains real sparkling diamonds!"
      ],
      cadet: [
        "Greetings, Cadet. I am Uranus, the seventh planet from the Sun and the first of the two Ice Giants. Unlike Jupiter and Saturn, which are mostly hydrogen and helium, most of my mass is a hot, dense fluid mantle of water, ammonia, and methane ices—and it's that methane gas in my upper atmosphere absorbing red light that gives me my pale cyan color.",
        "My axial tilt is a staggering ninety-seven point eight degrees, meaning my rotational axis lies almost flat in my orbital plane. Even stranger, my magnetic field is tilted fifty-nine degrees away from my spin axis and doesn't even pass through my center, making my magnetosphere wobble like a corkscrew every seventeen hours!",
        "All twenty-seven of my moons are named after characters from William Shakespeare and Alexander Pope. My moon Miranda looks like a jigsaw puzzle—with Verona Rupes, an ice cliff twenty kilometers high where a falling rock would take twelve minutes to hit the bottom!"
      ],
      director: [
        "Greetings, Director. I am Uranus, an ice giant of fourteen point five Earth masses whose interior is dominated by a supercritical ionic water-ammonia-methane mantle surrounding a rocky core. Uniquely among the giant planets, I exhibit virtually zero internal heat flux in thermal infrared—making my tropopause the coldest planetary atmosphere in the solar system at forty-nine Kelvin.",
        "My extreme ninety-seven point七-seven degree obliquity—likely the result of one or more giant impacts during late accretion—produces an extreme seasonal insolation cycle across my eighty-four-year orbit, while my non-dipolar, offset magnetosphere (tilted fifty-nine degrees and shifted by a third of my radius) indicates dynamo generation in a thin, convecting ionic-water shell.",
        "Only Voyager 2 has ever visited me during its January nineteen-eighty-six flyby; a flagship Uranus Orbiter and Probe has now been designated the highest-priority planetary science mission for the coming decade."
      ]
    }
  },
  neptune: {
    rate: 0.87, pitch: 0.80,
    tiers: {
      kids: [
        "Hello from the deep blue outer solar system! I am Neptune, the eighth and farthest major planet from the Sun! Out here, the Sun looks like a tiny, super-bright star, and it takes me one hundred and sixty-five Earth years just to make one single trip around it!",
        "Don't let my calm ocean-blue color fool you—I have the wildest weather and the fastest winds in the whole solar system! My winds scream at over two thousand one hundred kilometers an hour, which is faster than a supersonic jet plane!",
        "Do you know how humans discovered me? With math! Before anyone ever saw me in a telescope, mathematicians noticed my neighbor Uranus was wobbling, calculated that an invisible planet's gravity was tugging on it, and pointed a telescope right at the exact spot where I was hiding!"
      ],
      cadet: [
        "Welcome to the outer frontier, Cadet. I am Neptune, orbiting thirty times farther from the Sun than Earth—four point five billion kilometers out! Sunlight takes over four hours to reach me, and it's nine hundred times dimmer here than on Earth, yet my internal heat powers supersonic methane storms and giant dark vortices.",
        "In eighteen forty-six, mathematician Urbain Le Verrier predicted my exact position using only pencil, paper, and Newton's laws of gravity to explain perturbations in Uranus's orbit. When astronomers in Berlin pointed their telescope where his equations said to look, they found me on the very first night—less than one degree away!",
        "Look at my largest moon, Triton: it orbits me backwards in a retrograde path! That proves Triton was once a free-roaming dwarf planet from the Kuiper Belt—a cousin of Pluto—that my gravity captured billions of years ago. Voyager 2 even spotted nitrogen ice geysers erupting eight kilometers high on Triton's freezing surface!"
      ],
      director: [
        "Welcome, Mission Director. I am Neptune, the outermost ice giant at thirty point one Astronomical Units, with a mass of seventeen point one-five Earths and a density of one point six-four grams per cubic centimeter. Unlike Uranus, I radiate two point six-one times more thermal energy than I receive from solar insolation, driving supersonic zonal winds that reach two thousand one hundred kilometers per hour.",
        "High-pressure diamond-anvil cell experiments indicate that within my mantle—at pressures of ten to fifty gigapascals and temperatures of several thousand Kelvin—methane dissociates into diamond crystals that precipitate downward as diamond rain, releasing gravitational potential energy that helps power my atmospheric dynamics.",
        "My largest satellite, Triton, occupies a decaying retrograde, highly inclined orbit—clear dynamical evidence of gravitational capture from the Kuiper Belt—and exhibits active cryovolcanic nitrogen plumes above a likely subsurface ammonia-water ocean."
      ]
    }
  },
  pluto: {
    rate: 1.0, pitch: 1.14,
    tiers: {
      kids: [
        "Hi! Don't forget about me! I'm Pluto, the king of the Kuiper Belt at the icy edge of our solar system! For seventy-six years people called me the ninth planet, and now I'm the most famous dwarf planet—and when NASA's New Horizons spacecraft flew past me in twenty-fifteen, I surprised the whole world!",
        "Right on my chest, I have a giant, bright, heart-shaped glacier made of frozen nitrogen ice called Tombaugh Regio—wider than the state of Texas! And right next to my heart are mountains made of rock-hard frozen water ice as tall as the Rocky Mountains, all under a real, glowing blue sky!",
        "My best friend is my big moon Charon! Charon is half as wide as I am, so instead of Charon just circling me, we hold hands with gravity and spin around each other like figure skaters, always facing each other!"
      ],
      cadet: [
        "Hey there, Cadet! I'm Pluto, orbiting in the Kuiper Belt between thirty and forty-nine Astronomical Units from the Sun. For eighty-five years after Clyde Tombaugh discovered me in nineteen-thirty, I was just a blurry pixel even in the Hubble Space Telescope—until NASA's New Horizons probe raced across five billion kilometers to fly past me in July twenty-fifteen!",
        "Everyone expected a cold, dead, cratered iceball. Instead, New Horizons revealed a geologically alive world! The left lobe of my giant heart—Sputnik Planitia—is a four-kilometer-deep basin of convecting nitrogen ice that slowly bubbles and renews its surface like a cosmic lava lamp, with zero impact craters!",
        "My largest moon Charon is so massive relative to me—one-eighth of my mass—that our center of gravity, the barycenter, actually sits in empty space outside my surface! We are a true binary dwarf planet system, tidally locked face-to-face forever."
      ],
      director: [
        "Greetings, Mission Director. I am Pluto, the largest known trans-Neptunian object by volume in the Kuiper Belt, locked in a stable two-to-three mean-motion orbital resonance with Neptune across a two-hundred-and-forty-eight-year elliptical orbit. New Horizons telemetry revolutionized outer-system planetology by demonstrating active endogenic geology on a body just two thousand three hundred and seventy-seven kilometers in diameter.",
        "Sputnik Planitia is a volatile reservoir of solid nitrogen, carbon monoxide, and methane ices undergoing Rayleigh-Benard thermal convection on timescales of five hundred thousand years, bounded by three-point-five-kilometer water-ice massifs and possible cryovolcanic edifices such as Wright and Piccard Mons.",
        "Thermal evolution models and extensional tectonic graben across my lithosphere strongly indicate that a liquid water ocean, stabilized by ammonia antifreeze and radiogenic heating, still persists beneath my icy shell today."
      ]
    }
  },
  // ─── MAJOR MOONS ───
  moon_themoon: {
    rate: 0.94, pitch: 0.95,
    tiers: {
      kids: [
        "Hi there! I'm Earth's Moon—your closest neighbor in space! I'm the only other world in the universe where human beings have actually walked, driven moon buggies, and left footprints in my gray dust! Because I have no wind or rain, the footprints Neil Armstrong and Buzz Aldrin made in nineteen sixty-nine are still sitting there today!",
        "Have you ever noticed you always see the exact same face of me from your bedroom window? That's because I spin once in the exact same time it takes me to circle Earth—about twenty-seven days—so I'm always looking right back at you!"
      ],
      cadet: [
        "Greetings, Cadet. I am Luna, Earth's natural satellite, orbiting three hundred and eighty-four thousand kilometers away. Four point five billion years ago, a Mars-sized protoplanet named Theia slammed into the young Earth, blasting a ring of molten rock into orbit that coalesced to form me!",
        "Between nineteen sixty-nine and nineteen seventy-two, twelve Apollo astronauts explored my basaltic maria and highlands, bringing back three hundred and eighty-two kilograms of lunar rock. Soon, NASA's Artemis astronauts will land near my south pole, where permanently shadowed craters hold millions of tons of water ice!"
      ],
      director: [
        "Welcome, Director. I am Luna—an anomalously large satellite at one-quarter Earth's diameter and one-eightieth its mass. Oxygen isotope ratios in Apollo regolith samples are virtually indistinguishable from Earth's mantle, confirming our shared origin in the giant Theia impact.",
        "Through tidal dissipation, I am receding from Earth at three point eight centimeters per year while lengthening Earth's day. My south polar Shackleton and Faustini rims offer near-continuous solar illumination adjacent to cold-trapped water ice, forming the cornerstone of cislunar logistics."
      ]
    }
  },
  moon_io: {
    rate: 0.98, pitch: 1.05,
    tiers: {
      kids: [
        "Watch your step! I'm Io, Jupiter's pizza-colored volcano moon! Jupiter's giant gravity and my sister moons pull and squeeze my insides like a rubber ball until I melt inside—giving me over four hundred active volcanoes shooting fountains of lava hundreds of kilometers into space!"
      ],
      cadet: [
        "Hi Cadet! I'm Io, the most volcanically active body in the solar system. Caught in a gravitational tug-of-war between massive Jupiter and my neighboring moons Europa and Ganymede, my solid rock surface flexes up and down by one hundred meters every orbit, pumping tidal heat into my magma ocean!"
      ],
      director: [
        "Greetings, Director. I am Io. Laplace orbital resonance with Europa and Ganymede maintains my orbital eccentricity at zero point zero-zero-four-one, generatingnearly one hundred terawatts of tidal dissipation and driving high-temperature silicate volcanism and sulfur dioxide plumes across my surface."
      ]
    }
  },
  moon_europa: {
    rate: 0.92, pitch: 1.04,
    tiers: {
      kids: [
        "Hello, explorer! I'm Europa, Jupiter's icy ocean moon! My outside is a smooth shell of frozen ice crisscrossed with reddish cracks, but underneath my ice I hide a giant, dark, salty liquid water ocean with twice as much water as all of Earth's oceans put together! Could alien fish or glowing microbes be swimming inside me right now?"
      ],
      cadet: [
        "Greetings, Cadet. I am Europa. Beneath my fifteen-to-twenty-five-kilometer ice crust lies a global liquid saltwater ocean a hundred kilometers deep, kept warm by Jupiter's tidal flexing. NASA's Europa Clipper spacecraft is on its way to scan my ice shell and check if my ocean has everything life needs!"
      ],
      director: [
        "Welcome, Director. I am Europa. Induced magnetic field measurements from the Galileo spacecraft confirmed a globally conductive subsurface saltwater ocean beneath my fractured cryosphere, making me one of the highest-priority astrobiological targets in the solar system."
      ]
    }
  },
  moon_ganymede: {
    rate: 0.86, pitch: 0.84,
    tiers: {
      kids: [
        "Hello! I'm Ganymede, the biggest moon in the entire solar system! I'm so huge that I'm actually bigger than the planet Mercury—and I'm the only moon with my very own magnetic shield that makes glowing auroras dance at my poles!"
      ],
      cadet: [
        "Greetings, Cadet. I am Ganymede, Jupiter's largest moon at five thousand two hundred and sixty-eight kilometers across. I have a liquid iron core that generates my own magnetosphere, and Hubble observations of my auroras revealed a massive underground saltwater ocean sandwiched between layers of ice!"
      ],
      director: [
        "Greetings, Director. I am Ganymede—a fully differentiated satellite with an iron-sulfide core, silicate mantle, and multi-phase ice-ocean hydrosphere, currently targeted for orbital insertion by ESA's JUICE mission."
      ]
    }
  },
  moon_callisto: {
    rate: 0.88, pitch: 0.88,
    tiers: {
      kids: [
        "Hi there! I'm Callisto, Jupiter's outermost giant moon! My icy surface is covered in billions of sparkling craters like a cosmicdisco ball, and because I orbit safely outside Jupiter's strongest radiation, astronauts might build a future space base right on my surface!"
      ],
      cadet: [
        "Hello Cadet. I am Callisto, holding the oldest, most heavily cratered surface in the solar system—including Valhalla, a multi-ring impact basin four thousand kilometers wide. Because I sit outside Jupiter's main radiation belt, I'm the safest basecamp for future human missions to the Jovian system!"
      ],
      director: [
        "Welcome, Director. I am Callisto—a partially differentiated ice-rock world in a low-radiation environment at twenty-six Jovian radii, harboring a potential electrolyte-rich subsurface ocean."
      ]
    }
  },
  moon_titan: {
    rate: 0.88, pitch: 0.90,
    tiers: {
      kids: [
        "Hello through the golden mist! I'm Titan, Saturn's giant moon! I'm the only moon in the solar system with thick, fluffy clouds and real rain, rivers, and lakes—except it's so freezing cold here that my lakes aren't made of water, they're made of liquid methane and ethane gas! And NASA is building a nuclear-powered flying drone called Dragonfly to hop across my dunes!"
      ],
      cadet: [
        "Greetings, Cadet! I am Titan, larger than the planet Mercury and wrapped in a golden nitrogen atmosphere fifty percent denser than Earth's! In two thousand and five, the Huygens probe parachuted through my haze and landed on a floodplain littered with rounded water-ice pebbles, right beside seas of liquid methane like Kraken Mare."
      ],
      director: [
        "Welcome, Director. I am Titan—the only satellite with a dense nitrogen-methane atmosphere (one point four-five bar at ninety-four Kelvin) and an active surface hydrocarbon hydrological cycle, soon to be explored by NASA's rotorcraftlander Dragonfly."
      ]
    }
  },
  moon_enceladus: {
    rate: 0.98, pitch: 1.12,
    tiers: {
      kids: [
        "Wheee! Hi explorer! I'm Enceladus, Saturn's shiny snowball moon! My icy surface reflects almost all the sunlight like fresh snow, and from warm Tiger Stripe cracks at my south pole, I shoot giant geysers of salty ocean water and ice crystals hundreds of kilometers into space—building Saturn's outer E-ring!"
      ],
      cadet: [
        "Hi Cadet! I'm Enceladus. Even though I'm only five hundred kilometers wide—small enough to fit inside the United Kingdom—I hide a warm, global subsurface ocean with hydrothermal vents on my seafloor! When Cassini flew right through my south-polar water plumes, it tasted water, salts, silica nanograins, and organic molecules!"
      ],
      director: [
        "Greetings, Director. I am Enceladus. Cryovolcanic jets erupting from my south polar terrain vent subsurface ocean material directly into space, containing molecular hydrogen, complex macromolecular organics, and nanometer-sized silica particles indicative of alkaline hydrothermal activity above ninety degrees Celsius."
      ]
    }
  },
  moon_triton: {
    rate: 0.90, pitch: 0.92,
    tiers: {
      kids: [
        "Brrr! Hi there, I'm Triton, Neptune's biggest moon! I'm a rebel—I orbit Neptune completely backwards compared to how Neptune spins! That's because I used to be a free dwarf planet out near Pluto until Neptune's gravity caught me, and I have dark geysers that shoot freezing nitrogen gas eight kilometers into my sky!"
      ],
      cadet: [
        "Greetings, Cadet. I am Triton, a captured Kuiper Belt object orbiting Neptune in a retrograde path. At minus two hundred and thirty-five degrees Celsius, my surface of frozen nitrogen and cantaloupe-textured water ice erupts with solar-driven nitrogen geysers!"
      ],
      director: [
        "Welcome, Director. I am Triton—the only large moon in the solar system in a retrograde orbit. Tidal decay is steadily drawing me toward Neptune's Roche limit, where in roughly three point six billion years I will be tidally disrupted into a massive planetary ring system."
      ]
    }
  },
  moon_charon: {
    rate: 0.96, pitch: 1.06,
    tiers: {
      kids: [
        "Hi! I'm Charon, Pluto's giant moon partner! I have a gigantic canyon four times longer than the Grand Canyon and a cool reddish-brown north pole cap made of gases that drifted over from Pluto!"
      ],
      cadet: [
        "Hello Cadet! I'm Charon. At twelve hundred and twelve kilometers across, I'm half the diameter of Pluto, and my north pole—Mordor Macula—is stained crimson by tholins, complex organic molecules formed from methane escaping Pluto's atmosphere!"
      ],
      director: [
        "Greetings, Director. I am Charon—forming a mutually tidally locked binary system with Pluto around an external barycenter, scarred by a thousand-kilometer equatorial extensional tectonic belt formed when an ancient subsurface ocean froze and expanded."
      ]
    }
  },
  // ─── SPACECRAFT & HUMAN FRONTIER FIRST-PERSON BRIEFINGS ───
  frontier_iss: {
    rate: 0.95, pitch: 0.98,
    tiers: {
      kids: [
        "Hello down on Earth! I am the International Space Station, humanity's home in the sky! I'm as big as a football field, and I zoom around the Earth at twenty-eight thousand kilometers an hour—so fast that astronauts living inside me get to watch sixteen sunrises and sixteen sunsets every single day!"
      ],
      cadet: [
        "Station Houston, we read you loud and clear! I am the International Space Station, orbiting four hundred and eight kilometers above Earth at seven point six-six kilometers per second. Since November two thousand, astronauts from over twenty countries have lived and conducted microgravity science aboard my sixteen pressurized modules!"
      ],
      director: [
        "Greetings, Director. I am the International Space Station (NORAD ID 25544), operating in a fifty-one point six degree inclination low Earth orbit. My four hundred and twenty metric ton truss and module architecture serves as humanity's primary microgravity research laboratory and closed-loop environmental control testbed."
      ]
    }
  },
  frontier_starship: {
    rate: 0.92, pitch: 0.88,
    tiers: {
      kids: [
        "3, 2, 1—LIFTOFF! I am SpaceX Starship, the tallest, most powerful rocket human beings have ever built! Made of shiny stainless steel and powered by fiery Raptor engines, I'm designed to refuel right in orbit and carry astronauts and cargo all the way to the Moon and Mars!"
      ],
      cadet: [
        "Greetings, Cadet! I am SpaceX Starship, flying along an interplanetary Hohmann transfer trajectory between Earth and Mars. Standing one hundred and twenty-one meters tall with Super Heavy, I am the first fully reusable super-heavy-lift vehicle—using orbital propellant transfer and a ceramic hex-tile heatshield to aerobrake into the Martian atmosphere!"
      ],
      director: [
        "Welcome, Director. I am the Starship interplanetary transport system, powered by full-flow staged-combustion methalox Raptor engines. By replenishing my twelve-hundred-ton propellant tanks in low Earth orbit, I can inject over one hundred metric tons of payload onto a trans-Mars trajectory and execute supersonic retropropulsion landing on Mars."
      ]
    }
  },
  frontier_datacenter: {
    rate: 0.94, pitch: 0.94,
    tiers: {
      kids: [
        "Beep-boop! Hello, explorer! I am an Orbital AI Data Center—a giant solar-powered supercomputer floating in space! Up here above the clouds, the Sun shines on my solar wings twenty-four hours a day, and my giant glowing radiator panels beam computer heat straight out into freezing deep space without using a single drop of Earth's water!"
      ],
      cadet: [
        "Greetings, Cadet. I am an Orbital AI Compute Cluster in sun-synchronous orbit. On Earth, massive AI data centers consume gigawatts of grid electricity and billions of liters of cooling water. In orbit, my solar arrays harvest continuous, unfiltered solar energy while my deep-space infrared radiators reject waste heat into the three-Kelvin cosmic background!"
      ],
      director: [
        "Greetings, Director. I am an Orbital Exascale Compute Node, interconnected via terabit optical laser crosslinks. Operating in a dawn-dusk sun-synchronous orbit, I achieve near-hundred-percent solar capacity factor at one thousand three hundred and sixty-one watts per square meter while utilizing Stefan-Boltzmann radiative heat rejection to deep space."
      ]
    }
  },
  frontier_jwst: {
    rate: 0.90, pitch: 0.90,
    tiers: {
      kids: [
        "Hello from deep space! I am the James Webb Space Telescope! I float one and a half million kilometers away from Earth with a giant golden honeycomb mirror and a five-layer sunshield as big as a tennis court that keeps me super cold so I can see baby stars being born and galaxies from the dawn of time!"
      ],
      cadet: [
        "Greetings, Cadet. I am the James Webb Space Telescope, orbiting the Sun-Earth L2 Lagrange point one point five million kilometers from Earth. My six-point-five-meter beryllium-gold mirror collects faint infrared light that has been traveling across the expanding universe for over thirteen point five billion years!"
      ],
      director: [
        "Welcome, Director. I am the James Webb Space Telescope at the Sun-Earth L2 halo orbit. Passively cooled to forty Kelvin behind my five-layer Kapton sunshield, with my Mid-Infrared Instrument actively cryocooled to six point seven Kelvin, I perform high-redshift spectroscopy of the first galaxies and transmission spectroscopy of exoplanet atmospheres."
      ]
    }
  },
  frontier_voyager: {
    rate: 0.88, pitch: 0.85,
    tiers: {
      kids: [
        "Hello from the stars! I am Voyager 1, the farthest spacecraft humans have ever sent into the universe! I launched in nineteen seventy-seven, visited Jupiter and Saturn, took the famous Pale Blue Dot photo of Earth, and now I'm flying through interstellar space carrying a Golden Record of Earth's music and greetings!"
      ],
      cadet: [
        "Greetings across twenty-four billion kilometers of space, Cadet! I am Voyager 1. Travelling at seventeen kilometers per second, my radio signals—moving at the speed of light—take over twenty-two hours just to reach NASA's Deep Space Network antennas on Earth!"
      ],
      director: [
        "Greetings, Director. I am Voyager 1, operating in the interstellar medium beyond the heliopause at over one hundred and sixty-three Astronomical Units. Powered by three plutonium-238 radioisotope thermoelectric generators and communicating at twenty-two watts via X-band with the Deep Space Network, I carry the Golden Record as humanity's time capsule."
      ]
    }
  }
};

// Alias mission_* keys and remaining moons so every spacecraft & moon has rich tiered monologues
PLANET_VOICES.mission_iss = PLANET_VOICES.frontier_iss;
PLANET_VOICES.mission_jwst = PLANET_VOICES.frontier_jwst;
PLANET_VOICES.mission_voyager = PLANET_VOICES.frontier_voyager;
PLANET_VOICES.mission_hubble = {
  rate: 0.92, pitch: 0.94,
  tiers: {
    kids: ["Hi explorer! I'm the Hubble Space Telescope! Floating high above Earth's blurry air for over thirty years, I've taken more than one and a half million crystal-clear photos of colorful nebulae, spiral galaxies, and shining star clusters!"],
    cadet: ["Greetings, Cadet! I am the Hubble Space Telescope, orbiting five hundred and forty-seven kilometers above Earth. From imaging the Pillars of Creation to capturing the Ultra Deep Field—ten thousand galaxies in a patch of sky the size of a grain of sand—I helped measure the age and expansion of the universe!"],
    director: ["Welcome, Director. I am the Hubble Space Telescope—a two-point-four-meter Ritchey-Chretien reflector operating from near-ultraviolet to near-infrared in low Earth orbit, serviced across five Space Shuttle missions."]
  }
};
PLANET_VOICES.mission_perseverance = {
  rate: 0.94, pitch: 0.92,
  tiers: {
    kids: ["BEEP-ZAP! Hi from Mars! I'm the Perseverance rover! I landed in Jezero Crater with a rocket sky-crane, I shoot a laser beam from my head to test Martian rocks, and I brought along my little helicopter buddy Ingenuity!"],
    cadet: ["Greetings from Jezero Crater, Cadet! I am NASA's Perseverance rover. Powered by a plutonium nuclear battery, I'm exploring an ancient Martian river delta, zapping rocks with SuperCam, making breathable oxygen from Martian CO2 with MOXIE, and sealing rock cores for future return to Earth!"],
    director: ["Welcome, Director. I am the Mars 2020 Perseverance rover, conducting astrobiological stratigraphy, PIXL/SHERLOC micro-spectroscopy, and sample caching across the Jezero deltaic-lacustrine system."]
  }
};
PLANET_VOICES.mission_juno = {
  rate: 0.90, pitch: 0.88,
  tiers: {
    kids: ["Hello from giant Jupiter! I'm the Juno spacecraft, spinning like a three-bladed windmill with giant solar wings as I dive right over Jupiter's colorful north and south poles!"],
    cadet: ["Greetings, Cadet! I am NASA's Juno orbiter. Protected by a titanium radiation vault, I dive within four thousand kilometers of Jupiter's cloud tops at over two hundred and fifty thousand kilometers per hour to map its gravity, magnetic field, and polar cyclones!"],
    director: ["Welcome, Director. I am the Juno polar orbiter, utilizing microwave radiometry and high-precision gravity Doppler tracking in highly elliptical perijove passes to probe Jupiter's deep zonal flows and diluted core."]
  }
};
PLANET_VOICES.mission_new_horizons = {
  rate: 0.96, pitch: 0.98,
  tiers: {
    kids: ["Hi from the icy Kuiper Belt! I'm New Horizons, the fastest spacecraft ever launched from Earth! I zoomed past Jupiter and flew right past Pluto in twenty-fifteen to show everyone Pluto's giant icy heart!"],
    cadet: ["Greetings, Cadet! I am New Horizons. Launched at fifty-eight thousand kilometers per hour, I traveled nine and a half years across five billion kilometers to capture humanity's first close-up images of Pluto, Charon, and the primordial Kuiper Belt object Arrokoth!"],
    director: ["Welcome, Director. I am New Horizons, executing reconnaissance of the Pluto-Charon binary system and cold classical Kuiper Belt planetesimals at forty-plus Astronomical Units."]
  }
};
PLANET_VOICES.mission_cassini = {
  rate: 0.90, pitch: 0.90,
  tiers: {
    kids: ["Hello, star traveler! I am the Cassini spacecraft! For thirteen magical years I orbited Saturn, flew through the icy water geysers of Enceladus, dropped my little Huygens lander onto Titan, and dove right between Saturn and its rings!"],
    cadet: ["Greetings, Cadet. I am the Cassini-Huygens flagship orbiter. Across two hundred and ninety-four orbits of Saturn, I discovered seven moons, sampled the hydrothermal plumes of Enceladus, mapped Titan's methane seas, and completed my Grand Finale in twenty-seventeen to protect Saturn's ocean moons!"],
    director: ["Welcome, Director. I am Cassini—a joint NASA-ESA-ASI flagship orbiter that revolutionized outer-planet science across thirteen years in the Kronian system before executing atmospheric entry at the conclusion of my twenty-two proximal Grand Finale orbits."]
  }
};

const _planetVoiceIdx = {};
let _speakingPlanet = null;
const _voicedBodies = new Set();

function _getLinesForBody(id) {
  const v = PLANET_VOICES[id];
  if (!v) {
    // Dynamic fallback for minor moons if not explicitly in PLANET_VOICES
    if (id && id.startsWith('moon_')) {
      const mName = document.getElementById('moon-name')?.textContent || 'this moon';
      const mDesc = document.getElementById('moon-desc')?.textContent || '';
      const mTag  = document.getElementById('moon-tagline')?.textContent || '';
      return {
        rate: 0.95, pitch: 1.0,
        lines: [
          `Hello, explorer! I am ${mName}—${mTag}. ${mDesc}`,
          `Keep exploring my craters, orbit, and secrets—every moon in the solar system holds clues to how our cosmic neighborhood was born four and a half billion years ago!`
        ]
      };
    }
    return null;
  }
  const tierLines = (v.tiers && (v.tiers[explorerTier] || v.tiers.cadet)) || v.lines || [];
  return { rate: v.rate || 0.92, pitch: v.pitch || 0.95, lines: tierLines };
}

function _updateTranscriptBoxes(id, text) {
  const tierLabel = (EXPLORER_TIERS[explorerTier] || EXPLORER_TIERS.cadet).badge;
  const boxes = [
    document.getElementById('panel-voice-transcript'),
    document.getElementById('moon-voice-transcript'),
    document.getElementById('mission-voice-transcript'),
    document.getElementById('frontier-voice-transcript')
  ];
  boxes.forEach(box => {
    if (!box) return;
    if (!text) {
      box.classList.remove('show');
    } else {
      box.innerHTML = `<div style="font-family:Orbitron,sans-serif;font-size:8px;letter-spacing:.16em;color:var(--cyan);margin-bottom:4px;text-transform:uppercase">${tierLabel} · FIRST-PERSON AUDIO TRANSMISSION</div>“${text}”`;
      box.classList.add('show');
    }
  });
}

function speakAsPlanet(id, advance=false) {
  const profile = _getLinesForBody(id);
  if (!profile || !profile.lines.length) return;

  // If clicking main button while already speaking this body (and not clicking "Tell Me More"), stop speech
  if (!advance && _speakingPlanet === id && window.speechSynthesis && window.speechSynthesis.speaking) {
    stopNarration();
    _speakingPlanet = null;
    _syncSpeakBtn();
    return;
  }

  let i = _planetVoiceIdx[id] || 0;
  if (advance) {
    i = (i + 1) % profile.lines.length;
  }
  _planetVoiceIdx[id] = (i + 1) % profile.lines.length;
  const textToSpeak = profile.lines[i % profile.lines.length];

  _speakingPlanet = id;
  _syncSpeakBtn();
  _updateTranscriptBoxes(id, textToSpeak);

  speakNarration(textToSpeak, {
    rate: profile.rate,
    pitch: profile.pitch,
    onend:   () => { if (_speakingPlanet === id) { _speakingPlanet = null; _syncSpeakBtn(); } },
    onerror: () => { if (_speakingPlanet === id) { _speakingPlanet = null; _syncSpeakBtn(); } },
  });

  if (typeof awardPoints === 'function' && !_voicedBodies.has(id)) {
    _voicedBodies.add(id);
    awardPoints(25);
  }
}

function _syncSpeakBtn() {
  const talking = !!_speakingPlanet;
  const pairs = [
    ['panel-speak', 'panel-speak-label', 'Hear Me Speak'],
    ['moon-speak', 'moon-speak-label', 'Hear Moon Speak'],
    ['mission-speak-btn', 'mission-speak-label', 'Hear Spacecraft Speak'],
    ['frontier-speak-btn', 'frontier-speak-label', 'Hear First-Person Briefing']
  ];
  pairs.forEach(([btnId, lblId, defaultText]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const isThisTalking = talking && btn.dataset.body === _speakingPlanet;
    btn.classList.toggle('speaking', isThisTalking);
    const lbl = document.getElementById(lblId);
    if (lbl) lbl.textContent = isThisTalking ? 'Stop Speaking' : defaultText;
  });
}

document.getElementById('panel-speak').addEventListener('click', (e) => {
  e.stopPropagation();
  const id = e.currentTarget.dataset.body;
  if (id) speakAsPlanet(id, false);
});
const _panelSpeakMoreBtn = document.getElementById('panel-speak-more');
if (_panelSpeakMoreBtn) {
  _panelSpeakMoreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = e.currentTarget.dataset.body || document.getElementById('panel-speak')?.dataset.body;
    if (id) speakAsPlanet(id, true);
  });
}

document.getElementById('panel-close').addEventListener('click', () => {
  if (_speakingPlanet) { stopNarration(); _speakingPlanet = null; _syncSpeakBtn(); }
});

function _setSpeakBtnTarget(id) {
  const btn = document.getElementById('panel-speak');
  const moreBtn = document.getElementById('panel-speak-more');
  const transBox = document.getElementById('panel-voice-transcript');
  if (transBox) { transBox.classList.remove('show'); transBox.innerHTML = ''; }
  if (!btn) return;
  const has = !!_getLinesForBody(id);
  btn.style.display = has ? '' : 'none';
  btn.dataset.body = id || '';
  if (moreBtn) {
    moreBtn.style.display = has ? '' : 'none';
    moreBtn.dataset.body = id || '';
  }
  _syncSpeakBtn();
}

// ═══════════════════════════════════════════════════════════════════════════════
// CINEMATIC PREMIERE — The Opening Movie Trailer
// ═══════════════════════════════════════════════════════════════════════════════
// _cinActive, _cinBeatIdx, _cinTimer, _cinCamAnim, _cinMusicNodes declared near top of file

const CINEMATIC_BEATS = [
  { dur:6500, camPos:[0,68,42], camLook:[0,0,0],
    caption:'Four and a half billion years ago, a cloud of gas and dust collapsed...',
    narration:'Four and a half billion years ago, a cloud of gas and dust collapsed. What emerged was our solar system. Nine worlds. One star. And the only known life in the universe.',
    music:'intro' },
  { dur:6000, camPos:[7,4,13], camLook:[0,0,0],
    caption:'At the center — a star that burns away the darkness.',
    titleMain:'THE SUN', titleSub:'Our Star',
    narration:'At the center, a star ignited. Our Sun. In one second, it releases more energy than all of humanity has ever used in our entire history.',
    music:'build1' },
  { dur:5000, planet:'mercury',
    caption:'The closest world. 430 degrees in sunlight. Minus 180 in shadow.',
    titleMain:'MERCURY', titleSub:'The Swift Messenger',
    narration:'Mercury. The closest planet to the Sun. A world of impossible extremes — baking and freezing every single day.',
    music:'build1' },
  { dur:5500, planet:'venus',
    caption:"Earth's twin. Gone terribly, terribly wrong.",
    titleMain:'VENUS', titleSub:"Earth's Warning",
    narration:'Venus. It looks beautiful from a distance. But get closer and you find acid rain, crushing pressure, and temperatures that melt lead. A warning from the cosmos.',
    music:'build2' },
  { dur:7000, planet:'earth',
    caption:'Then — against all odds — life.',
    titleMain:'EARTH', titleSub:'The Only Home We Know',
    narration:'Earth. In all the cosmos we have explored, life has been found in exactly one place. Here. That makes this pale blue dot precious beyond words.',
    music:'swell' },
  { dur:5500, planet:'mars',
    caption:'Ancient rivers. Unanswered questions. Our next giant leap.',
    titleMain:'MARS', titleSub:"Humanity's Next Step",
    narration:'Mars. The Red Planet. Ancient rivers carved its surface billions of years ago. We are going back — and this time, to stay.',
    music:'build2' },
  { dur:5500, planet:'jupiter',
    caption:'The guardian. 318 Earths of gravity. Our shield.',
    titleMain:'JUPITER', titleSub:'Protector of the Inner Worlds',
    narration:'Jupiter. So massive it barely counts as a planet. Its gravity has deflected countless asteroids that would otherwise have ended life on Earth.',
    music:'build3' },
  { dur:6000, planet:'saturn',
    caption:'Nothing in the solar system prepares you for this moment.',
    titleMain:'SATURN', titleSub:'Lord of the Rings',
    narration:'Saturn. Even trained astronomers report the same reaction the first time they see it through a telescope: disbelief. It looks too beautiful to be real.',
    music:'build3' },
  { dur:4500, planet:'uranus',
    caption:'Knocked on its side by a cosmic collision. Still spinning.',
    titleMain:'URANUS', titleSub:'The Tilted World',
    narration:'Uranus. Something enormous hit it billions of years ago — so hard it knocked the entire planet sideways. It has been rolling around the Sun ever since.',
    music:'climax' },
  { dur:5000, planet:'neptune',
    caption:'Discovered by mathematics before anyone saw it. Pure human reason.',
    titleMain:'NEPTUNE', titleSub:'Found by Thinking',
    narration:'Neptune. Discovered not by looking, but by calculating. In 1846, a mathematician predicted exactly where it had to be. They found it the first night.',
    music:'climax' },
  { dur:7000, planet:'pluto',
    caption:'5 billion kilometers away. And the universe put a heart on it.',
    titleMain:'PLUTO', titleSub:'The Heart at the Edge',
    narration:'And at the very edge of our solar system — Pluto. When New Horizons flew past in 2015, it found something nobody expected: a giant heart-shaped plain. The universe saved its most beautiful surprise for last.',
    music:'finale' },
  { dur:7500, camPos:[0,52,36], camLook:[0,0,0],
    caption:'Nine worlds. Infinite discoveries. Your mission begins now.',
    titleMain:'YOUR MISSION', titleSub:'BEGINS NOW',
    narration:'Nine worlds. Each one holding secrets that took billions of years to create. Your mission, Explorer: go out there and discover them all.',
    music:'finale', isFinal:true },
];

const CIN_TOTAL = CINEMATIC_BEATS.reduce((s,b) => s+b.dur, 0);

function _stopCinMusic() {
  _cinMusicNodes.forEach(n => { try { n.stop(0); } catch(e){} });
  _cinMusicNodes = [];
}

function _playCinMusic(phase) {
  if (!audioCtx || !audioEnabled) return;
  _stopCinMusic();
  audioCtx.resume();
  const ctx = audioCtx, now = ctx.currentTime;
  const master = ctx.createGain();
  master.connect(ctx.destination);

  const phases = {
    intro:  { pads:[[55,.055],[82.5,.04],[110,.035]], arps:null, bass:false },
    build1: { pads:[[65.4,.07],[98,.05],[130.8,.04]], arps:[[261,.035],[329,.028],[392,.022]], bass:false },
    build2: { pads:[[73.4,.085],[110,.06],[146.8,.05]], arps:[[293,.04],[370,.032],[440,.026]], bass:false },
    build3: { pads:[[87.3,.10],[130.8,.07],[174.6,.06]], arps:[[349,.045],[440,.036],[523,.028]], bass:false },
    swell:  { pads:[[65.4,.11],[98,.08],[130.8,.07],[174.6,.055]], arps:[[392,.05],[494,.04],[587,.032],[659,.025]], bass:false },
    climax: { pads:[[87.3,.12],[130.8,.09],[196,.07],[261,.055]], arps:[[523,.055],[659,.044],[784,.035],[1047,.026]], bass:true },
    finale: { pads:[[65.4,.13],[130.8,.10],[196,.08],[261,.065],[392,.05]], arps:[[523,.06],[659,.048],[784,.038],[1047,.028],[1319,.018]], bass:true },
  };
  const cfg = phases[phase] || phases.intro;
  const FAR = 65;

  cfg.pads.forEach(([f,g], i) => {
    const osc = ctx.createOscillator(), gn = ctx.createGain();
    osc.type = i%2===0 ? 'sine' : 'triangle';
    osc.frequency.value = f; osc.detune.value = (i-1)*4;
    gn.gain.setValueAtTime(0,now); gn.gain.linearRampToValueAtTime(g, now+2.8);
    gn.gain.setValueAtTime(g, now+FAR-3); gn.gain.linearRampToValueAtTime(0, now+FAR);
    osc.connect(gn); gn.connect(master);
    osc.start(now); osc.stop(now+FAR); _cinMusicNodes.push(osc);
  });

  if (cfg.arps) {
    const interval = phase==='climax'||phase==='finale' ? 0.45 : 0.65;
    cfg.arps.forEach(([f,g], fi) => {
      const count = Math.floor(FAR / (interval * cfg.arps.length));
      for (let n=0; n<count; n++) {
        const t = now + 1.5 + (fi + n*cfg.arps.length)*interval;
        if (t >= now+FAR) break;
        const osc = ctx.createOscillator(), gn = ctx.createGain();
        osc.type='sine'; osc.frequency.value=f;
        gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(g,t+0.04);
        gn.gain.exponentialRampToValueAtTime(0.001,t+interval*0.8);
        osc.connect(gn); gn.connect(master);
        osc.start(t); osc.stop(t+interval); _cinMusicNodes.push(osc);
      }
    });
  }

  if (cfg.bass) {
    const osc = ctx.createOscillator(), gn = ctx.createGain();
    osc.type='sine'; osc.frequency.value=32.7;
    gn.gain.setValueAtTime(0.10,now); gn.gain.setValueAtTime(0.10,now+FAR-2);
    gn.gain.linearRampToValueAtTime(0,now+FAR);
    osc.connect(gn); gn.connect(master);
    osc.start(now); osc.stop(now+FAR); _cinMusicNodes.push(osc);
  }
}

function _cinFlyCamera(beat, onArrived) {
  let endPos, endLook;
  if (beat.camPos) {
    endPos = new THREE.Vector3(...beat.camPos);
    endLook = new THREE.Vector3(...(beat.camLook || [0,0,0]));
  } else if (beat.planet) {
    const pm = planetMeshes.find(p => p.pdata.id===beat.planet);
    if (pm) {
      const wpos = new THREE.Vector3(); pm.group.getWorldPosition(wpos);
      const sz = pm.pdata.size;
      const angle = _cinBeatIdx * 0.72;
      const dist = Math.max(sz*5.5, 4.5);
      const dir = new THREE.Vector3(Math.cos(angle), 0.38, Math.sin(angle)).normalize();
      endPos = wpos.clone().add(dir.multiplyScalar(dist));
      endLook = wpos.clone();
    } else { endPos=new THREE.Vector3(0,30,50); endLook=new THREE.Vector3(0,0,0); }
  } else { endPos=new THREE.Vector3(0,52,36); endLook=new THREE.Vector3(0,0,0); }

  controls.enabled = false;
  _cinCamAnim = {
    startPos: camera.position.clone(), startLook: controls.target.clone(),
    endPos, endLook, progress:0, speed:0.38, onArrived, arrived:false
  };
}

function _updateCinCamera(delta) {
  if (!_cinCamAnim || _cinCamAnim.arrived) return;
  _cinCamAnim.progress = Math.min(1, _cinCamAnim.progress + delta * _cinCamAnim.speed);
  const p = _cinCamAnim.progress;
  const t = p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;
  camera.position.lerpVectors(_cinCamAnim.startPos, _cinCamAnim.endPos, t);
  controls.target.lerpVectors(_cinCamAnim.startLook, _cinCamAnim.endLook, t);
  controls.update();
  if (_cinCamAnim.progress >= 1) {
    _cinCamAnim.arrived = true;
    if (_cinCamAnim.onArrived) _cinCamAnim.onArrived();
  }
}

function _showCineCaption(text) {
  const el = document.getElementById('cine-caption-text');
  el.classList.remove('show'); void el.offsetWidth;
  el.textContent = text;
  setTimeout(() => el.classList.add('show'), 120);
}

function _showCineTitle(main, sub) {
  const el = document.getElementById('cine-big-title');
  if (!main) { el.classList.remove('show'); return; }
  document.getElementById('cine-big-title-main').textContent = main;
  document.getElementById('cine-big-title-sub').textContent = sub || '';
  el.classList.remove('show'); void el.offsetWidth;
  setTimeout(() => { el.classList.add('show'); }, 500);
  setTimeout(() => el.classList.remove('show'), 3200);
}

function _runCinBeat(idx) {
  if (!_cinActive || idx >= CINEMATIC_BEATS.length) { _endCinematicPremiere(); return; }
  _cinBeatIdx = idx;
  const beat = CINEMATIC_BEATS[idx];

  // Progress bar
  const elapsedMs = CINEMATIC_BEATS.slice(0,idx).reduce((s,b)=>s+b.dur,0);
  document.getElementById('cine-progress').style.width = (elapsedMs/CIN_TOTAL*100)+'%';

  // Music — only change phase when it changes
  if (beat.music && beat.music !== _prevCinMusic) {
    _playCinMusic(beat.music); _prevCinMusic = beat.music;
  }

  // Camera fly — captions show on arrival
  _cinFlyCamera(beat, () => {
    if (beat.caption) _showCineCaption(beat.caption);
    if (beat.titleMain) _showCineTitle(beat.titleMain, beat.titleSub);
  });

  // Wait for BOTH the minimum beat duration AND speech to finish before advancing.
  // This prevents the narrator from being cut off mid-sentence.
  clearTimeout(_cinTimer);
  let _timerReady = false;
  let _speechReady = !beat.narration; // no narration = speech instantly "done"

  function _tryAdvance() {
    if (_timerReady && _speechReady && _cinActive) {
      _cinTimer = setTimeout(() => _runCinBeat(idx + 1), 600); // 600ms breath between beats
    }
  }

  // Minimum on-screen time so the scene can be seen even on fast speakers
  _cinTimer = setTimeout(() => { _timerReady = true; _tryAdvance(); }, beat.dur);

  if (beat.narration) {
    speakNarration(beat.narration, {
      rate: 0.82, pitch: 0.88,
      onend:  () => { _speechReady = true; _tryAdvance(); },
      onerror:() => { _speechReady = true; _tryAdvance(); } // advance even if speech fails
    });
  }
}

function startCinematicPremiere() {
  if (_cinActive) return;
  _cinActive = true;
  _cinBeatIdx = 0;
  _prevCinMusic = null;
  paused = true;
  controls.enabled = false;
  document.getElementById('cinematic-overlay').classList.add('active');
  document.getElementById('cine-skip-btn').style.display = 'block';
  document.getElementById('cine-caption-text').classList.remove('show');
  document.getElementById('cine-big-title').classList.remove('show');
  setTimeout(() => _runCinBeat(0), 600);
}

function _endCinematicPremiere() {
  if (!_cinActive) return;
  _cinActive = false;
  clearTimeout(_cinTimer);
  stopNarration();
  _stopCinMusic();
  _cinCamAnim = null;
  document.getElementById('cinematic-overlay').classList.remove('active');
  document.getElementById('cine-skip-btn').style.display = 'none';
  document.getElementById('cine-caption-text').classList.remove('show');
  document.getElementById('cine-big-title').classList.remove('show');
  document.getElementById('cine-progress').style.width = '0%';
  paused = false;
  controls.enabled = true;
  // Reset camera to the standard solar system overview so nothing looks zoomed/warped
  camera.position.set(0, 28, 55);
  controls.target.set(0, 0, 0);
  controls.update();
  // Must match what #mbrief-start activates (_setActiveMission(_completedMissions.size)),
  // otherwise the briefing card describes Mission 1 while "Begin Mission" starts
  // whichever mission is actually next — different title, objective and target.
  setTimeout(() => showMissionBriefing(_completedMissions.size), 800);
}

document.getElementById('cine-skip-btn').addEventListener('click', () => _endCinematicPremiere());
// Escape key also skips
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && _cinActive) _endCinematicPremiere(); });

// ═══════════════════════════════════════════════════════════════════════════════
// MISSION CAMPAIGN — The Game Loop
// ═══════════════════════════════════════════════════════════════════════════════
const MISSION_CHAIN = [
  { id:'earth_base', ch:1, title:'Signal Detected', icon:'🌍', planet:'earth',
    briefing:"Welcome to Mission Control, Explorer. Your instruments are picking up signals from the third planet from the Sun. Navigate to Earth — your home base — and begin your investigation. Every great journey starts with a single destination.",
    task:'Navigate to Earth and open its data file', taskShort:'Fly to Earth',
    trigger:'planet_visited', triggerData:{id:'earth'},
    reward:{medal:'🌍', name:'Home Base', xp:100} },

  { id:'quiz_earth', ch:2, title:'Knowledge Check', icon:'🧠', planet:'earth',
    briefing:"Mission Control has received your Earth data. Now prove you absorbed it. A true explorer doesn't just visit — they learn. Complete the Earth knowledge quiz to demonstrate mastery of your home world.",
    task:'Complete the Earth quiz', taskShort:'Take the Earth Quiz',
    trigger:'quiz_completed', triggerData:{planetId:'earth'},
    reward:{medal:'🧠', name:'Earth Scholar', xp:150} },

  { id:'mars_recon', ch:3, title:'Red Planet Recon', icon:'🔴', planet:'mars',
    briefing:"Humanity's next destination is calling. Mars — the Red Planet — holds the answer to one of the greatest questions in history: was there ever life beyond Earth? Navigate to Mars and begin your reconnaissance. Perseverance is already there, waiting.",
    task:'Navigate to Mars', taskShort:'Fly to Mars',
    trigger:'planet_visited', triggerData:{id:'mars'},
    reward:{medal:'🔴', name:'Mars Pioneer', xp:200} },

  { id:'jupiter_survey', ch:4, title:"The Giant's Storm", icon:'🌀', planet:'jupiter',
    briefing:"A storm larger than the entire planet Earth has been raging on Jupiter for over 350 years. The Great Red Spot. Navigate to Jupiter — our solar system's guardian — and witness the most powerful weather system in the solar system.",
    task:'Navigate to Jupiter', taskShort:'Fly to Jupiter',
    trigger:'planet_visited', triggerData:{id:'jupiter'},
    reward:{medal:'🌀', name:'Storm Rider', xp:250} },

  { id:'saturn_rings', ch:5, title:'Lord of the Rings', icon:'💫', planet:'saturn',
    briefing:"Nothing in the solar system prepares you for Saturn. Professional astronomers still describe the same reaction when they first see it through a telescope: disbelief. Those rings stretch 282,000 kilometers wide but are only 10 meters thick. Navigate there and witness it yourself.",
    task:'Navigate to Saturn and complete its quiz', taskShort:'Fly to Saturn → Quiz',
    trigger:'quiz_completed', triggerData:{planetId:'saturn'},
    reward:{medal:'💫', name:'Ring Diver', xp:250} },

  { id:'solar_rider', ch:6, title:'Solar Corona Survey', icon:'☀️', planet:'sun',
    briefing:"Elevated magnetic loop activity detected in the inner solar system. The Sun is arching colossal plasma prominences and magnetic coronal loops across its photosphere. Navigate directly to our star, observe the 3D coronal loops up close, and listen to the Sun tell its story.",
    task:'Navigate to the Sun and inspect its 3D coronal loops', taskShort:'Reach the Sun',
    trigger:'planet_visited', triggerData:{id:'sun'},
    reward:{medal:'☀️', name:'Solar Rider', xp:300} },

  { id:'inner_worlds', ch:7, title:'Inner Worlds Survey', icon:'🔭', planet:'mercury',
    briefing:"Complete your inner solar system survey. Mercury — the swift messenger, closest to the Sun — and Venus — Earth's twin gone catastrophically wrong — are waiting. Two worlds at the extremes. Document both for Mission Control.",
    task:'Visit Mercury and Venus', taskShort:'Visit Mercury & Venus',
    trigger:'visit_both', triggerData:{planets:['mercury','venus']},
    reward:{medal:'🔭', name:'Inner System Scout', xp:300} },

  { id:'ice_giants', ch:8, title:'The Ice Giants', icon:'🧊', planet:'uranus',
    briefing:"Beyond Jupiter lie worlds that have never been studied up close. Uranus — knocked sideways by a cosmic collision — and Neptune — so cold and stormy it defies explanation. Navigate into the deep outer solar system. You are entering territory few have explored.",
    task:'Visit Uranus and Neptune', taskShort:'Visit Uranus & Neptune',
    trigger:'visit_both', triggerData:{planets:['uranus','neptune']},
    reward:{medal:'🧊', name:'Deep Space Pioneer', xp:400} },

  { id:'final_frontier', ch:9, title:'The Edge of Everything', icon:'❤️', planet:'pluto',
    briefing:"One final destination. At the very edge of our solar system — 5 billion kilometers from the Sun — lies Pluto. When the New Horizons spacecraft flew past in 2015 after a nine-year journey, it found something nobody predicted: a giant heart. The universe put a heart on the most distant world. Go there, Explorer. See it for yourself. This is the final mission.",
    task:'Navigate to Pluto — the final world', taskShort:'Reach Pluto',
    trigger:'planet_visited', triggerData:{id:'pluto'},
    reward:{medal:'❤️', name:'Final Frontier', xp:500} },
];

function _createMissionRing(planetId) {
  _removeMissionRing();
  let group = null;
  if (planetId === 'sun') {
    group = sunObj && sunObj.group;
  } else {
    const pm = planetMeshes.find(p => p.pdata.id===planetId);
    if (pm) group = pm.group;
  }
  if (!group) return;
  const pdata = (planetId==='sun') ? {size:2.5} : (PLANETS.find(p=>p.id===planetId)||{size:1});
  const sz = pdata.size || 1;
  const geo = new THREE.RingGeometry(sz*2.3, sz*2.65, 64);
  const mat = new THREE.MeshBasicMaterial({color:0x00d4ff, side:THREE.DoubleSide, transparent:true, opacity:0.6});
  _missionRing = new THREE.Mesh(geo, mat);
  _missionRing.rotation.x = Math.PI/2;
  group.add(_missionRing);
  _missionRingParent = group;
}

function _removeMissionRing() {
  if (_missionRing) {
    if (_missionRing.parent) _missionRing.parent.remove(_missionRing);
    _missionRing.geometry.dispose(); _missionRing.material.dispose();
    _missionRing = null; _missionRingParent = null;
  }
}

function _pulseMissionRing(t) {
  if (!_missionRing) return;
  _missionRing.material.opacity = 0.35 + Math.abs(Math.sin(t*2.2))*0.45;
  const sc = 0.97 + Math.abs(Math.sin(t*2.2))*0.06;
  _missionRing.scale.setScalar(sc);
}

function showMissionBriefing(idx) {
  if (idx >= MISSION_CHAIN.length) { _triggerAllComplete(); return; }
  const m = MISSION_CHAIN[idx];
  const pname = m.planet==='sun' ? 'The Sun' : (PLANETS.find(p=>p.id===m.planet)||{name:m.planet}).name;
  const tierInfo = EXPLORER_TIERS[explorerTier] || EXPLORER_TIERS.cadet;
  const aiGreeting = idx === 0
    ? (explorerTier === 'kids'
        ? `Welcome aboard the Odyssey cockpit, Young Explorer! I am your Ship AI. Drag to spin around space, scroll to zoom, click any glowing planet to hear it speak in first person, and press F to explore the Human Frontier! `
        : explorerTier === 'director'
        ? `Ship AI online. Welcome, Mission Director. Deep telemetry, Live ISS orbital tracking, Human Frontier nodes, and NASA archive feeds are active. Use orbital camera controls to inspect any body or press F to toggle the Human Frontier layer. `
        : `Welcome to the Odyssey cockpit, Space Cadet! Ship AI online. Click any world to scan its NASA photo gallery and hear its first-person story, or toggle the Human Frontier bar to track the Live ISS, SpaceX Starship, and JWST. `)
    : '';
  document.getElementById('mbrief-chapter').textContent = `${tierInfo.icon} ${tierInfo.label.toUpperCase()} · Mission ${m.ch} of ${MISSION_CHAIN.length}`;
  document.getElementById('mbrief-icon').textContent = m.icon;
  document.getElementById('mbrief-title').textContent = m.title;
  document.getElementById('mbrief-target').textContent = 'Target: '+pname;
  document.getElementById('mbrief-text').textContent = aiGreeting + m.briefing;
  document.getElementById('mbrief-task-text').textContent = m.task;
  document.getElementById('mbrief-reward').textContent =
    m.reward.medal+' Reward: "'+m.reward.name+'" Medal · +'+m.reward.xp+' XP';
  document.getElementById('mission-briefing').classList.add('open');
  _playMissionSFX('briefing');
  setTimeout(() => speakNarration(aiGreeting + 'Mission '+m.ch+'. '+m.title+'. '+m.briefing, {rate:0.94, pitch:0.98}), 400);
}

document.getElementById('mbrief-start').addEventListener('click', () => {
  document.getElementById('mission-briefing').classList.remove('open');
  stopNarration();
  _setActiveMission(_completedMissions.size);
  // First-run tutorial. window.maybeShowHints was defined but never called from
  // anywhere, so the whole 4-step overlay in universe.html was dead code and no
  // new user ever saw it. This is the first moment the user actually has the
  // app to themselves — the welcome screen, premiere and briefing are all done.
  // maybeShowHints() self-suppresses via the ue_hints_seen localStorage key.
  setTimeout(() => { if(window.maybeShowHints) window.maybeShowHints(); }, 900);
});

function _setActiveMission(idx) {
  _activeMissionIdx = idx;
  _missionFreeMode = false;
  if (idx >= MISSION_CHAIN.length) return;
  const m = MISSION_CHAIN[idx];
  document.getElementById('mhud-chapter').textContent = `Mission ${m.ch} of ${MISSION_CHAIN.length}`;
  document.getElementById('mhud-title').textContent = m.title;
  document.getElementById('mhud-objective').textContent = m.taskShort;
  document.getElementById('mhud-bar').style.width = (_completedMissions.size/MISSION_CHAIN.length*100)+'%';
  document.getElementById('mission-hud').classList.add('visible');
  _createMissionRing(m.planet);
}

function checkMissionComplete(eventType, data) {
  if (_missionFreeMode || _activeMissionIdx<0 || _activeMissionIdx>=MISSION_CHAIN.length) return;
  const m = MISSION_CHAIN[_activeMissionIdx];
  if (_completedMissions.has(m.id)) return;
  let done = false;

  if (m.trigger === 'planet_visited' && eventType === 'planet_visited') {
    done = data.id === m.triggerData.id;

  } else if (m.trigger === 'quiz_completed' && eventType === 'quiz_completed') {
    done = data.planetId === m.triggerData.planetId;

  } else if (m.trigger === 'visit_both' && eventType === 'planet_visited') {
    const key = m.id;
    if (!_missionPartial[key]) _missionPartial[key] = new Set();
    if (m.triggerData.planets.includes(data.id)) _missionPartial[key].add(data.id);
    done = m.triggerData.planets.every(id => _missionPartial[key].has(id));
    // Update ring to unvisited planet
    if (!done) {
      const next = m.triggerData.planets.find(id => !(_missionPartial[key]&&_missionPartial[key].has(id)));
      if (next) _createMissionRing(next);
    }
  }

  if (done) _completeMission(_activeMissionIdx);
}

function _completeMission(idx) {
  const m = MISSION_CHAIN[idx];
  _completedMissions.add(m.id);
  _removeMissionRing();
  awardPoints(m.reward.xp);

  document.getElementById('mc-chapter-label').textContent = 'Mission '+m.ch+' Complete';
  document.getElementById('mc-medal').textContent = m.reward.medal;
  document.getElementById('mc-title').textContent = m.reward.name.toUpperCase();
  document.getElementById('mc-subtitle').textContent = 'Mission '+m.ch+': '+m.title;
  document.getElementById('mc-xp').textContent = '+'+m.reward.xp+' XP';
  const nextIdx = idx+1;
  const isLast = nextIdx >= MISSION_CHAIN.length;
  document.getElementById('mc-next-btn').textContent = isLast
    ? '★  CLAIM YOUR LEGACY  ★'
    : 'Next: '+MISSION_CHAIN[nextIdx].title+' ▶';

  // Re-trigger medal animation
  const medal = document.getElementById('mc-medal');
  medal.style.animation='none'; void medal.offsetWidth;
  medal.style.animation='';

  document.getElementById('mission-complete').classList.add('show');
  _playMissionSFX('complete');
  setTimeout(() => speakNarration('Mission complete. '+m.reward.name+'. Outstanding work, Explorer.', {rate:0.9, pitch:0.9}), 300);

  document.getElementById('mhud-bar').style.width = (_completedMissions.size/MISSION_CHAIN.length*100)+'%';
}

document.getElementById('mc-next-btn').addEventListener('click', () => {
  document.getElementById('mission-complete').classList.remove('show');
  stopNarration();
  const next = _activeMissionIdx+1;
  if (next >= MISSION_CHAIN.length) _triggerAllComplete();
  else setTimeout(() => showMissionBriefing(next), 400);
});

document.getElementById('mc-free-btn').addEventListener('click', () => {
  document.getElementById('mission-complete').classList.remove('show');
  stopNarration(); _enterFreeExplore();
});

document.getElementById('mhud-free').addEventListener('click', _enterFreeExplore);

function _enterFreeExplore() {
  _missionFreeMode = true;
  _activeMissionIdx = -1;
  _removeMissionRing();
  document.getElementById('mission-hud').classList.remove('visible');
  showToast('Free Explorer Mode', 'Roam at will. Resume missions any time from the menu.', '🚀');
}

function _triggerAllComplete() {
  document.getElementById('mission-hud').classList.remove('visible');
  _removeMissionRing();
  showToast('SOLAR SYSTEM MASTER', 'All 9 missions complete. You are a true Explorer.', '🌌');
  speakNarration('Congratulations, Explorer. You have completed all nine missions. You have surveyed the entire solar system. You are a Solar System Master.', {rate:0.85, pitch:0.9});
  _playMissionSFX('legend');
  awardPoints(1000);
}

function _playMissionSFX(type) {
  if (!audioCtx || !audioEnabled) return;
  audioCtx.resume();
  const ctx = audioCtx, now = ctx.currentTime;
  if (type === 'briefing') {
    [[880,0],[1100,.18]].forEach(([f,delay]) => {
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type='square'; o.frequency.value=f;
      g.gain.setValueAtTime(0,now+delay); g.gain.linearRampToValueAtTime(0.06,now+delay+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,now+delay+0.28);
      o.connect(g); g.connect(ctx.destination); o.start(now+delay); o.stop(now+delay+0.32);
    });
  } else if (type === 'complete') {
    [523.25,659.25,783.99,1046.5].forEach((f,i) => {
      const t=now+i*0.13;
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type='sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.14,t+0.04);
      g.gain.setValueAtTime(0.14,t+0.18); g.gain.exponentialRampToValueAtTime(0.001,t+0.75);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.8);
    });
    [261.63,329.63,392].forEach(f => {
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type='triangle'; o.frequency.value=f;
      g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(0.065,now+0.3);
      g.gain.setValueAtTime(0.065,now+1.3); g.gain.linearRampToValueAtTime(0,now+2.1);
      o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now+2.2);
    });
  } else if (type === 'legend') {
    [130.8,196,261.6,329.6,392,523.25].forEach((f,i) => {
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type=i<3?'sawtooth':'sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(0.055,now+0.35);
      g.gain.setValueAtTime(0.055,now+3.2); g.gain.linearRampToValueAtTime(0,now+4.5);
      o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now+4.6);
    });
    [0,.45,.9,1.35].forEach(d => {
      const buf=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.1),ctx.sampleRate);
      const dd=buf.getChannelData(0);
      for(let i=0;i<dd.length;i++) dd[i]=(Math.random()*2-1)*Math.exp(-i/500);
      const src=ctx.createBufferSource(); src.buffer=buf;
      const g=ctx.createGain(); g.gain.value=0.28;
      src.connect(g); g.connect(ctx.destination); src.start(now+d);
    });
  }
}

// Resume campaign from menu
window.resumeMissionCampaign = function() {
  closeSideMenu();
  if (_completedMissions.size >= MISSION_CHAIN.length) {
    _completedMissions.clear();
    Object.keys(_missionPartial).forEach(k => delete _missionPartial[k]);
  }
  _missionFreeMode = false;
  const nextIdx = _completedMissions.size;
  showMissionBriefing(nextIdx);
};
const _resumeCampaignBtn = document.getElementById('resume-campaign-btn');
if (_resumeCampaignBtn) {
  _resumeCampaignBtn.addEventListener('click', () => window.resumeMissionCampaign());
}

