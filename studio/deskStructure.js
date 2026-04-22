export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      // Buy Page
      S.listItem()
        .title("Buying Page")
        .child(
          S.document()
            .schemaType("buyPage")
            .documentId("buyPage")
            .views([
              S.view.form(),
            ])
        ),

      // Selling Page
      S.listItem()
        .title("Selling Page")
        .child(
          S.document()
            .schemaType("sellingPage")
            .documentId("sellingPage")
            .views([
              S.view.form(),
            ])
        ),

      // School Guidance Page
      S.listItem()
        .title("School Guidance Page")
        .child(
          S.document()
            .schemaType("schoolGuidancePage")
            .documentId("schoolGuidancePage")
            .views([
              S.view.form(),
            ])
        ),

      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !["buyPage", "sellingPage", "schoolGuidancePage"].includes(listItem.getId())
      ),
    ]);
