export interface Drama {
  id: number;
  title: string;
  country: "K-Drama" | "C-Drama";
  year: number;
  episodes: number;
  rating: number;
  genre: string[];
  tropes: string[];
  moods: string[];
  emoji: string;
  gradient: string;
  synopsis: string;
  cast: string[];
  network: string;
}

export const dramas: Drama[] = [
  { id: 1, title: "Crash Landing on You", country: "K-Drama", year: 2019, episodes: 16, rating: 9.2, genre: ["Romance", "Drama"], tropes: ["Slow Burn", "Enemies to Lovers", "Military"], moods: ["Butterflies", "Cry it out"], emoji: "🌸", gradient: "from-purple-900 to-purple-600", synopsis: "A South Korean heiress accidentally paraglides into North Korea and falls in love with a military officer.", cast: ["Hyun Bin", "Son Ye-jin"], network: "tvN" },
  { id: 2, title: "Vincenzo", country: "K-Drama", year: 2021, episodes: 20, rating: 9.5, genre: ["Thriller", "Comedy"], tropes: ["Revenge Plot", "Found Family", "Enemies to Lovers"], moods: ["Revenge energy", "Feel good"], emoji: "🗡️", gradient: "from-red-900 to-red-700", synopsis: "An Italian-Korean mafia lawyer returns to Korea and teams up with a feisty lawyer to take down a corrupt conglomerate.", cast: ["Song Joong-ki", "Jeon Yeo-been"], network: "tvN" },
  { id: 3, title: "Mr. Sunshine", country: "K-Drama", year: 2018, episodes: 24, rating: 9.1, genre: ["Historical", "Romance"], tropes: ["Historical Joseon", "Slow Burn", "Forbidden Love"], moods: ["Epic saga", "Cry it out"], emoji: "👑", gradient: "from-green-900 to-green-700", synopsis: "A boy born into slavery in 1800s Korea becomes a US Marine and returns to his homeland, falling for a noble woman.", cast: ["Lee Byung-hun", "Kim Tae-ri"], network: "tvN" },
  { id: 4, title: "Goblin", country: "K-Drama", year: 2016, episodes: 16, rating: 8.7, genre: ["Fantasy", "Romance"], tropes: ["Slow Burn", "Supernatural", "Found Family"], moods: ["Butterflies", "Cry it out", "Slow burn"], emoji: "🌌", gradient: "from-indigo-900 to-purple-800", synopsis: "An immortal goblin needs a human bride to end his cursed life, but falls in love with her instead.", cast: ["Gong Yoo", "Kim Go-eun"], network: "tvN" },
  { id: 5, title: "Business Proposal", country: "K-Drama", year: 2022, episodes: 12, rating: 8.5, genre: ["Romance", "Comedy"], tropes: ["CEO Romance", "Fake Dating", "Contract Marriage"], moods: ["Butterflies", "Feel good"], emoji: "💼", gradient: "from-yellow-900 to-amber-700", synopsis: "A woman goes on a blind date disguised as her friend and ends up face-to-face with her CEO boss.", cast: ["Ahn Hyo-seop", "Kim Se-jeong"], network: "SBS" },
  { id: 6, title: "Nirvana in Fire", country: "C-Drama", year: 2015, episodes: 54, rating: 9.6, genre: ["Historical", "Political"], tropes: ["Revenge Plot", "Historical", "Strategy"], moods: ["Epic saga", "Revenge energy"], emoji: "🐉", gradient: "from-emerald-900 to-teal-700", synopsis: "A brilliant strategist returns from the dead to clear his name and seek justice for his fallen comrades.", cast: ["Hu Ge", "Wang Kai"], network: "Dragon TV" },
  { id: 7, title: "Love Between Fairy and Devil", country: "C-Drama", year: 2022, episodes: 36, rating: 8.9, genre: ["Fantasy", "Romance"], tropes: ["Enemies to Lovers", "Supernatural", "Slow Burn"], moods: ["Butterflies", "Slow burn"], emoji: "🌙", gradient: "from-blue-900 to-cyan-800", synopsis: "An ancient demon lord and a little fairy accidentally switch bodies and find themselves falling in love.", cast: ["Dylan Wang", "Esther Yu"], network: "Youku" },
  { id: 8, title: "The Glory", country: "K-Drama", year: 2022, episodes: 16, rating: 9.3, genre: ["Thriller", "Drama"], tropes: ["Revenge Plot", "Dark Romance"], moods: ["Revenge energy", "Cry it out"], emoji: "⚡", gradient: "from-slate-900 to-gray-700", synopsis: "A woman who was brutally bullied in school meticulously plans her revenge against her tormentors.", cast: ["Song Hye-kyo", "Lee Do-hyun"], network: "Netflix" },
  { id: 9, title: "Her Private Life", country: "K-Drama", year: 2019, episodes: 16, rating: 8.4, genre: ["Romance", "Comedy"], tropes: ["CEO Romance", "Enemies to Lovers", "Fan culture"], moods: ["Butterflies", "Feel good"], emoji: "🎨", gradient: "from-pink-900 to-rose-700", synopsis: "A secret fangirl art curator falls for her cold new director boss.", cast: ["Park Min-young", "Kim Jae-wook"], network: "tvN" },
  { id: 10, title: "Reply 1988", country: "K-Drama", year: 2015, episodes: 20, rating: 9.4, genre: ["Slice of Life", "Romance"], tropes: ["Found Family", "Slow Burn", "Coming of age"], moods: ["Feel good", "Cry it out"], emoji: "📻", gradient: "from-orange-900 to-amber-800", synopsis: "Five families living in the same neighborhood in 1988 Seoul navigate life, love, and friendship.", cast: ["Hyeri", "Park Bo-gum"], network: "tvN" },
  { id: 11, title: "Ashes of Love", country: "C-Drama", year: 2018, episodes: 63, rating: 9.0, genre: ["Fantasy", "Romance"], tropes: ["Slow Burn", "Supernatural", "Forbidden Love"], moods: ["Butterflies", "Slow burn", "Cry it out"], emoji: "🌺", gradient: "from-red-900 to-pink-800", synopsis: "A fairy and a god fall in love despite heavenly laws forbidding their relationship.", cast: ["Yang Zi", "Deng Lun"], network: "Dragon TV" },
  { id: 12, title: "Extraordinary Attorney Woo", country: "K-Drama", year: 2022, episodes: 16, rating: 8.8, genre: ["Legal", "Romance"], tropes: ["Found Family", "Slow Burn"], moods: ["Feel good", "Butterflies"], emoji: "⚖️", gradient: "from-teal-900 to-cyan-700", synopsis: "A brilliant attorney with autism navigates the legal world and her personal life.", cast: ["Park Eun-bin", "Kang Tae-oh"], network: "ENA" },
  { id: 13, title: "Scarlet Heart Ryeo", country: "K-Drama", year: 2016, episodes: 20, rating: 8.6, genre: ["Historical", "Romance"], tropes: ["Time Travel", "Historical Joseon", "Love Triangle"], moods: ["Cry it out", "Epic saga"], emoji: "💔", gradient: "from-rose-900 to-red-800", synopsis: "A modern woman travels back in time to the Goryeo dynasty and becomes entangled with princes.", cast: ["IU", "Lee Jun-ki"], network: "MBC" },
  { id: 14, title: "Story of Yanxi Palace", country: "C-Drama", year: 2018, episodes: 70, rating: 8.9, genre: ["Historical", "Political"], tropes: ["Revenge Plot", "Historical", "Female lead"], moods: ["Revenge energy", "Epic saga"], emoji: "🏯", gradient: "from-purple-900 to-indigo-800", synopsis: "A clever girl enters the imperial palace as a servant and rises to power while seeking revenge.", cast: ["Wu Jinyan", "Nie Yuan"], network: "iQiyi" },
  { id: 15, title: "My Love from the Star", country: "K-Drama", year: 2013, episodes: 21, rating: 8.9, genre: ["Romance", "Fantasy"], tropes: ["Supernatural", "CEO Romance", "Slow Burn"], moods: ["Butterflies", "Slow burn"], emoji: "⭐", gradient: "from-blue-900 to-indigo-700", synopsis: "An alien who landed on Earth 400 years ago falls in love with a top actress just before he must leave.", cast: ["Kim Soo-hyun", "Jeon Ji-hyun"], network: "MBC" },
  { id: 16, title: "The Untamed", country: "C-Drama", year: 2019, episodes: 50, rating: 9.3, genre: ["Fantasy", "Adventure"], tropes: ["Found Family", "Supernatural", "Enemies to Lovers"], moods: ["Epic saga", "Slow burn"], emoji: "🗺️", gradient: "from-gray-900 to-slate-700", synopsis: "Two cultivators with complicated pasts are reincarnated and must solve a mystery together.", cast: ["Xiao Zhan", "Wang Yibo"], network: "Tencent" },
  { id: 17, title: "Hometown Cha-Cha-Cha", country: "K-Drama", year: 2021, episodes: 16, rating: 8.7, genre: ["Romance", "Slice of Life"], tropes: ["Found Family", "Small town romance", "Slow Burn"], moods: ["Feel good", "Butterflies"], emoji: "🌊", gradient: "from-sky-900 to-blue-700", synopsis: "A city dentist moves to a seaside village and falls for the town's handyman who helps everyone.", cast: ["Shin Min-a", "Kim Seon-ho"], network: "tvN" },
  { id: 18, title: "Moon Lovers Scarlet Heart", country: "K-Drama", year: 2016, episodes: 20, rating: 8.6, genre: ["Historical", "Romance"], tropes: ["Time Travel", "Historical Joseon", "Slow Burn"], moods: ["Cry it out", "Epic saga", "Slow burn"], emoji: "🌕", gradient: "from-violet-900 to-purple-700", synopsis: "A modern woman is transported to the Goryeo dynasty and falls for a scarred prince.", cast: ["IU", "Lee Jun-ki"], network: "MBC" },
  { id: 19, title: "When the Camellia Blooms", country: "K-Drama", year: 2019, episodes: 40, rating: 8.8, genre: ["Romance", "Mystery"], tropes: ["Found Family", "Small town", "Slow Burn"], moods: ["Feel good", "Cry it out"], emoji: "🌸", gradient: "from-red-900 to-orange-700", synopsis: "A single mother runs a bar in a small town and falls for a cheerful police officer.", cast: ["Kong Hyo-jin", "Kang Ha-neul"], network: "KBS" },
  { id: 20, title: "Queen of Tears", country: "K-Drama", year: 2024, episodes: 16, rating: 9.4, genre: ["Romance", "Drama"], tropes: ["Slow Burn", "Second chance romance", "Chaebol"], moods: ["Butterflies", "Cry it out", "Slow burn"], emoji: "👸", gradient: "from-amber-900 to-yellow-700", synopsis: "A couple on the verge of divorce rediscover their love after the wife is diagnosed with a terminal illness.", cast: ["Kim Soo-hyun", "Kim Ji-won"], network: "tvN" },
];

