import fp from "fastify-plugin";
import Ajv from "ajv";

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: "array",
  allErrors: true,
});

/**
 * This plugins allows array types to be coerced by Ajv
 *
 * @see https://www.fastify.io/docs/latest/Validation-and-Serialization/
 */
export default fp(async (fastify, opts) => {
  fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return ajv.compile(schema);
  });
});
