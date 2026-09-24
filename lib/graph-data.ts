// Curated song-collaboration graph for Crossfade.
//
// Each entry is [artistA, artistB, song] — two artists who appear together on a
// real, released track (a feature, a joint single, or a joint project), plus the
// song that links them. Edges are undirected; duplicates are de-duplicated when
// the graph is built. A single song legitimately links several pairs (e.g.
// "I'm the One" ties Justin Bieber to Quavo, Chance the Rapper and Lil Wayne).
//
// The set is intentionally centered on dense "hub" artists and stitched across
// genres (pop, hip-hop, R&B, reggaeton/latin, afrobeats, EDM, a few rock/country
// bridges) so the whole thing forms one connected web to path through.

export const EDGES: [string, string, string][] = [
  // ---- Drake ----
  ["Drake", "Rihanna", "Work"],
  ["Drake", "Future", "Jumpman"],
  ["Drake", "Lil Wayne", "The Motto"],
  ["Drake", "Nicki Minaj", "Moment 4 Life"],
  ["Drake", "Travis Scott", "SICKO MODE"],
  ["Drake", "21 Savage", "Rich Flex"],
  ["Drake", "Rick Ross", "Aston Martin Music"],
  ["Drake", "The Weeknd", "Crew Love"],
  ["Drake", "Wizkid", "One Dance"],
  ["Drake", "J. Cole", "First Person Shooter"],
  ["Drake", "Bad Bunny", "MIA"],
  ["Drake", "SZA", "Slime You Out"],
  ["Drake", "Lil Baby", "Wants and Needs"],
  ["Drake", "Young Thug", "Way 2 Sexy"],
  ["Drake", "Migos", "Walk It Talk It"],
  ["Drake", "DJ Khaled", "Popstar"],
  ["Drake", "Meek Mill", "Going Bad"],
  ["Drake", "Chris Brown", "No Guidance"],
  ["Drake", "Kendrick Lamar", "Poetic Justice"],
  ["Drake", "PARTYNEXTDOOR", "Come and See Me"],
  ["Drake", "Kanye West", "Glow"],
  ["Drake", "Sexyy Red", "Rich Baby Daddy"],
  ["Drake", "Lil Durk", "Laugh Now Cry Later"],

  // ---- Rihanna ----
  ["Rihanna", "Jay-Z", "Umbrella"],
  ["Rihanna", "Kanye West", "All of the Lights"],
  ["Rihanna", "Paul McCartney", "FourFiveSeconds"],
  ["Rihanna", "Eminem", "Love the Way You Lie"],
  ["Rihanna", "Calvin Harris", "We Found Love"],
  ["Rihanna", "Ne-Yo", "Hate That I Love You"],
  ["Rihanna", "Future", "Loveeeeeee Song"],
  ["Rihanna", "Nicki Minaj", "Fly"],
  ["Rihanna", "Coldplay", "Princess of China"],
  ["Rihanna", "DJ Khaled", "Wild Thoughts"],
  ["Rihanna", "Bryson Tiller", "Wild Thoughts"],
  ["Rihanna", "Shakira", "Can't Remember to Forget You"],
  ["Rihanna", "Chris Brown", "Birthday Cake"],
  ["Rihanna", "Kendrick Lamar", "LOYALTY."],

  // ---- Jay-Z ----
  ["Jay-Z", "Kanye West", "Otis"],
  ["Jay-Z", "Beyonce", "Crazy in Love"],
  ["Jay-Z", "Alicia Keys", "Empire State of Mind"],
  ["Jay-Z", "Justin Timberlake", "Suit & Tie"],
  ["Jay-Z", "Frank Ocean", "Oceans"],
  ["Jay-Z", "Pharrell Williams", "Frontin'"],
  ["Jay-Z", "Linkin Park", "Numb/Encore"],
  ["Jay-Z", "Nas", "Black Republican"],
  ["Jay-Z", "Mary J. Blige", "Can't Knock the Hustle"],

  // ---- Kanye West ----
  ["Kanye West", "Jamie Foxx", "Gold Digger"],
  ["Kanye West", "T-Pain", "Good Life"],
  ["Kanye West", "Kid Cudi", "Reborn"],
  ["Kanye West", "Nicki Minaj", "Monster"],
  ["Kanye West", "Chris Brown", "Waves"],
  ["Kanye West", "Ty Dolla Sign", "Fade"],
  ["Kanye West", "Travis Scott", "Watch"],
  ["Kanye West", "Paul McCartney", "Only One"],
  ["Kanye West", "John Legend", "Blame Game"],
  ["Kanye West", "Big Sean", "Mercy"],
  ["Kanye West", "Pusha T", "Runaway"],
  ["Kanye West", "Frank Ocean", "No Church in the Wild"],
  ["Kanye West", "The Weeknd", "Hurricane"],
  ["Kanye West", "Lil Pump", "I Love It"],
  ["Kanye West", "070 Shake", "Ghost Town"],
  ["Kanye West", "Charlie Wilson", "Bound 2"],
  ["Kanye West", "Playboi Carti", "Off the Grid"],
  ["Kanye West", "Fivio Foreign", "Off the Grid"],
  ["Kanye West", "Chance the Rapper", "Ultralight Beam"],
  ["Kanye West", "Katy Perry", "E.T."],

  // ---- Beyonce ----
  ["Beyonce", "Shakira", "Beautiful Liar"],
  ["Beyonce", "Lady Gaga", "Telephone"],
  ["Beyonce", "Drake", "Mine"],
  ["Beyonce", "Nicki Minaj", "Feeling Myself"],
  ["Beyonce", "Sean Paul", "Baby Boy"],
  ["Beyonce", "Kendrick Lamar", "Freedom"],
  ["Beyonce", "Megan Thee Stallion", "Savage"],
  ["Beyonce", "Wizkid", "Brown Skin Girl"],
  ["Beyonce", "Frank Ocean", "Superpower"],
  ["Beyonce", "Miley Cyrus", "II Most Wanted"],
  ["Beyonce", "Post Malone", "Levii's Jeans"],
  ["Beyonce", "J Balvin", "Mi Gente"],
  ["Beyonce", "Ed Sheeran", "Perfect"],
  ["Beyonce", "Coldplay", "Hymn for the Weekend"],
  ["Beyonce", "Eminem", "Walk on Water"],

  // ---- Nicki Minaj ----
  ["Nicki Minaj", "Ariana Grande", "Side to Side"],
  ["Nicki Minaj", "Jessie J", "Bang Bang"],
  ["Nicki Minaj", "Lil Wayne", "High School"],
  ["Nicki Minaj", "Migos", "MotorSport"],
  ["Nicki Minaj", "Cardi B", "MotorSport"],
  ["Nicki Minaj", "David Guetta", "Hey Mama"],
  ["Nicki Minaj", "Madonna", "Give Me All Your Luvin'"],
  ["Nicki Minaj", "2 Chainz", "Beez in the Trap"],
  ["Nicki Minaj", "Doja Cat", "Say So"],
  ["Nicki Minaj", "Ice Spice", "Barbie World"],
  ["Nicki Minaj", "Justin Bieber", "Beauty and a Beat"],
  ["Nicki Minaj", "Katy Perry", "Swish Swish"],
  ["Nicki Minaj", "Big Sean", "Dance (A$$)"],
  ["Nicki Minaj", "BTS", "IDOL"],
  ["Nicki Minaj", "Chris Brown", "Love More"],
  ["Nicki Minaj", "Lil Uzi Vert", "The Way Life Goes"],

  // ---- Ariana Grande ----
  ["Ariana Grande", "The Weeknd", "Love Me Harder"],
  ["Ariana Grande", "Mac Miller", "The Way"],
  ["Ariana Grande", "Iggy Azalea", "Problem"],
  ["Ariana Grande", "Social House", "boyfriend"],
  ["Ariana Grande", "Justin Bieber", "Stuck with U"],
  ["Ariana Grande", "Lady Gaga", "Rain on Me"],
  ["Ariana Grande", "Doja Cat", "motive"],

  // ---- The Weeknd ----
  ["The Weeknd", "Daft Punk", "Starboy"],
  ["The Weeknd", "Kendrick Lamar", "Pray for Me"],
  ["The Weeknd", "Future", "Low Life"],
  ["The Weeknd", "Lana Del Rey", "Lust for Life"],
  ["The Weeknd", "Post Malone", "One Right Now"],
  ["The Weeknd", "Doja Cat", "You Right"],
  ["The Weeknd", "Playboi Carti", "Timeless"],
  ["The Weeknd", "Swedish House Mafia", "Moth to a Flame"],
  ["The Weeknd", "Gesaffelstein", "Lost in the Fire"],
  ["The Weeknd", "Travis Scott", "Skeletons"],

  // ---- Latin / reggaeton ----
  ["Bad Bunny", "J Balvin", "I Like It"],
  ["Bad Bunny", "Cardi B", "I Like It"],
  ["Bad Bunny", "Jhay Cortez", "Dakiti"],
  ["Bad Bunny", "Rosalia", "La Noche de Anoche"],
  ["Bad Bunny", "Travis Scott", "K-POP"],
  ["J Balvin", "Willy William", "Mi Gente"],
  ["J Balvin", "Cardi B", "I Like It"],
  ["J Balvin", "Pharrell Williams", "Safari"],
  ["J Balvin", "Rosalia", "Con Altura"],
  ["Cardi B", "Megan Thee Stallion", "WAP"],
  ["Cardi B", "Bruno Mars", "Finesse"],
  ["Cardi B", "Maroon 5", "Girls Like You"],
  ["Cardi B", "Offset", "Clout"],
  ["Cardi B", "Migos", "MotorSport"],
  ["Cardi B", "BLACKPINK", "Bet You Wanna"],
  ["Rosalia", "Travis Scott", "TKN"],
  ["Rosalia", "The Weeknd", "La Fama"],
  ["Shakira", "Maluma", "Chantaje"],
  ["Shakira", "Wyclef Jean", "Hips Don't Lie"],
  ["Shakira", "Bizarrap", "Bzrp Music Sessions, Vol. 53"],
  ["Bizarrap", "Quevedo", "Bzrp Music Sessions, Vol. 52"],
  ["Maluma", "Madonna", "Medellin"],
  ["Daddy Yankee", "Luis Fonsi", "Despacito"],
  ["Luis Fonsi", "Justin Bieber", "Despacito (Remix)"],

  // ---- Justin Bieber ----
  ["Justin Bieber", "Ed Sheeran", "I Don't Care"],
  ["Justin Bieber", "DJ Khaled", "I'm the One"],
  ["Justin Bieber", "Quavo", "I'm the One"],
  ["Justin Bieber", "Chance the Rapper", "I'm the One"],
  ["Justin Bieber", "Lil Wayne", "I'm the One"],
  ["Justin Bieber", "Skrillex", "Where Are U Now"],
  ["Justin Bieber", "Diplo", "Where Are U Now"],
  ["Justin Bieber", "Benny Blanco", "Lonely"],
  ["Justin Bieber", "Daniel Caesar", "Peaches"],
  ["Justin Bieber", "Giveon", "Peaches"],
  ["Justin Bieber", "The Kid LAROI", "Stay"],
  ["Justin Bieber", "Big Sean", "As Long as You Love Me"],
  ["Justin Bieber", "David Guetta", "2U"],
  ["Justin Bieber", "Chris Brown", "Next to You"],
  ["Justin Bieber", "Ludacris", "Baby"],
  ["Justin Bieber", "Major Lazer", "Cold Water"],

  // ---- Ed Sheeran ----
  ["Ed Sheeran", "Eminem", "River"],
  ["Ed Sheeran", "Travis Scott", "Antisocial"],
  ["Ed Sheeran", "Khalid", "Beautiful People"],
  ["Ed Sheeran", "Taylor Swift", "Everything Has Changed"],
  ["Ed Sheeran", "Andrea Bocelli", "Perfect Symphony"],

  // ---- Taylor Swift ----
  ["Taylor Swift", "Future", "End Game"],
  ["Taylor Swift", "Kendrick Lamar", "Bad Blood"],
  ["Taylor Swift", "Bon Iver", "exile"],
  ["Taylor Swift", "HAIM", "no body, no crime"],
  ["Taylor Swift", "Brendon Urie", "ME!"],
  ["Taylor Swift", "Post Malone", "Fortnight"],
  ["Taylor Swift", "Ice Spice", "Karma"],
  ["Taylor Swift", "Lana Del Rey", "Snow on the Beach"],
  ["Taylor Swift", "Zayn", "I Don't Wanna Live Forever"],

  // ---- Zayn / Sia ----
  ["Zayn", "Sia", "Dusk Till Dawn"],
  ["Sia", "David Guetta", "Titanium"],
  ["Sia", "Flo Rida", "Wild Ones"],
  ["Sia", "Sean Paul", "Cheap Thrills"],
  ["Sia", "Eminem", "Beautiful Pain"],

  // ---- David Guetta ----
  ["David Guetta", "Usher", "Without You"],
  ["David Guetta", "Flo Rida", "Club Can't Handle Me"],
  ["David Guetta", "Akon", "Sexy Chick"],
  ["David Guetta", "Bebe Rexha", "I'm Good (Blue)"],
  ["David Guetta", "Rihanna", "Who's That Chick?"],
  ["David Guetta", "Kid Cudi", "Memories"],

  // ---- Calvin Harris ----
  ["Calvin Harris", "Dua Lipa", "One Kiss"],
  ["Calvin Harris", "Rag'n'Bone Man", "Giant"],
  ["Calvin Harris", "Sam Smith", "Promises"],
  ["Calvin Harris", "Frank Ocean", "Slide"],
  ["Calvin Harris", "Quavo", "Slide"],
  ["Calvin Harris", "Ellie Goulding", "Outside"],
  ["Calvin Harris", "Pharrell Williams", "Feels"],
  ["Calvin Harris", "Katy Perry", "Feels"],
  ["Calvin Harris", "Big Sean", "Feels"],
  ["Calvin Harris", "John Newman", "Blame"],
  ["Calvin Harris", "Ne-Yo", "Let's Go"],

  // ---- Dua Lipa ----
  ["Dua Lipa", "DaBaby", "Levitating (Remix)"],
  ["Dua Lipa", "Miley Cyrus", "Prisoner"],
  ["Dua Lipa", "Elton John", "Cold Heart"],
  ["Dua Lipa", "Angele", "Fever"],
  ["Dua Lipa", "BLACKPINK", "Kiss and Make Up"],
  ["Dua Lipa", "Sean Paul", "No Lie"],

  // ---- K-pop cluster ----
  ["BLACKPINK", "Selena Gomez", "Ice Cream"],
  ["BLACKPINK", "Lady Gaga", "Sour Candy"],
  ["BTS", "Halsey", "Boy with Luv"],
  ["BTS", "Coldplay", "My Universe"],
  ["BTS", "Megan Thee Stallion", "Butter (Remix)"],
  ["Rose", "Bruno Mars", "APT."],

  // ---- Halsey / Chainsmokers / Coldplay ----
  ["Halsey", "The Chainsmokers", "Closer"],
  ["Halsey", "Marshmello", "Be Kind"],
  ["Halsey", "G-Eazy", "Him & I"],
  ["Halsey", "Benny Blanco", "Eastside"],
  ["Halsey", "Khalid", "Eastside"],
  ["Benny Blanco", "Khalid", "Eastside"],
  ["Halsey", "Post Malone", "Die for Me"],
  ["The Chainsmokers", "Coldplay", "Something Just Like This"],
  ["The Chainsmokers", "Daya", "Don't Let Me Down"],
  ["Coldplay", "Selena Gomez", "Let Somebody Go"],

  // ---- Future ----
  ["Future", "Metro Boomin", "We Still Don't Trust You"],
  ["Future", "Young Thug", "Relationship"],
  ["Future", "Kendrick Lamar", "Like That"],
  ["Future", "Juice WRLD", "Fine China"],
  ["Future", "Lil Uzi Vert", "Patek"],

  // ---- Metro Boomin / 21 Savage ----
  ["Metro Boomin", "The Weeknd", "Creepin'"],
  ["Metro Boomin", "21 Savage", "Creepin'"],
  ["Metro Boomin", "Kendrick Lamar", "Like That"],
  ["Metro Boomin", "John Legend", "On Time"],
  ["21 Savage", "J. Cole", "a lot"],
  ["21 Savage", "Post Malone", "rockstar"],
  ["21 Savage", "Offset", "Ric Flair Drip"],

  // ---- Post Malone ----
  ["Post Malone", "Swae Lee", "Sunflower"],
  ["Post Malone", "Ty Dolla Sign", "Psycho"],
  ["Post Malone", "Doja Cat", "I Like You (A Happier Song)"],
  ["Post Malone", "Morgan Wallen", "I Had Some Help"],
  ["Post Malone", "Roddy Ricch", "Cooped Up"],
  ["Post Malone", "Young Thug", "Goodbyes"],
  ["Post Malone", "Ozzy Osbourne", "Take What You Want"],
  ["Post Malone", "Travis Scott", "Take What You Want"],
  ["Ozzy Osbourne", "Travis Scott", "Take What You Want"],

  // ---- Rock / other bridges ----
  ["Kendrick Lamar", "U2", "XXX."],
  ["Nas", "Damian Marley", "As We Enter"],
  ["Damian Marley", "Skrillex", "Make It Bun Dem"],
  ["Skrillex", "Rick Ross", "Purple Lamborghini"],
  ["Skrillex", "Diplo", "Where Are U Now"],

  // ---- Kendrick / SZA / Doja ----
  ["Kendrick Lamar", "SZA", "All the Stars"],
  ["Kendrick Lamar", "Anderson .Paak", "Tints"],
  ["Kendrick Lamar", "ScHoolboy Q", "Collard Greens"],
  ["Kendrick Lamar", "Baby Keem", "family ties"],
  ["Kendrick Lamar", "Travis Scott", "goosebumps"],
  ["SZA", "Doja Cat", "Kiss Me More"],
  ["SZA", "Travis Scott", "Love Galore"],
  ["Doja Cat", "Saweetie", "Best Friend"],
  ["Doja Cat", "Tyga", "Juicy"],

  // ---- Travis Scott / Migos ----
  ["Travis Scott", "Young Thug", "Pick Up the Phone"],
  ["Travis Scott", "Quavo", "Pick Up the Phone"],
  ["Young Thug", "Quavo", "Pick Up the Phone"],
  ["Migos", "Quavo", "Stir Fry"],
  ["Migos", "Offset", "Bad and Boujee"],

  // ---- Lil Wayne / Eminem / classics ----
  ["Lil Wayne", "Eminem", "No Love"],
  ["Lil Wayne", "Chris Brown", "Loyal"],
  ["Lil Wayne", "Kendrick Lamar", "Mona Lisa"],
  ["Lil Wayne", "Bruno Mars", "Mirror"],
  ["Lil Wayne", "2 Chainz", "Duffle Bag Boy"],
  ["Lil Wayne", "Rick Ross", "John"],
  ["Eminem", "Dr. Dre", "Forgot About Dre"],
  ["Eminem", "50 Cent", "Patiently Waiting"],
  ["Eminem", "Nate Ruess", "Headlights"],
  ["Eminem", "Juice WRLD", "Godzilla"],
  ["Eminem", "Pink", "Won't Back Down"],
  ["Eminem", "Skylar Grey", "C'mon Let Me Ride"],
  ["Eminem", "Snoop Dogg", "From the D 2 the LBC"],
  ["Dr. Dre", "Snoop Dogg", "Nuthin' but a G Thang"],
  ["50 Cent", "Snoop Dogg", "P.I.M.P."],

  // ---- Snoop / Pharrell / Wiz ----
  ["Snoop Dogg", "Katy Perry", "California Gurls"],
  ["Snoop Dogg", "Pharrell Williams", "Drop It Like It's Hot"],
  ["Snoop Dogg", "Wiz Khalifa", "Young, Wild & Free"],
  ["Wiz Khalifa", "Charlie Puth", "See You Again"],
  ["Charlie Puth", "Selena Gomez", "We Don't Talk Anymore"],
  ["Charlie Puth", "Meghan Trainor", "Marvin Gaye"],
  ["Selena Gomez", "Marshmello", "Wolves"],

  // ---- Marshmello / Clean Bandit / Sean Paul ----
  ["Marshmello", "Bastille", "Happier"],
  ["Marshmello", "Anne-Marie", "FRIENDS"],
  ["Anne-Marie", "Clean Bandit", "Rockabye"],
  ["Clean Bandit", "Sean Paul", "Rockabye"],
  ["Anne-Marie", "Sean Paul", "Rockabye"],
  ["Clean Bandit", "Jess Glynne", "Rather Be"],
  ["Clean Bandit", "Demi Lovato", "Solo"],

  // ---- Pharrell / Daft Punk / Timbaland ----
  ["Pharrell Williams", "Daft Punk", "Get Lucky"],
  ["Pharrell Williams", "Robin Thicke", "Blurred Lines"],
  ["Pharrell Williams", "Gwen Stefani", "Can I Have It Like That"],
  ["Justin Timberlake", "Timbaland", "SexyBack"],
  ["Timbaland", "Nelly Furtado", "Promiscuous"],
  ["Timbaland", "OneRepublic", "Apologize"],

  // ---- Usher / Ludacris / Chris Brown ----
  ["Usher", "Lil Jon", "Yeah!"],
  ["Usher", "Ludacris", "Yeah!"],
  ["Ludacris", "Lil Jon", "Yeah!"],
  ["Usher", "will.i.am", "OMG"],
  ["Usher", "Alicia Keys", "My Boo"],
  ["Usher", "Summer Walker", "Come Thru"],
  ["Usher", "Chris Brown", "New Flame"],
  ["Chris Brown", "Rick Ross", "New Flame"],
  ["Chris Brown", "Tyga", "Ayo"],

  // ---- Rick Ross / Meek / Wale ----
  ["Rick Ross", "Meek Mill", "Ima Boss"],
  ["Rick Ross", "Wale", "600 Benz"],

  // ---- J. Cole ----
  ["J. Cole", "Miguel", "Power Trip"],
  ["J. Cole", "6LACK", "Pretty Little Fears"],
  ["J. Cole", "Lil Durk", "All My Life"],

  // ---- Lana / A$AP / UK ----
  ["Lana Del Rey", "A$AP Rocky", "Groupie Love"],
  ["A$AP Rocky", "Skepta", "Praise the Lord (Da Shine)"],
  ["Central Cee", "Dave", "Sprinter"],
  ["Central Cee", "Lil Baby", "Band4Band"],

  // ---- Lil Baby / Gunna / DaBaby / Roddy ----
  ["Lil Baby", "Gunna", "Drip Too Hard"],
  ["Gunna", "Young Thug", "Ski"],
  ["DaBaby", "Roddy Ricch", "Rockstar"],
  ["Roddy Ricch", "Mustard", "High Fashion"],

  // ---- Juice WRLD / Uzi / Carti / LAROI ----
  ["Juice WRLD", "Benny Blanco", "Graduation"],
  ["Juice WRLD", "The Kid LAROI", "Go"],
  ["Lil Uzi Vert", "Playboi Carti", "Shoota"],

  // ---- Katy / Gaga / Bruno ----
  ["Katy Perry", "Juicy J", "Dark Horse"],
  ["Lady Gaga", "Bradley Cooper", "Shallow"],
  ["Lady Gaga", "Colby O'Donis", "Just Dance"],
  ["Bruno Mars", "Mark Ronson", "Uptown Funk"],
  ["Bruno Mars", "Anderson .Paak", "Leave the Door Open"],
  ["Bruno Mars", "B.o.B", "Nothin' on You"],
  ["Bruno Mars", "Travie McCoy", "Billionaire"],
  ["Mark Ronson", "Miley Cyrus", "Nothing Breaks Like a Heart"],
  ["B.o.B", "Hayley Williams", "Airplanes"],

  // ---- EDM tail ----
  ["Major Lazer", "Diplo", "Lean On"],
  ["Major Lazer", "MO", "Lean On"],
  ["Diplo", "MO", "Lean On"],
];