export const moods = [
  { id: "Butterflies", emoji: "🦋", name: "Butterflies", subtitle: "Sweet romance vibes", gradient: "from-pink-600 to-rose-500" },
  { id: "Cry it out", emoji: "😭", name: "Cry it out", subtitle: "Tears guaranteed", gradient: "from-blue-700 to-indigo-600" },
  { id: "Revenge energy", emoji: "🔥", name: "Revenge energy", subtitle: "Plot your downfall", gradient: "from-red-700 to-orange-600" },
  { id: "Feel good", emoji: "😂", name: "Feel good", subtitle: "Pure serotonin", gradient: "from-amber-600 to-yellow-500" },
  { id: "Epic saga", emoji: "⚔️", name: "Epic saga", subtitle: "Stories that span ages", gradient: "from-emerald-800 to-teal-600" },
  { id: "Slow burn", emoji: "🌙", name: "Slow burn", subtitle: "Worth the wait", gradient: "from-violet-800 to-purple-600" },
];

export const tropeCatalog = [
  { id: "Enemies to Lovers", emoji: "⚔️", gradient: "from-red-700 to-purple-700" },
  { id: "Contract Marriage", emoji: "📄", gradient: "from-amber-700 to-rose-700" },
  { id: "CEO Romance", emoji: "👑", gradient: "from-yellow-700 to-amber-600" },
  { id: "Time Travel", emoji: "⏳", gradient: "from-indigo-700 to-purple-600" },
  { id: "Found Family", emoji: "👨‍👩‍👧", gradient: "from-emerald-700 to-teal-600" },
  { id: "Revenge Plot", emoji: "⚡", gradient: "from-slate-700 to-red-700" },
  { id: "Fake Dating", emoji: "🏥", gradient: "from-pink-700 to-rose-600" },
  { id: "Historical Joseon", emoji: "🏯", gradient: "from-green-800 to-emerald-700" },
];

