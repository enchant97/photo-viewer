import { Buffer } from "buffer";

/**
 * Encode a string into base64
 * @param data - string to encode
 * @returns base64 encoded string
 */
export const to_b64 = (data: string) => Buffer.from(data).toString("base64");
/**
 * Decode a string from base64 into utf8
 * @param data - string to decode
 * @returns the decoded string
 */
export const from_b64 = (data: string) => Buffer.from(data, "base64").toString("utf8");
