import { FastifyPluginAsync } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { dbClient } from "../../db";

const createArticleDto = {
  type: "object",
  properties: {
    title: { type: "string" },
    body: { type: "string" },
    userId: { type: "number" },
  },
  required: ["title", "body", "userId"],
} as const;

export const articlesController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", async (req, res) => {
    return dbClient.article.findMany();
  });

  fastify.post<{ Body: FromSchema<typeof createArticleDto> }>(
    "/",
    {
      schema: {
        body: createArticleDto,
        response: {
          201: {
            type: "string",
          },
        },
      },
    },
    async (req, res) => {
      return dbClient.article.create({ data: req.body });
    }
  );
};
