/**
 * Returns JWT token's payload data.
 */
export declare function getTokenPayload(token: string): {
    [key: string]: any;
};
/**
 * Checks whether a JWT token is expired or not.
 * Tokens without `exp` payload key are considered valid.
 * Tokens with empty payload (eg. invalid token strings) are considered expired.
 *
 * @param token The token to check.
 * @param [expirationThreshold] Time in seconds that will be subtracted from the token `exp` property.
 */
export declare function isTokenExpired(token: string, expirationThreshold?: number): boolean;
