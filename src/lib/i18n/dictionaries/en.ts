import type { Dictionary } from "../types";

const serviceItems = [
  {
    code: "RAIL",
    title: "Rail freight",
    summary: "Trans-Mongolian and connecting rail links into China and Russia.",
    detail:
      "Full and part container loads routed via Zamyn-Üüd and Sükhbaatar, timed to connecting networks on both sides of the border.",
    image: "/services/rail.jpg",
  },
  {
    code: "ROAD",
    title: "Road freight",
    summary: "Door-to-door trucking for time-sensitive and last-mile cargo.",
    detail:
      "Cross-border trucking where rail schedules don't fit the cargo, plus first- and last-mile delivery inside Mongolia.",
    image: "/services/road.jpg",
  },
  {
    code: "CUSTOMS",
    title: "Customs brokerage",
    summary: "Clearance handled at every crossing before cargo arrives.",
    detail:
      "Documentation, declarations, and clearance coordinated in advance so freight doesn't wait at the border.",
    image: "/services/customs.jpg",
  },
  {
    code: "WHSE",
    title: "Warehousing & consolidation",
    summary: "Storage and load consolidation in Ulaanbaatar.",
    detail:
      "Short- and long-term storage, plus consolidation of smaller shipments into full loads before onward transport.",
    image: "/services/warehouse.jpg",
  },
];

const en: Dictionary = {
  meta: {
    title: "Nice Move Logistics — Cross-Border Freight Across Mongolia, Japan, China & Russia",
    description:
      "Nice Move Logistics moves freight across the Mongolia–Japan–China–Russia corridor by rail, road, and cleared customs crossings.",
  },
  nav: {
    home: "Home",
    about: "About Us",
    services: "Services",
    partners: "Partners",
    contact: "Contact",
  },
  footer: {
    tagline: "Freight, moved.",
    navTitle: "Navigate",
    rights: "All rights reserved.",
    addressLabel: "Registered office",
    address: "Ulaanbaatar, Mongolia",
    langLabel: "Language",
  },
  hero: {
    eyebrow: "ULAANBAATAR ⇄ TOKYO · SHANGHAI · MOSCOW",
    headline: "FREIGHT THAT CROSSES BORDERS ON SCHEDULE",
    sub: "Nice Move Logistics runs freight out of Mongolia into Japan, China, and Russia — by rail, by road, and through customs — without the border becoming your problem to manage.",
    ctaPrimary: "Talk to us",
    ctaSecondary: "See our services",
  },
  corridor: {
    eyebrow: "THE CORRIDOR",
    title: "One route, four countries, no surprises at the border.",
    nodes: [
      { code: "UB", label: "Ulaanbaatar" },
      { code: "ZUD", label: "Zamyn-Üüd / Erenhot" },
      { code: "CN", label: "China rail & road network" },
      { code: "SUK", label: "Sükhbaatar / Naushki" },
      { code: "RU", label: "Russia rail & road network" },
      { code: "JP", label: "Japan, via sea gateway" },
    ],
  },
  services: {
    eyebrow: "WHAT WE MOVE",
    title: "Four ways freight gets from here to there.",
    viewAll: "View all services",
    items: serviceItems,
  },
  coverage: {
    eyebrow: "COVERAGE",
    title: "Based in Mongolia. Built for its neighbors.",
    body: "Mongolia sits between two of the world's largest freight networks. We're set up to move cargo through both — and onward to Japan by sea — instead of stopping at the first border.",
  },
  ctaBand: {
    title: "Moving freight into or out of Mongolia?",
    body: "Tell us the route and the cargo. We'll tell you how it crosses.",
    cta: "Start a conversation",
  },
  about: {
    eyebrow: "ABOUT US",
    title: "We move freight across the borders we live next to.",
    intro:
      "Nice Move Logistics is based in Ulaanbaatar, Mongolia, working the corridors into China, Russia, and onward to Japan. [Placeholder: replace with your company's real founding story, year established, and team background.]",
    missionTitle: "What we do",
    mission:
      "We plan and run freight movements across the Mongolia–China–Russia corridor — choosing rail, road, or a combination of both — and handle the customs clearance in between, so a shipment crossing a border stays on schedule instead of becoming a delay for someone else to solve.",
    historyTitle: "Where we operate",
    history:
      "Our home base is Ulaanbaatar, with working routes through the Zamyn-Üüd–Erenhot crossing into China and the Sükhbaatar–Naushki crossing into Russia, connecting onward to Japan by sea. [Placeholder: add specific branch offices, partner offices, or certifications here.]",
    valuesTitle: "How we work",
    values: [
      {
        title: "Route knowledge",
        desc: "We know the crossings we operate through — the paperwork they need and the timing that keeps cargo moving.",
      },
      {
        title: "Direct communication",
        desc: "You hear about a delay from us before you hear about it from anyone else.",
      },
      {
        title: "One point of contact",
        desc: "A single team follows your shipment from Ulaanbaatar to delivery, across every border it crosses.",
      },
    ],
  },
  servicesPage: {
    eyebrow: "SERVICES",
    title: "Freight services across the Mongolia corridor",
    intro:
      "Four services, built around the same problem: getting cargo across a border without losing time to it.",
    items: serviceItems,
  },
  partners: {
    eyebrow: "PARTNERS",
    title: "Where we work",
    intro:
      "We move freight for companies trading between Mongolia, China, Russia, and Japan. Every shipment runs through a partner or client relationship on at least one side of the border.",
    regionsTitle: "Regions we operate across",
    regions: [
      {
        country: "Mongolia",
        desc: "Home base — Ulaanbaatar operations, warehousing, and first-mile trucking.",
      },
      {
        country: "China",
        desc: "Rail and road connections via the Zamyn-Üüd–Erenhot crossing.",
      },
      {
        country: "Russia",
        desc: "Rail and road connections via the Sükhbaatar–Naushki crossing.",
      },
      {
        country: "Japan",
        desc: "Onward freight via sea gateway from partner ports.",
      },
    ],
    notice:
      "Partner and client logos will be added here once we have permission to display them. [Placeholder: replace with real partner/client names and logos.]",
  },
  contact: {
    eyebrow: "CONTACT",
    title: "Tell us about the shipment",
    intro: "Send us the route, the cargo, and a way to reach you — we'll follow up directly.",
    formName: "Full name",
    formCompany: "Company",
    formEmail: "Email",
    formMessage: "Message",
    formMessagePlaceholder: "Route, cargo type, volume, timing — whatever you have.",
    formSubmit: "Send message",
    formSubmitting: "Sending…",
    formSuccess: "Message sent. We'll get back to you shortly.",
    formError: "Something went wrong sending your message. Please try again or email us directly.",
    detailsTitle: "Reach us directly",
    addressLabel: "Office",
    address: "Ulaanbaatar, Mongolia [Placeholder: add street address]",
    phoneLabel: "Phone",
    phone: "[Placeholder: add phone number]",
    emailLabel: "Email",
    email: "[Placeholder: add contact email]",
  },
};

export default en;
