import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./deskStructure";

export default defineConfig({
  name: "portergoldberg",
  title: "Porter Goldberg",

  projectId: "mw8duas2",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
