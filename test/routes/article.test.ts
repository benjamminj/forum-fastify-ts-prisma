import { PrismaClient } from ".prisma/client";
import { test } from "tap";
import { build } from "../helper";

const client = new PrismaClient();

test("GET /article", async (t) => {
  const app = await build(t);
  await client.article.deleteMany({ where: {} });
  await client.article.create({
    data: { title: "TEST #1", body: "This is a test" },
  });

  await client.article.create({
    data: { title: "TEST #2", body: "This is a test" },
  });

  const res = await app.inject({
    url: "/articles",
  });

  t.deepEqual(JSON.parse(res.payload), [
    { id: 1, title: "TEST #1", body: "This is a test" },
    { id: 2, title: "TEST #2", body: "This is a test" },
  ]);
  app.close();
});
