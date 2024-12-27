import { Injectable } from "@nestjs/common";
import { argon2id, hash, verify } from "argon2";


@Injectable()
export class HashService {
    // Argon2id is typically the best option for password hashing because it provides
    // the security benefits of Argon2i and the performance of Argon2d, making it a
    // hybrid solution for general-purpose use cases.
    async hashPassword(plainPassword: string): Promise<string> {
        return hash(plainPassword, { type: argon2id });
    }

    async verifyPassword(storedHash: string, plainPassword: string): Promise<boolean> {
        return verify(storedHash, plainPassword);
    }
}