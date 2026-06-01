import type {
  MapHotspotConfig,
  MapSentinelConfig,
  NavigationLink,
  SocialLink,
} from "@/types";

const HOUSE_HOTSPOT_PATH =
  "m 618.56041,432.7902 -2.82456,1.02344 -0.53396,1.71677 -3.83728,1.58725 -2.4935,1.24335 -1.94866,1.7964 -0.30245,3.01921 -1.24373,2.32962 0.003,3.42365 -0.77095,2.87574 -0.34466,3.00555 -0.74983,2.84452 -0.74534,2.85559 -1.40409,1.86782 -1.40011,3.0477 -0.0235,3.37297 -0.75577,3.02947 -0.70606,2.8743 -0.65203,2.90149 1.48623,2.90561 -2.66699,2.20719 -1.13355,3.454 2.94358,0.39923 4.15907,0.69052 1.43897,0.0503 2.90693,0.28118 2.70801,0.1136 2.77632,0.15204 3.0561,-0.15436 2.90955,0.38957 2.96866,0.47164 2.61917,-0.3433 4.77101,1.02513 1.67263,0.48487 3.08042,0.81779 3.56084,0.48772 0.8921,-0.11179 2.41329,-1.72991 1.22397,-2.99823 1.8934,-1.28966 3.0265,-1.65816 0.62701,-2.03026 3.69238,0.61968 1.98979,0.0419 3.16722,0.2752 2.48965,-0.70189 3.30179,-0.002 2.93317,-0.42212 3.38937,-0.15201 3.15516,-0.76217 3.26946,-0.0238 3.16888,0.57852 5.03588,0.78015 1.70192,0.24861 1.84922,-1.11495 3.49008,0.69718 3.47325,0.87188 2.32409,0.44987 4.11493,0.83682 1.8407,0.39021 4.07989,0.78005 1.71779,0.34078 2.57888,0.23755 4.04263,0.97106 2.4381,0.61826 3.10196,0.80588 3.13984,0.83352 3.62706,0.72507 1.06095,-0.5211 3.55571,1.44635 -0.11943,-3.26287 1.72972,-2.32041 1.63488,-2.5188 0.0904,-3.72598 -0.0877,-2.44828 0.94713,-2.67424 -0.0764,-3.05083 -0.0305,-3.87656 0.11265,-1.64554 0.51654,-2.72778 -0.20582,-3.41895 -0.27428,-2.75228 1.5268,-2.157 -0.48984,-3.62814 -0.44746,-2.74825 -0.1298,-2.58415 -0.0483,-2.81235 0.27432,-2.78514 -3.54513,-0.92875 -2.46608,-0.56077 -1.41392,0.21054 -4.63652,-1.28019 -2.93046,-0.25935 -2.98752,-0.10081 -1.49011,0.28591 -4.74391,-0.3338 -1.6714,0.27511 -4.28031,-0.26026 -3.07476,-1.41229 -3.29762,-0.54969 -0.79602,0.0806 -3.65133,0.17825 -3.80615,0.0429 -2.76862,0.0522 -3.22322,0.0704 -3.22748,-0.0471 -1.69649,0.13055 -3.06903,0.10317 -2.84482,-0.12064 -2.42123,0.0386 -4.528,0.0892 -3.22683,0.0213 -3.44694,-0.20891 -3.05228,-0.37588 -2.21509,0.1979 -3.46521,-0.0588 -3.5957,-0.86533 -2.64811,-0.12588 -2.97721,-0.067 -3.30255,-0.47749 -2.70965,0.0161 -2.83,0.0988 -3.41709,-0.16681 -2.31053,0.25735 -2.97295,0.21281 -2.63379,0.18552 z";

