import type { Core } from "@strapi/strapi";

const populateDatabase = async (strapi: Core.Strapi) => {
  const hasTags = await strapi
    .documents("api::tag.tag")
    .count({ status: "published" });

  if (!hasTags) {
    const tagsToCreate = [
      { title: "JavaScript", color: "#f0db4fff" },
      { title: "TypeScript", color: "#3178c6ff" },
      { title: "Node.js", color: "#68a063ff" },
      { title: "React.js", color: "#767bdeff" },
    ];

    for (const tag of tagsToCreate) {
      await strapi.documents("api::tag.tag").create({
        data: tag,
        status: "published",
      });
    }
  }

  const hasAbout = await strapi
    .documents("api::about.about")
    .count({ status: "published" });

  if (!hasAbout) {
    await strapi.documents("api::about.about").create({
      data: {
        title: "About Me",
        content:
          "<p>Welcome to my portfolio! Here you can learn more about me and my work.</p>",
      },
      status: "published",
    });
  }

  // Check and create contact page
  const hasContact = await strapi
    .documents("api::contact.contact")
    .count({ status: "published" });

  if (!hasContact) {
    await strapi.documents("api::contact.contact").create({
      data: {
        title: "Contact",
        content:
          "<p>Feel free to reach out to me through any of these channels.</p>",
      },
      status: "published",
    });
  }

  const hasPost = await strapi
    .documents("api::post.post")
    .count({ status: "published" });

  if (!hasPost) {
    const postsToCreate = [
      {
        title: "My First Post",
        description: "An introduction to my blog and what to expect.",
        content:
          "<p>This is the content of my first post. I'm excited to share my journey with you!</p>",
        slug: "my-first-post",
        tags: ["1", "2"],
      },
    ];

    for (const post of postsToCreate) {
      await strapi.documents("api::post.post").create({
        data: post,
        status: "published",
      });
    }
  }
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Force the socket to be treated as encrypted for proxy setups
    strapi.server.use(async (ctx, next) => {
      if (ctx.req?.socket) {
        (ctx.req.socket as any).encrypted = true;
      }
      await next();
    });
  },
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    populateDatabase(strapi);
  },
};
