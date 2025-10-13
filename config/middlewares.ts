export default [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  {
    name: "strapi::favicon",
    config: {
      path: "./public/uploads/favicon.ico",
    },
  },
  "strapi::public",
];
