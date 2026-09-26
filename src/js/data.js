/* Kept — content and pricing data.
   All prices, inclusions and add-ons are SAMPLE content for a concept site.
   Edit here; the What's included tabs and the quote estimate read from this file. */
window.KEPT = {
  // Estimate = base + bedrooms × bed + bathrooms × bath (+ add-ons). "From" prices are 1 bed / 1 bath.
  services: {
    regular: {
      name: "Regular home cleaning", tab: "Regular", unit: "per visit",
      base: 94, bed: 25, bath: 30,
      intro: "Every visit covers the whole home. Your cleaner rotates a few extra jobs each time so nothing builds up.",
      rooms: {
        "Kitchen": ["Benchtops and splashback wiped and dried", "Stovetop and appliance fronts", "Sink and tapware polished", "Cupboard fronts spot-cleaned", "Floors vacuumed and mopped"],
        "Bathrooms": ["Shower screen, tiles and grout surface-cleaned", "Toilet cleaned inside and out", "Vanity, basin and mirror", "Floors mopped", "Towels folded or replaced if left out"],
        "Living & bedrooms": ["Dusting of reachable surfaces", "Beds made, linen changed if left out", "Floors vacuumed and mopped", "Skirting boards spot-cleaned", "Bins emptied and liners replaced"]
      },
      addons: ["oven", "fridge", "windows", "balcony"],
      note: "Weekly, fortnightly or monthly. Pause any time."
    },
    deep: {
      name: "Deep cleaning", tab: "Deep", unit: "one-off",
      base: 219, bed: 55, bath: 55,
      intro: "Everything in a regular clean, plus the slow jobs that make a home feel reset.",
      rooms: {
        "Kitchen": ["Inside the oven, racks and trays", "Rangehood filters degreased", "Inside the microwave", "Cupboard fronts and handles washed", "Kickboards and appliance edges"],
        "Bathrooms": ["Grout scrubbed", "Limescale and soap scum treated", "Exhaust fan covers", "Window sills and tracks", "Behind and around the toilet base"],
        "Living & bedrooms": ["Skirting boards washed", "Light switches, doors and frames", "Window sills and tracks", "Under furniture that can be moved", "Blinds and ceiling fans dusted"]
      },
      addons: ["fridge", "windows", "balcony"],
      note: "Most deep cleans take one cleaner five to seven hours."
    },
    lease: {
      name: "End of lease cleaning", tab: "End of lease", unit: "one-off",
      base: 250, bed: 80, bath: 60,
      intro: "Built around the inspection checklists Sydney agents use, so you can hand back the keys with confidence.",
      rooms: {
        "Kitchen": ["Inside every cupboard and drawer", "Oven, stovetop and rangehood to inspection standard", "Dishwasher filter and seals", "Splashback degreased", "Floors, including edges and corners"],
        "Bathrooms": ["Tiles, grout and screen descaled", "Exhaust fans", "Inside mirror cabinets", "Drains cleared of debris", "Toilet including base and hinges"],
        "Living & bedrooms": ["Walls spot-cleaned for marks", "Interior windows and tracks", "Skirting, doors and frames", "Inside wardrobes", "Light fittings dusted"]
      },
      addons: ["fridge", "balcony", "carpet"],
      note: "Includes our bond-back re-clean within 72 hours."
    },
    apartment: {
      name: "Apartment cleaning", tab: "Apartment", unit: "per visit",
      base: 74, bed: 25, bath: 30,
      intro: "Sized for apartment living, with building access sorted before the day.",
      rooms: {
        "Kitchen": ["Benchtops, splashback and stovetop", "Appliance fronts and handles", "Sink and tapware polished", "Cupboard fronts spot-cleaned", "Floors vacuumed and mopped"],
        "Bathrooms": ["Shower screen and tiles", "Toilet cleaned inside and out", "Vanity, basin and mirror", "Floors mopped", "Exhaust fan cover dusted"],
        "Living & balcony": ["Balcony swept, glass doors cleaned inside", "Dusting of reachable surfaces", "Beds made", "Floors vacuumed and mopped", "Bins taken to the building bin room"]
      },
      addons: ["oven", "fridge", "windows"],
      note: "We work with concierge, key safes and booked lift times."
    }
  },

  addons: {
    oven:    { name: "Inside the oven",        price: 55 },
    fridge:  { name: "Inside the fridge",      price: 35 },
    windows: { name: "Interior windows",       price: 60 },
    balcony: { name: "Balcony or courtyard",   price: 40 },
    carpet:  { name: "Carpet steam, per room", price: 45 }
  },

  frequencies: [
    { id: "weekly", name: "Weekly" },
    { id: "fortnightly", name: "Fortnightly" },
    { id: "monthly", name: "Monthly" }
  ],

  timings: [
    { id: "week", name: "This week" },
    { id: "next", name: "Next week" },
    { id: "flex", name: "I’m flexible" }
  ],

  suburbs: ["Annandale", "Balmain", "Bondi", "Bronte", "Chippendale", "Coogee", "Cremorne", "Crows Nest", "Darlinghurst", "Double Bay", "Dulwich Hill", "Enmore", "Glebe", "Kensington", "Kirribilli", "Lane Cove", "Leichhardt", "Marrickville", "Mosman", "Neutral Bay", "Newtown", "North Sydney", "Paddington", "Petersham", "Potts Point", "Pyrmont", "Randwick", "Redfern", "Rose Bay", "Rozelle", "Surry Hills", "Ultimo", "Waterloo", "Waverton", "Woollahra", "Zetland"],

  limits: { bedMin: 1, bedMax: 6, bathMin: 1, bathMax: 4 }
};
