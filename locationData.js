// Location data for Queer Durham History Tour
// This file is modular and can be easily updated with new themes/locations

const LOCATIONS = [
    {
        id: 'blueberry-hill',
        name: 'Blueberry Hill',
        image: 'assets/SitesNoTitle/Blueberry Hill.png',
        imageHover: 'assets/SitesTitle/Blueberry Hill_title.png',
        x: '13.5%',
        y: '90.17%',
        pinOffset: 45, // Custom offset for this location (45% lower)
        description: 'Gay bar opened in the 1970s after Stonewall, serving as a meeting space for the Carolina Gay Association, an early UNC-Chapel Hill LGBTQ+ organization.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'clowns-inn',
        name: "The Clown's Inn",
        image: 'assets/SitesNoTitle/Clown\'s Inn.png',
        imageHover: 'assets/SitesTitle/Clown\'s Inn_title.png',
        x: '6.5%',
        y: '28.9%',
        description: 'Popular 1970s basement gay bar with pool tables and pinball machines, notable for attracting both gay men and a significant lesbian clientele.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'carolina-theatre',
        name: 'Carolina Theatre',
        image: 'assets/SitesNoTitle/Carolina Theatre.png',
        imageHover: 'assets/SitesTitle/Carolina Theatre_title.png',
        x: '54.4%',
        y: '35.5%',
        description: 'Historic 1924 theater hosting an annual queer film festival since 1995, now called OUTSOUTH, the Southeast\'s second-largest.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'old-courthouse',
        name: 'Durham County Courthouse',
        image: 'assets/SitesNoTitle/Old Courthouse.png',
        imageHover: 'assets/SitesTitle/Old Courthouse_title.png',
        x: '77.9%',
        y: '84%',
        description: 'Location of 1981 rally supporting the LGBTQ+ community following a fatal hate crime.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'ywca',
        name: 'Durham YWCA',
        image: 'assets/SitesNoTitle/Durham YWCA.png',
        imageHover: 'assets/SitesTitle/Durham YWCA_title.png',
        x: '32.3%',
        y: '63.1%',
        description: 'Building housing Durham Women\'s Health Collective and Triangle Area Lesbian Feminists gatherings throughout the 1980s.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'lambda-youth',
        name: 'Lambda Youth Network',
        image: 'assets/SitesNoTitle/Lamba Youth Network.png',
        imageHover: 'assets/SitesTitle/Lamba Youth Network_title.png',
        x: '58.8%',
        y: '50.6%',
        description: 'Youth-led LGBTQ+ leadership organization office location.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'pauli-murray-mural',
        name: 'Pauli Murray Mural',
        image: 'assets/SitesNoTitle/Pauli Murray Mural.png',
        imageHover: 'assets/SitesTitle/Pauli Murray Mural_title.png',
        x: '6.75%',
        y: '51.73%',
        pinOffset: 45, // Custom offset for this location (45% lower)
        description: 'Public artwork honoring influential queer civil rights activist, one of five murals throughout Durham celebrating Murray\'s legacy.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'old-library',
        name: 'Durham County Main Public Library',
        image: 'assets/SitesNoTitle/Old Library.png',
        imageHover: 'assets/SitesTitle/Old Library_title.png',
        x: '87.8%',
        y: '69.6%',
        pinOffset: 45, // Custom offset for this location (45% lower)
        description: 'Site of controversial 1986 LGBTQ+ exhibit that sparked the city\'s first Pride march with nearly 1,000 participants.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'cedar-chest',
        name: 'Cedar Chest',
        image: 'assets/SitesNoTitle/Cedar Chest.png',
        imageHover: 'assets/SitesTitle/Cedar Chest_title.png',
        x: '7.7%',
        y: '10.9%',
        description: 'Organization for lesbians of color founded in 1994, meeting in private homes to ensure confidentiality and address the lack of women in queer professional spaces.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'ringside',
        name: "Boxer's Ringside",
        image: 'assets/SitesNoTitle/Ringside.png',
        imageHover: 'assets/SitesTitle/Ringside_title.png',
        x: '60%',
        y: '63.2%',
        description: 'A 2000s venue described as "a gay bar for straight people" emphasizing local music.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'stormie-dae',
        name: 'Stormie Dae Painting',
        image: 'assets/SitesNoTitle/Stormie Dae.png',
        imageHover: 'assets/SitesTitle/Stormie Dae_title.png',
        x: '20.6%',
        y: '23.9%',
        description: 'Artwork at Sarah P. Duke Gardens featuring a prominent local drag queen, part of "The Black Lit Library" celebrating queer and BIPOC artists.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'travis-place',
        name: 'Travis Place',
        image: 'assets/SitesNoTitle/Travis Place.png',
        imageHover: 'assets/SitesTitle/Travis Place_title.png',
        x: '75.3%',
        y: '10.7%',
        description: 'One of Durham\'s first openly lesbian-owned businesses (1983), a mail-order underwear catalog achieving $1 million in annual sales.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'herbs-bar',
        name: "Herb's Bar",
        image: 'assets/SitesNoTitle/Herb\'s Bar.png',
        imageHover: 'assets/SitesTitle/Herb\'s Bar_title.png',
        x: '68.1%',
        y: '23.9%',
        description: 'Cruising spot for gay men listed in Damron Travel Guides, established after the Washington Duke Hotel\'s demolition.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'competition-bar',
        name: 'Competition Bar (711 Rigsbee Ave.)',
        image: 'assets/SitesNoTitle/Competition Bar.png',
        imageHover: 'assets/SitesTitle/Competition Bar_title.png',
        x: '64.6%',
        y: '8.45%',
        pinOffset: 45, // Custom offset for this location (45% lower)
        description: 'Long-standing queer venue housing multiple bars including Competition, Visions, Steel Blue, and The Bar, serving the LGBTQ+ community from 1991 onward.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'washington-duke',
        name: 'Washington Duke Hotel',
        image: 'assets/SitesNoTitle/Washington Duke Hotel.png',
        imageHover: 'assets/SitesTitle/Washington Duke Hotel_title.png',
        x: '66.5%',
        y: '38.3%',
        pinOffset: 45, // Custom offset for this location (45% lower)
        description: 'Demolished 1975 hotel housing Duke Tavern, an early mixed gay/straight gathering space in the 1960s.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'feminary',
        name: 'The Feminary',
        image: 'assets/SitesNoTitle/The Feminary.png',
        imageHover: 'assets/SitesTitle/The Feminary_title.png',
        x: '24.2%',
        y: '43.3%',
        pinOffset: 45, // Custom offset for this location (45% lower)
        description: 'Office space for War Resisters\' League and printing location of Feministry, a lesbian-feminist journal.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'pauli-murray-house',
        name: 'Pauli Murray House',
        image: 'assets/SitesNoTitle/Pauli Murray House.png',
        imageHover: 'assets/SitesTitle/Pauli Murray House_title.png',
        x: '15%',
        y: '71.7%',
        pinOffset: 45, // Custom offset for this location (45% lower)
        description: 'Childhood home of influential queer civil rights activist Pauli Murray.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'five-points',
        name: 'Five Points',
        image: 'assets/SitesNoTitle/Five Points.png',
        imageHover: 'assets/SitesTitle/Five Points_title.png',
        x: '50%',
        y: '48%',
        pinOffset: 15, // Standard offset (35%)
        description: 'Site of 1981 march with 300 people protesting homophobic violence and supporting LGBTQ+ rights.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    },
    {
        id: 'elizabeth-st-umc',
        name: 'Elizabeth St UMC',
        image: 'assets/SitesNoTitle/Elizabeth St UMC.png',
        imageHover: 'assets/SitesTitle/Elizabeth St UMC_title.png',
        x: '96.24%',
        y: '9.25%',
        pinOffset: 15, // Standard offset (35%)
        description: 'Historic church that served as an important gathering space for the LGBTQ+ community.',
        link: 'https://www.opendurham.org/tours/queer-history-durham'
    }
];

// Configuration for easy theme updates
const GAME_CONFIG = {
    canvasWidth: 1024,
    canvasHeight: 768,
    playerSpeed: 3,
    interactionRadius: 80, // Distance player needs to be to interact with location
    hoverRadius: 80, // Distance to trigger hover state (title image)
    pinOffset: 15, // Vertical offset for location pin (positive = lower, overlapping image)
    imageScale: 0.2 // Scale factor for building images (0.2 = 20% of original size)
};
