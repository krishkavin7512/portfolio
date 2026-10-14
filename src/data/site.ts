export const site = {
  name: "Kavin Krish",
  fullName: "Kavin Krish Vijay",
  first: "Kavin",
  last: "Krish",
  role: "Machine Learning & Full-Stack Engineer",
  roleShort: "ML & Full-Stack Engineer",
  education: "B.Tech Computer Science & Engineering",
  school: "SRM Institute of Science and Technology",
  schoolShort: "SRM IST",
  years: "2024 — 2028",
  city: "Chennai",
  country: "India",
  status: "Open to internships · 2027",
  email: "krishkavin7512@gmail.com",
  // Vercel exposes the project's production domain at build time; fall back to the current one
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://portfolio-eta-inky-14.vercel.app",
  description:
    "Kavin Krish is a machine learning and full-stack engineer studying Computer Science at SRM IST, Chennai, building intelligent software end to end, from the model to the interface.",
  statement:
    "I build intelligent software end to end, from the model that makes the call to the interface that explains it.",
  about: [
    "I'm a Computer Science undergraduate at SRM Institute of Science and Technology, working across machine learning and full-stack development.",
    "I like problems where a model has to earn its place in a real product: sign language that has to be read in real time, a risk score a health worker can act on, insurance that pays out without a single form.",
  ],
  // résumé PDF not supplied yet; set to "/resume.pdf" once it is in /public
  resume: null as string | null,
  socials: [
    { label: "GitHub", href: "https://github.com/krishkavin7512" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kavin-krish-vijayakumar-029526277/" },
    { label: "Email", href: "mailto:krishkavin7512@gmail.com" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Stack", href: "/#stack" },
    { label: "Off Screen", href: "/#off-screen" },
    { label: "Timeline", href: "/#timeline" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
