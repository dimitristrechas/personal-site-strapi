import { createStrapi } from "@strapi/strapi";

const generateId = () => crypto.randomUUID().slice(0, 8);
const generateColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}ff`;

const isUniqueError = (err: unknown): boolean => {
  if (err && typeof err === "object" && "message" in err) {
    return String(err.message).includes("must be unique");
  }
  return false;
};

const seedDatabase = async () => {
  const app = await createStrapi({ distDir: "./dist" }).load();

  console.log("🌱 Seeding database...");

  const tagData = [
    { title: `JavaScript-${generateId()}`, color: generateColor() },
    { title: `TypeScript-${generateId()}`, color: generateColor() },
    { title: `Node.js-${generateId()}`, color: generateColor() },
    { title: `React.js-${generateId()}`, color: generateColor() },
  ];

  const createdTags: string[] = [];
  for (const tag of tagData) {
    try {
      const created = await app.documents("api::tag.tag").create({
        data: tag,
        status: "published",
      });
      createdTags.push(created.documentId);
      console.log(`✅ Created tag: ${tag.title}`);
    } catch (err) {
      if (isUniqueError(err)) {
        console.log(`⚠️ Skipped tag (unique conflict): ${tag.title}`);
      } else {
        throw err;
      }
    }
  }

  const postId = generateId();
  try {
    await app.documents("api::post.post").create({
      data: {
        title: `Sample Post ${postId}`,
        description: "Auto-generated sample post for development.",
        content: `<h1>Sample title for this post</h1><p>This is sample content generated at ${new Date().toISOString()}.</p>`,
        slug: `sample-post-${postId}`,
        tags: createdTags.slice(0, 2),
      },
      status: "published",
    });
    console.log(`✅ Created post: sample-post-${postId}`);
  } catch (err) {
    if (isUniqueError(err)) {
      console.log(`⚠️ Skipped post (unique conflict): sample-post-${postId}`);
    } else {
      throw err;
    }
  }

  const existingAbout = await app.documents("api::about.about").findFirst({});
  if (existingAbout) {
    await app.documents("api::about.about").delete({
      documentId: existingAbout.documentId,
    });
  }
  try {
    await app.documents("api::about.about").create({
      data: {
        title: `About Me ${generateId()}`,
        content: `<p>Welcome to my portfolio! Generated at ${new Date().toISOString()}.</p>`,
      },
      status: "published",
    });
    console.log("✅ Created about page");
  } catch (err) {
    if (isUniqueError(err)) {
      console.log("⚠️ Skipped about page (unique conflict)");
    } else {
      throw err;
    }
  }

  const existingContact = await app.documents("api::contact.contact").findFirst({});
  if (existingContact) {
    await app.documents("api::contact.contact").delete({
      documentId: existingContact.documentId,
    });
  }
  try {
    await app.documents("api::contact.contact").create({
      data: {
        title: `Contact ${generateId()}`,
        content: `<p>Reach out through any channel. Generated at ${new Date().toISOString()}.</p>`,
      },
      status: "published",
    });
    console.log("✅ Created contact page");
  } catch (err) {
    if (isUniqueError(err)) {
      console.log("⚠️ Skipped contact page (unique conflict)");
    } else {
      throw err;
    }
  }

  console.log("🎉 Seeding complete!");
  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
