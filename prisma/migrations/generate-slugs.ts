import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateSlugs() {
  const projects = await prisma.project.findMany({
    where: { slug: null } as any,
  });

  console.log(`Generating slugs for ${projects.length} projects...`);

  for (const project of projects) {
    let slug = generateSlug(project.title);
    let counter = 1;

    // Handle duplicates
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${generateSlug(project.title)}-${counter}`;
      counter++;
    }

    await prisma.project.update({
      where: { id: project.id },
      data: { slug },
    });

    console.log(`✓ ${project.title} -> ${slug}`);
  }

  console.log("Done!");
}

generateSlugs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
