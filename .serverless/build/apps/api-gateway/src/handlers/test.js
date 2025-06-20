var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// apps/api-gateway/src/handlers/test.ts
var test_exports = {};
__export(test_exports, {
  main: () => main
});
module.exports = __toCommonJS(test_exports);

// libs/lambda-utils/src/response/cors.utils.ts
var getCorsHeaders = () => ({
  "Access-Control-Allow-Origin": process.env["CORS_ORIGIN"] || "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
});
var createCorsPreflightResponse = (allowedMethods = ["GET", "POST", "PUT", "DELETE"]) => ({
  statusCode: 200,
  headers: {
    ...getCorsHeaders(),
    "Access-Control-Allow-Methods": allowedMethods.join(", "),
    "Access-Control-Max-Age": "86400"
  },
  body: ""
});

// libs/lambda-utils/src/response/response.utils.ts
var crypto = require("crypto");
var createResponse = (statusCode, body, additionalHeaders) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    ...getCorsHeaders(),
    "X-Request-ID": crypto.randomUUID(),
    ...additionalHeaders
  },
  body: JSON.stringify(body)
});

// libs/lambda-utils/src/error/error-handling.ts
var createErrorResponse = (statusCode, message, details) => createResponse(statusCode, {
  error: message,
  statusCode,
  timestamp: (/* @__PURE__ */ new Date()).toISOString(),
  ...details && { details }
});

// libs/lambda-utils/src/validation/http-method.validator.ts
var validateHttpMethodWithCors = (event, allowedMethods) => {
  const eventMethod = event.httpMethod?.toUpperCase();
  if (!eventMethod) return { isValid: false, isOptions: false };
  if (eventMethod === "OPTIONS") return { isValid: true, isOptions: true };
  const allowed = Array.isArray(allowedMethods) ? allowedMethods.map((method) => method.toUpperCase()) : [allowedMethods.toUpperCase()];
  return {
    isValid: allowed.includes(eventMethod),
    isOptions: false
  };
};

// apps/api-gateway/src/handlers/test.ts
var main = async (event) => {
  try {
    const { isValid, isOptions } = validateHttpMethodWithCors(event, "GET");
    if (isOptions) {
      return createCorsPreflightResponse(["GET"]);
    }
    if (!isValid) {
      return createErrorResponse(405, "Method not allowed");
    }
    const response = {
      message: "Hello from Lambda!!",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: event.requestContext.requestId
    };
    return createResponse(200, response);
  } catch (error) {
    console.error("Handler error:", error);
    return createErrorResponse(500, "Internal server error");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
//# sourceMappingURL=test.js.map
