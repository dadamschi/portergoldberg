export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      // === FREQUENTLY UPDATED ===
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("newsletter").title("Newsletters"),

      // Custom Listings view with ordering
      S.listItem()
        .title("Listings")
        .child(
          S.list()
            .title("Listings")
            .items([
              S.listItem()
                .title("All Listings")
                .icon(() => "📋")
                .child(
                  S.documentTypeList("listing")
                    .title("All Listings")
                    .defaultOrdering([{ field: "featuredOrder", direction: "asc" }])
                ),

              S.divider(),

              S.listItem()
                .title("Featured Listings")
                .icon(() => "⭐")
                .child(
                  S.documentTypeList("listing")
                    .title("Featured Listings")
                    .filter('featured == true')
                    .defaultOrdering([{ field: "featuredOrder", direction: "asc" }])
                ),

              S.listItem()
                .title("Halcyon Projects")
                .icon(() => "🏗️")
                .child(
                  S.documentTypeList("listing")
                    .title("Halcyon Projects")
                    .filter('isHalcyonProject == true')
                    .defaultOrdering([{ field: "halcyonOrder", direction: "asc" }])
                ),

              S.listItem()
                .title("Sold Listings")
                .icon(() => "✅")
                .child(
                  S.documentTypeList("listing")
                    .title("Sold Listings")
                    .filter('statusType == "sold" && defined(soldOrder)')
                    .defaultOrdering([{ field: "soldOrder", direction: "asc" }])
                ),

              S.divider(),

              S.listItem()
                .title("Active Listings")
                .icon(() => "🟢")
                .child(
                  S.documentTypeList("listing")
                    .title("Active Listings")
                    .filter('statusType == "active"')
                    .defaultOrdering([{ field: "featuredOrder", direction: "asc" }])
                ),

              S.listItem()
                .title("Coming Soon")
                .icon(() => "🔜")
                .child(
                  S.documentTypeList("listing")
                    .title("Coming Soon")
                    .filter('statusType == "coming"')
                    .defaultOrdering([{ field: "featuredOrder", direction: "asc" }])
                ),
            ])
        ),
      S.listItem()
        .title("Client Page")
        .child(
          S.document()
            .schemaType("clientPage")
            .documentId("clientPage")
        ),
      S.documentTypeListItem("event").title("Events"),

      S.documentTypeListItem("zillowReview").title("Zillow Reviews"),
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

      S.divider(),

      // === OTHER ===
      S.documentTypeListItem("agent").title("Agents"),
      S.documentTypeListItem("press").title("Press"),
    ]);
