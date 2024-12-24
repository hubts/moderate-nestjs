import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { createHash } from "crypto";

/**
 * Crypto extension from 'crypto' library.
 *
 * If you do not want to use 'bcrypt', delete the methods associated with the library.
 */
export class CryptoExtension {
    /**
     * Get SHA-256 hash.
     * @param {string | Buffer} data - Input ingredient to hash.
     * @returns {string} Hashed result in SHA-256 (32 bytes).
     */
    static sha256(data: string | Buffer): string {
        return createHash("sha256").update(data).digest("hex");
    }

    /**
     * Bcrypt: Hash the password.
     * @param {string} password - The password to be hashed.
     * @returns {string} Hashed result.
     */
    static hashPassword(password: string): string {
        const saltOrRounds = genSaltSync();
        return hashSync(password, saltOrRounds);
    }

    /**
     * Bcrypt: Compare the hash password and the original expected.
     * @param plainPassword - The original password before hashing.
     * @param hashPassword - The hash password (may be expected as result).
     * @returns {boolean} Whether the hash of the password matches or not.
     */
    static comparePassword(
        plainPassword: string,
        hashPassword: string
    ): boolean {
        return compareSync(plainPassword, hashPassword);
    }
}
