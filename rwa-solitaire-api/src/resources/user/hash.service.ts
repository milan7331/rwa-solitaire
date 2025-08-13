import { Injectable } from "@nestjs/common";
import { argon2id, hash, verify } from "argon2";

@Injectable()
export class HashService {
    // Argon2id is typically the best option for password hashing because it provides
    // the security benefits of Argon2i and the performance of Argon2d, making it a
    // hybrid solution for general-purpose use cases.
    async hashPassword(password: string): Promise<string> {
        return hash(password, { type: argon2id });
    }

    async verifyPassword(storedHash: string, password: string): Promise<boolean> {
        return verify(storedHash, password);
    }
}