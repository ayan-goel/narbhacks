/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as analyticsChunked from "../analyticsChunked.js";
import type * as conversations from "../conversations.js";
import type * as messages from "../messages.js";
import type * as openai from "../openai.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as wrapped from "../wrapped.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  analyticsChunked: typeof analyticsChunked;
  conversations: typeof conversations;
  messages: typeof messages;
  openai: typeof openai;
  users: typeof users;
  utils: typeof utils;
  wrapped: typeof wrapped;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
