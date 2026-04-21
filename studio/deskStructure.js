export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      // Buy Page with custom flipbook preview
      S.listItem()
        .title("Buy Page")
        .child(
          S.document()
            .schemaType("buyPage")
            .documentId("buyPage")
            .views([
              S.view.form(),
            ])
        ),

      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !["buyPage"].includes(listItem.getId())
      ),
    ]);
