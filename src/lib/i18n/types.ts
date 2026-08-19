export type CorridorNode = {
  code: string;
  label: string;
};

export type ServiceItem = {
  code: string;
  title: string;
  summary: string;
  detail: string;
};

export type RegionItem = {
  country: string;
  desc: string;
};

export type ValueItem = {
  title: string;
  desc: string;
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    partners: string;
    contact: string;
  };
  footer: {
    tagline: string;
    navTitle: string;
    rights: string;
    addressLabel: string;
    address: string;
    langLabel: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  corridor: {
    eyebrow: string;
    title: string;
    nodes: CorridorNode[];
  };
  services: {
    eyebrow: string;
    title: string;
    viewAll: string;
    items: ServiceItem[];
  };
  coverage: {
    eyebrow: string;
    title: string;
    body: string;
  };
  ctaBand: {
    title: string;
    body: string;
    cta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    intro: string;
    missionTitle: string;
    mission: string;
    historyTitle: string;
    history: string;
    valuesTitle: string;
    values: ValueItem[];
  };
  servicesPage: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ServiceItem[];
  };
  partners: {
    eyebrow: string;
    title: string;
    intro: string;
    regionsTitle: string;
    regions: RegionItem[];
    notice: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    formName: string;
    formCompany: string;
    formEmail: string;
    formMessage: string;
    formMessagePlaceholder: string;
    formSubmit: string;
    formSubmitting: string;
    formSuccess: string;
    formError: string;
    detailsTitle: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
  };
};
