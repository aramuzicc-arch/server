/** Merged with DB document when slug=main is missing fields. Images default empty — use Cloudinary from admin. */
export const defaultSiteContent = {
  slug: "main",
  aboutHeroTagline: "Music is the language of the soul, and I'm here to make it scream.",
  aboutHeroImage: "",
  aboutPortraitImage: "",
  aboutBioParagraphs: [
    "Born from the underground music scene of Los Angeles, ARA MUZICC emerged as a force that defies genre boundaries. Starting as a self-taught guitarist at age 14, the journey from bedroom recordings to sold-out arenas has been nothing short of extraordinary.",
    'With a sound that fuses alternative rock, electronic production, and virtuosic guitar work, ARA MUZICC has created a sonic identity that is unmistakably unique. Each album represents a chapter in an evolving story - from the raw energy of "PRISM" (2021) to the sophisticated darkness of "MIDNIGHT ECHO" (2025).',
    "The live experience is where ARA MUZICC truly comes alive. Known for immersive stage designs, pyrotechnic displays, and extended improvisational sections, every show is a one-of-a-kind event that leaves audiences transformed.",
  ],
  timeline: [
    { year: "2018", title: "First EP Release", description: 'Released "Origins" independently', order: 0 },
    { year: "2019", title: "First National Tour", description: "15 cities across the country", order: 1 },
    { year: "2020", title: "Viral Hit", description: '"Static" reaches 100M+ streams', order: 2 },
    { year: "2021", title: "Debut Album", description: '"PRISM" hits Billboard Top 10', order: 3 },
    { year: "2022", title: "Coachella", description: "Main stage performance", order: 4 },
    { year: "2023", title: "Grammy Nomination", description: '"Neon Rituals" nominated', order: 5 },
    { year: "2024", title: "World Arena Tour", description: "50+ shows worldwide", order: 6 },
    { year: "2025", title: "Midnight Echo", description: "Critical acclaim", order: 7 },
  ],
  publicPhone: "",
  stats: [
    { value: 500, suffix: "M+", label: "STREAMS", order: 0 },
    { value: 50, suffix: "+", label: "COUNTRIES", order: 1 },
    { value: 200, suffix: "+", label: "LIVE SHOWS", order: 2 },
    { value: 4, suffix: "", label: "ALBUMS", order: 3 },
  ],
};
