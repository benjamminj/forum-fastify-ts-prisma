import { FastifyPluginAsync } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { dbClient } from "../../db";

const createUserDto = {
  type: "object",
  properties: {
    username: { type: "string" },
  },
  required: ["username"],
} as const;

const getPostsByUserParamsDto = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
} as const;

const getUserByIdParamsDto = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
} as const;

const getUserByIdQueryDto = {
  type: "object",
  properties: {
    include: {
      type: "array",
      items: {
        type: "string",
        enum: ["articles"],
      },
    },
  },
} as const;

export const usersController: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", async (req, res) => {
    return dbClient.user.findMany();
  });

  fastify.post<{ Body: FromSchema<typeof createUserDto> }>(
    "/",
    {
      schema: {
        body: createUserDto,
        response: {
          201: {
            type: "string",
          },
        },
      },
    },
    async (req, res) => {
      return dbClient.user.create({ data: req.body });
    }
  );

  fastify.get<{
    Params: FromSchema<typeof getUserByIdParamsDto>;
    Querystring: FromSchema<typeof getUserByIdQueryDto>;
  }>(
    "/:id",
    {
      schema: {
        params: getUserByIdParamsDto,
        querystring: getUserByIdQueryDto,
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const { include } = req.query;

      return dbClient.user.findFirst({
        where: { id },
        include: { articles: include?.includes("articles") },
      });
    }
  );

  fastify.get<{ Params: FromSchema<typeof getPostsByUserParamsDto> }>(
    "/:id/articles",
    {
      schema: {
        params: getPostsByUserParamsDto,
      },
    },
    async (req, res) => {
      const { id } = req.params;
      return dbClient.article.findMany({ where: { userId: id } });
    }
  );
};