export const siteConfig = {
  site: {
    name: "Wilhalla",
    url: "https://www.wilhalla.be",
    lang: "nl",
    locale: "nl_BE",
    themeColor: "#fdfcfc",
    defaultDescription:
      "Wilhalla is een plek voor tuin, welzijn, yoga, verhuur en ontmoeting.",
    footerTagline: "Wilhalla — Velt-ecotuin sinds 1962",
    assets: {
      favicon: "/favicon.png",
      ico: "/favicon.ico",
      appleTouchIcon: "/apple-touch-icon.png",
      manifest: "/manifest.json",
      ogImage: {
        src: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Illustratieve kaart van Wilhalla met de naam Wilhalla.",
      },
    },
  },

  contact: {
    name: "Wilhalla",
    email: "wilhalla@hotmail.com",
    mailto: "mailto:wilhalla@hotmail.com",
  },

  location: {
    label: "Wilhalla, Halle-Zoersel",
    googleMapsUrl:
      "https://www.google.com/maps/place/Wilhalla/@51.2488877,4.6552221,664m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47c3ff0068921933:0xf93137ee4b45fd!8m2!3d51.2488844!4d4.657797!16s%2Fg%2F11mzhd7yl5?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D",
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?hl=nl&q=Wilhalla%2C%20Halle-Zoersel&ll=51.2488844%2C4.657797&z=17&t=k&output=embed",
    iframeTitle: "Kaart naar Wilhalla in Halle-Zoersel",
  },

  socialLinks: [
    {
      label: "The Yurt Wilhalla",
      href: "https://www.instagram.com/theyurt__wilhalla?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      icon: "instagram",
    },
    {
      label: "Wilhalla Blooms",
      href: "https://www.instagram.com/wilhallablooms?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      icon: "instagram",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61555323344203",
      icon: "facebook",
    },
  ] satisfies readonly SocialLink[],

  navigation: {
    links: [
      { label: "Over ons", to: "/over-ons", icon: "users" },
      { label: "Welzijn", to: "/welzijn", icon: "heart" },
      { label: "Yoga", to: "/yoga", icon: "flower" },
      { label: "Verhuur", to: "/verhuur", icon: "tent" },
      { label: "Agenda", to: "/agenda", icon: "calendar" },
      { label: "Galerij", to: "/gallery", icon: "images" },
    ] satisfies readonly NavigationLink[],
  },

  pages: {
    agenda: {
      title: "Agenda",
      description: "Workshops, activiteiten en evenementen op Wilhalla.",
      intro: "Workshops, activiteiten en evenementen op Wilhalla.",
    },
    gallery: {
      title: "Galerij",
      description: "Beelden van Wilhalla, de tuin, de yurt en activiteiten.",
      intro: "Beelden van Wilhalla, de tuin, de yurt en activiteiten.",
    },
    tuin: {
      title: "Over ons",
      description:
        "Wilhalla is een plek om te vertragen, te verbinden en te groeien, samen, op het ritme van de natuur.",
      intro:
        "Welkom bij Wilhalla, een idyllische plek in het groene Halle-Zoersel, waar natuur, rust en verbinding samenkomen.",
      subPages: [{ label: "Samentuin", to: "/over-ons/samentuin" }],
      subPageNavLabel: "Over ons pagina's",
    },
    samentuin: {
      title: "Samentuin",
      description:
        "Samen zorgen voor de moestuin, fruitkooien en boomgaard van Wilhalla.",
      intro:
        "Iedereen met een hart voor tuinieren en natuur is welkom om mee te groeien in onze werking.",
      breadcrumb: [
        { label: "Over ons", to: "/over-ons" },
        { label: "Samentuin" },
      ],
    },
    welzijn: {
      title: "Welzijn",
      description:
        "Vanuit een holistische benadering voor lichaam en geest biedt Wilhalla therapieën, workshops en coaching aan.",
      intro: "Een holistische aanpak voor lichaam en geest.",
      subPages: [
        { label: "Fasciatherapie", to: "/welzijn/fasciatherapie" },
        { label: "Paardencoaching", to: "/welzijn/paardencoaching" },
        { label: "Muziektherapie", to: "/welzijn/muziektherapie" },
        { label: "Limfedrainage", to: "/welzijn/limfedrainage" },
        { label: "Kinetic Chain Release", to: "/welzijn/kcr" },
        { label: "Veerkracht in Beweging", to: "/welzijn/veerkracht" },
      ],
      subPageNavLabel: "Welzijn aanbod",
    },
    fasciatherapie: {
      title: "Fasciatherapie",
      description:
        "Fasciatherapie bij Wilhalla: een zachte, diepwerkende methode voor lichaam en geest.",
      intro:
        "Een zachte, diepwerkende methode waarbij lichaam en geest samen benaderd worden.",
      breadcrumb: [
        { label: "Welzijn", to: "/welzijn" },
        { label: "Fasciatherapie" },
      ],
    },
    paardencoaching: {
      title: "Paardencoaching",
      description:
        "Paardencoaching bij Wilhalla met paarden in vrijheid en verbinding in wederzijds respect.",
      intro: "Paarden oordelen niet en communiceren met je onderbewuste.",
      breadcrumb: [
        { label: "Welzijn", to: "/welzijn" },
        { label: "Paardencoaching" },
      ],
    },
    muziektherapie: {
      title: "Muziektherapie",
      description:
        "Muziektherapie, Sound & Senses en live muziek bij Wilhalla.",
      intro: "Muziek is een onmisbaar onderdeel van de werking van Wilhalla.",
      breadcrumb: [
        { label: "Welzijn", to: "/welzijn" },
        { label: "Muziektherapie" },
      ],
    },
    limfedrainage: {
      title: "Limfedrainage",
      description: "Limfedrainage bij Wilhalla.",
      intro: "Placeholder — content wordt later aangevuld.",
      placeholderText: "Deze pagina krijgt binnenkort meer inhoud.",
      breadcrumb: [
        { label: "Welzijn", to: "/welzijn" },
        { label: "Limfedrainage" },
      ],
    },
    kcr: {
      title: "Kinetic Chain Release",
      description: "Kinetic Chain Release bij Wilhalla.",
      intro: "Placeholder — content wordt later aangevuld.",
      placeholderText: "Deze pagina krijgt binnenkort meer inhoud.",
      breadcrumb: [
        { label: "Welzijn", to: "/welzijn" },
        { label: "Kinetic Chain Release" },
      ],
    },
    veerkracht: {
      title: "Veerkracht in Beweging",
      description: "Veerkracht in Beweging bij Wilhalla.",
      intro: "Placeholder — content wordt later aangevuld.",
      placeholderText: "Deze pagina krijgt binnenkort meer inhoud.",
      breadcrumb: [
        { label: "Welzijn", to: "/welzijn" },
        { label: "Veerkracht in Beweging" },
      ],
    },
    verhuur: {
      title: "Verhuur",
      description:
        "De yurt en gerenoveerde schuur van Wilhalla zijn beschikbaar voor workshops, retraites, bijeenkomsten en feesten in vertrouwde kring.",
      intro:
        "Unieke plekken midden in het groen, waar rust en eenvoud centraal staan.",
    },
    yoga: {
      title: "Yoga en dans",
      description:
        "Yoga en danslessen en workshops tussen het groen of in de yurt.",
      intro: "Lessen en workshops tussen het groen of in de yurt.",
    },
  },

  agenda: {
    calendarId:
      "c07e330204f880b8d0c2301f55cbe9c93c4bd25f811a33670d9c3c4c635cca1c@group.calendar.google.com",
    calendarIcsUrl:
      "https://calendar.google.com/calendar/ical/c07e330204f880b8d0c2301f55cbe9c93c4bd25f811a33670d9c3c4c635cca1c%40group.calendar.google.com/public/basic.ics",
    calendarGoogleUrl:
      "https://calendar.google.com/calendar/u/0?cid=c07e330204f880b8d0c2301f55cbe9c93c4bd25f811a33670d9c3c4c635cca1c%40group.calendar.google.com",
    googleCalendarSrc:
      "https://calendar.google.com/calendar/embed?height=620&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FBrussels&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&src=c07e330204f880b8d0c2301f55cbe9c93c4bd25f811a33670d9c3c4c635cca1c%40group.calendar.google.com&color=%23000000",
    calendarTitle: "Wilhalla kalender",
    calendarDescription: "Live agenda, gesynchroniseerd via Google Calendar.",
    calendarTimezone: "Europe/Brussels",
    iframeTitle: "Wilhalla agenda",
    openInGoogleLabel: "Open in Google Calendar",
    todayLabel: "Vandaag",
    previousMonthLabel: "Vorige maand",
    nextMonthLabel: "Volgende maand",
    weekdays: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
    locale: "nl-BE",
    maxEventsPerDay: 3,
    maxUpcomingEvents: 5,
    moreEventsLabel: "meer",
    upcomingEyebrow: "Eerstvolgende",
    upcomingTitle: "Activiteiten",
    noUpcomingEventsText:
      "Er staan momenteel geen komende activiteiten in de kalender.",
    defaultEventTitle: "Activiteit",
    moreInfoLabel: "Meer info",
  },

  gallery: {
    fallbackAltPrefix: "Sfeerbeeld",
    altTextByOriginalName: {
      "IMG_2801.heic": "Een paard graast in de avondzon",
      "WhatsApp Image 2026-03-22 at 17.38.34.jpeg":
        "Paardencoaching met twee paarden",
      "c3400f04-d7a7-45fc-85bc-954c84c6112a.JPG":
        "Paardencoaching op het domein",
      "WhatsApp Image 2026-04-24 at 09.52.33.jpeg":
        "Wegwijzer naar Wilhalla en de samentuin",
      "57361d95-0a45-43c7-9bee-1e721ab9a9c4.jpg": "Welkomsbord aan de ingang",
      "IMG_3043.heic": "Paard in winterlandschap",
      "IMG_4490.JPG": "Tomaten in de serre van de samentuin",
      "WhatsApp Image 2026-03-10 at 21.33.30.jpeg": "Pad door de samentuin",
      "IMG_9842.JPG": "Yoga in de yurt",
      "IMG_5118.JPG": "Rondleiding in de tuin",
      "WhatsApp Image 2026-03-10 at 21.33.34.jpeg":
        "Moestuinbedden in de samentuin",
      "f4921805-7e0d-4faf-bcb8-2536195617d5.JPG":
        "Verbonden moment met een paard",
      "IMG_5158.JPG": "Paard bij de stallen",
      "IMG_7207.JPG": "Avondlijke bijeenkomst in de yurt",
      "IMG_2812.heic": "Behandeling in de yurt",
      "IMG_5090.JPG": "Live muziek in de tuin",
      "IMG_5172.JPG": "Muziekmoment in de yurt",
      "IMG_5985.JPG": "Houten wegwijzers tussen het groen",
      "WhatsApp Image 2026-05-11 at 10.01.04.jpeg": "Warme avond bij de kachel",
    } satisfies Record<string, string>,
  },

  map: {
    dimensions: { width: 4000, height: 2337 },
    desktopMediaQuery: "(min-width: 1024px)",
    mobileMediaQuery: "(max-width: 1023px)",
    desktopImgSizes: "(min-width: 1024px) 4000px, 171vh",
    sceneSizes: "171vh",
    mobileInitialScrollDivisor: 1.65,
    assets: {
      placeholderSrc: "/wilhalla_map-640.webp",
      desktopWebpSrc: "/wilhalla_map-4000.webp",
      fallbackSrc: "/wilhalla_map.jpg",
      fallbackSrcSet: "/wilhalla_map.jpg 4000w",
      webpSrcSet: [
        "/wilhalla_map-640.webp 640w",
        "/wilhalla_map-1024.webp 1024w",
        "/wilhalla_map-1920.webp 1920w",
        "/wilhalla_map-2560.webp 2560w",
        "/wilhalla_map-3840.webp 3840w",
        "/wilhalla_map-4000.webp 4000w",
      ],
    },
    imageAlt: "Kaart van Wilhalla",
    defaultSentinelPadding: 40,
    explanationCard: {
      defaultWidth: 640,
      defaultHeight: 300,
    },
    timings: {
      introStartDelayMs: 450,
      desktopIntroStepMs: 760,
      mobileIntroStepMs: 560,
      desktopIntroOverlayTransitionMs: 420,
      mobileIntroOverlayTransitionMs: 220,
      onboardingStartDelayMs: 160,
      desktopOverlayTransitionMs: 1600,
    },
    hints: {
      mobile: {
        eyebrow: "Verken",
        message: "Scroll naar links of rechts om over de kaart te bewegen.",
      },
      desktop: {
        eyebrow: "Ontdek",
        message: "Beweeg de muis over het landschap.",
      },
    },
    hotspots: [
      {
        id: "woning",
        label: "Woning & Schuur",
        route: "/verhuur",
        path: HOUSE_HOTSPOT_PATH,
        labelPosition: { x: 660, y: 460 },
      },
    ] satisfies readonly MapHotspotConfig[],
    sentinels: [
      {
        id: "horses",
        x1: 400,
        y1: 1350,
        x2: 990,
        y2: 1900,
        hoverImages: [
          "/map-overlays/hover/horses.webp",
          "/map-overlays/text/horses.webp",
        ],
        explanation: {
          text: "Onze kudde leeft in vrijheid en nodigt uit tot rustige ontmoeting en paardencoaching.",
          x: 420,
          y: 1030,
          width: 710,
        },
        padding: 40,
      },
      {
        id: "barn",
        x1: 2050,
        y1: 1550,
        x2: 2250,
        y2: 1685,
        hoverImages: [
          "/map-overlays/hover/barn.webp",
          "/map-overlays/text/barn.webp",
        ],
        explanation: {
          text: "De gerenoveerde schuur biedt plek voor workshops, bijeenkomsten en kleine vieringen.",
          x: 2255,
          y: 1715,
          width: 650,
        },
        padding: 40,
      },
      {
        id: "vake-tree",
        x1: 1900,
        y1: 1550,
        x2: 2000,
        y2: 1675,
        hoverImages: [
          "/map-overlays/hover/vake-tree.webp",
          "/map-overlays/text/vake-tree.webp",
        ],
        explanation: {
          text: "Een vertrouwde schaduwplek op het erf, dichtbij de dieren en de schuur.",
          x: 1340,
          y: 1380,
          width: 610,
        },
        padding: 40,
      },
      {
        id: "garden",
        x1: 2460,
        y1: 1085,
        x2: 2935,
        y2: 1440,
        hoverImages: [
          "/map-overlays/hover/garden.webp",
          "/map-overlays/text/garden.webp",
        ],
        explanation: {
          text: "In de samentuin delen vrijwilligers kennis, werk en oogst op het ritme van de seizoenen.",
          x: 2940,
          y: 1130,
          width: 720,
        },
        padding: 40,
      },
      {
        id: "yurt",
        x1: 2850,
        y1: 1517,
        x2: 3085,
        y2: 1740,
        hoverImages: [
          "/map-overlays/hover/yurt.webp",
          "/map-overlays/text/yurt.webp",
        ],
        explanation: {
          text: "De yurt is een warme cirkel voor therapie, yoga, muziek en verstilling in het groen.",
          x: 2860,
          y: 1690,
          width: 650,
        },
        padding: 40,
      },
      {
        id: "swallows",
        x1: 1855,
        y1: 830,
        x2: 2745,
        y2: 1030,
        hoverImages: [
          "/map-overlays/hover/swallows.webp",
          "/map-overlays/text/trek-mee-naar-kameroen.webp",
        ],
        padding: 40,
      },
      {
        id: "caption-kippenhok",
        x1: 2330,
        y1: 1239,
        x2: 2490,
        y2: 1404,
        hoverImages: [
          "/map-overlays/hover/kippenhok.webp",
          "/map-overlays/text/kippenhok.webp",
        ],
        explanation: {
          text: "Hier scharrelen de kippen mee in het levendige ritme van de tuin.",
          x: 2545,
          y: 1275,
          width: 560,
        },
        includeInIntro: false,
      },
      {
        id: "caption-trampoline",
        x1: 2205,
        y1: 1258,
        x2: 2301,
        y2: 1330,
        hoverImages: [
          "/map-overlays/hover/trampoline.webp",
          "/map-overlays/text/trampoline.webp",
        ],
        explanation: {
          text: "Een speelse plek tussen het groen, voor kinderen en lichte pauzes.",
          x: 1580,
          y: 900,
          width: 560,
        },
        includeInIntro: false,
      },
      {
        id: "caption-parking",
        x1: 1750,
        y1: 1517,
        x2: 1942,
        y2: 1639,
        hoverImages: ["/map-overlays/text/parking.webp"],
        explanation: {
          text: "Parkeer hier en wandel verder het domein in.",
          x: 1150,
          y: 1585,
          width: 500,
        },
        includeInIntro: false,
      },
      {
        id: "caption-boomgaard-kleinfruit",
        x1: 2833,
        y1: 1089,
        x2: 3595,
        y2: 1785,
        hoverImages: [
          "/map-overlays/hover/boomgaard-kleinfruit.webp",
          "/map-overlays/text/boomgaard-kleinfruit.webp",
        ],
        explanation: {
          text: "De boomgaard en fruitkooien brengen appels, peren, pruimen en kleinfruit samen.",
          x: 3070,
          y: 1535,
          width: 700,
        },
        includeInIntro: false,
      },
      {
        id: "caption-windroos",
        x1: 691,
        y1: 793,
        x2: 1003,
        y2: 1057,
        hoverImages: [
          "/map-overlays/text/zoerselbos.webp",
          "/map-overlays/text/halle-dorp.webp",
        ],
        explanation: {
          text: "Wilhalla ligt tussen Halle-Dorp en het Zoerselbos: dorps nabij, bos dichtbij.",
          x: 1140,
          y: 1455,
          width: 680,
        },
        includeInIntro: false,
      },
      {
        id: "caption-bijen",
        x1: 3411,
        y1: 1413,
        x2: 3575,
        y2: 1589,
        hoverImages: ["/map-overlays/text/bijen.webp"],
        explanation: {
          text: "De bijen helpen de tuin bloeien en houden de biodiversiteit mee in beweging.",
          x: 3080,
          y: 1150,
          width: 660,
        },
        includeInIntro: false,
      },
    ] satisfies readonly MapSentinelConfig[],
  },
} as const;
