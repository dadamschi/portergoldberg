export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      // === FREQUENTLY UPDATED ===
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("newsletter").title("Newsletters"),
      S.documentTypeListItem("listing").title("Listings"),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("press").title("Press"),

      S.divider(),

      // === PAGES ===
      S.listItem()
        .title("Site Settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      S.listItem()
        .title("Buying Page")
        .child(
          S.document()
            .schemaType("buyPage")
            .documentId("buyPage")
        ),
      S.listItem()
        .title("Selling Page")
        .child(
          S.document()
            .schemaType("sellingPage")
            .documentId("sellingPage")
        ),
      S.listItem()
        .title("School Guidance Page")
        .child(
          S.document()
            .schemaType("schoolGuidancePage")
            .documentId("schoolGuidancePage")
        ),
      S.listItem()
        .title("Halcyon Page")
        .child(
          S.document()
            .schemaType("halcyonPage")
            .documentId("halcyonPage")
        ),

      S.listItem()
        .title("Client Page")
        .child(
          S.document()
            .schemaType("clientPage")
            .documentId("clientPage")
        ),

      S.divider(),

      // === OTHER ===
      S.documentTypeListItem("agent").title("Agents"),
    ]);
