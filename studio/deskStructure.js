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
                  S.documentList()
                    .title("All Listings")
                    .filter('_type == "listing"')
                ),

              S.divider(),

              S.listItem()
                .title("Featured Listings")
                .icon(() => "⭐")
                .child(
                  S.documentList()
                    .title("Featured Listings (by order)")
                    .id("featuredListingsByOrder")
                    .filter('_type == "listing" && featured == true')
                    .defaultOrdering([{ field: "featuredOrder", direction: "asc" }])
                ),

              S.listItem()
                .title("Halcyon Projects")
                .icon(() => "🏗️")
                .child(
                  S.documentList()
                    .title("Halcyon Projects")
                    .filter('_type == "listing" && isHalcyonProject == true')
                    .defaultOrdering([{ field: "halcyonOrder", direction: "asc" }])
                ),

              S.listItem()
                .title("Sold Listings")
                .icon(() => "✅")
                .child(
                  S.documentList()
                    .title("Sold Listings")
                    .filter('_type == "listing" && statusType == "sold" && defined(soldOrder)')
                    .defaultOrdering([{ field: "soldOrder", direction: "asc" }])
                ),

              S.listItem()
                .title("Coming Soon")
                .icon(() => "🔜")
                .child(
                  S.documentList()
                    .title("Coming Soon")
                    .filter('_type == "listing" && statusType == "coming"')
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
