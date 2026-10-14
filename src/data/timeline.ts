export type TimelineEntry = {
  when: string;
  title: string;
  body: string;
  href?: string;
  upcoming?: boolean;
};

export const timeline: { year: string; entries: TimelineEntry[] }[] = [
  {
    year: "2024",
    entries: [
      {
        when: "Start",
        title: "Started at SRM IST",
        body: "B.Tech in Computer Science and Engineering, Chennai.",
      },
    ],
  },
  {
    year: "2025",
    entries: [
      {
        when: "Oct",
        title: "Pro-Techt",
        body: "First full product with a team: a warranty and service-centre portal on React and Supabase.",
        href: "https://github.com/GoutamAdityan/PRO-TECHT",
      },
    ],
  },
  {
    year: "2026",
    entries: [
      {
        when: "Feb",
        title: "Semiconductor Defect Detection",
        body: "EfficientNet-B0 for wafer defects, exported for NXP edge hardware.",
        href: "https://github.com/krishkavin7512/Semiconductor-Defect-Detection-System",
      },
      {
        when: "Mar",
        title: "RainCheck at Guidewire DEVTrails",
        body: "Built the Flutter rider app for parametric income insurance.",
        href: "/work/raincheck",
      },
      {
        when: "Apr",
        title: "ISL Recognition",
        body: "Solo build: 296 signs, live in the browser, 92.2% validation accuracy.",
        href: "/work/isl-recognition",
      },
      {
        when: "Apr",
        title: "Tetris & Snake",
        body: "Two classics rebuilt in Python and Pygame.",
        href: "https://github.com/krishkavin7512/Tetris",
      },
      {
        when: "Jun",
        title: "WSF",
        body: "Location tracking and data layer for an AI women's safety system.",
        href: "/work/wsf",
      },
      {
        when: "Sep",
        title: "KALĀ",
        body: "Three interactive journeys through Indian art, with a team of four.",
        href: "/work/kala",
      },
      {
        when: "Sep",
        title: "GlucoSense & StrengthLab",
        body: "Two ML products with every model written from scratch in NumPy.",
        href: "/work/glucosense",
      },
      {
        when: "Sep",
        title: "Goa 13",
        body: "A trip app for thirteen people, four families and one shared bill.",
      },
    ],
  },
  {
    year: "2027",
    entries: [
      {
        when: "Next",
        title: "Looking for an internship",
        body: "Machine learning or full-stack roles where the model has to ship.",
        upcoming: true,
      },
    ],
  },
  {
    year: "2028",
    entries: [
      {
        when: "Finish",
        title: "Graduating",
        body: "B.Tech Computer Science and Engineering, SRM IST.",
        upcoming: true,
      },
    ],
  },
];