export const fakeReactions = [
  { id: 1, user: "minji_loves_kdrama", avatar: "🦋", text: "I'm not crying, you're crying! Episode 14 of Queen of Tears destroyed me 😭💔", drama: "Queen of Tears", reactions: { "❤️": 482, "😭": 312, "🔥": 87 } },
  { id: 2, user: "vincenzo_stan", avatar: "🗡️", text: "Vincenzo lighting that match in the rain is THE most cinematic moment in K-drama history. Hands down.", drama: "Vincenzo", reactions: { "🔥": 956, "❤️": 421, "💯": 203 } },
  { id: 3, user: "cdrama_queen", avatar: "🌙", text: "Love Between Fairy and Devil body swap arc had me feral. Dylan Wang's range is unmatched 😩", drama: "Love Between Fairy and Devil", reactions: { "❤️": 723, "🔥": 188, "🦋": 254 } },
  { id: 4, user: "second_lead_syndrome", avatar: "💔", text: "Second lead syndrome is REAL with Goblin's Reaper. Why must this show keep hurting me?!", drama: "Goblin", reactions: { "💔": 891, "😭": 432, "❤️": 167 } },
  { id: 5, user: "joseon_era_fan", avatar: "👑", text: "Mr. Sunshine still hasn't been topped. Kim Tae-ri's performance? Iconic. The cinematography? Art.", drama: "Mr. Sunshine", reactions: { "❤️": 612, "🔥": 289, "👑": 145 } },
  { id: 6, user: "binge_warrior", avatar: "📺", text: "Just finished The Glory in 2 days. Song Hye-kyo's revenge arc has me speechless. 10/10 no notes.", drama: "The Glory", reactions: { "🔥": 1024, "💯": 387, "❤️": 256 } },
  { id: 7, user: "reply_1988_forever", avatar: "📻", text: "Reply 1988 is comfort food in drama form. The Deok-sun and Taek shippers were RIGHT.", drama: "Reply 1988", reactions: { "❤️": 743, "😭": 298, "🦋": 412 } },
  { id: 8, user: "untamed_archive", avatar: "🗺️", text: "The Untamed flute scenes still give me chills 3 years later. Wei Wuxian and Lan Wangji forever ❤️", drama: "The Untamed", reactions: { "❤️": 1287, "🔥": 543, "💯": 219 } },
];

export const hotTopics = ["#QueenOfTears", "#VincenzoForever", "#TheGloryFinale", "#GoblinReaper", "#CDramaHits", "#JoseonEra"];