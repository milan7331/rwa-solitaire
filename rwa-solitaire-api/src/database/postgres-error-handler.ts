import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";

export function handlePostgresError(error: any): void {
    switch(error.code) {
        case '23505':
            throw new ConflictException('Resource already exists');
        case '23503':
            throw new BadRequestException('Invalid foreign key reference');
        case '23514':
            throw new BadRequestException('Value violates a database constraint');
        case '23502':
            throw new BadRequestException('A required field is missing');
        case '23P01':
            throw new ConflictException('Value violates exclusion constraint');
        case '40001':
            throw new ConflictException('Serialization failure, please retry');
        case '40P01':
            throw new InternalServerErrorException('Deadlock detected, please retry');
        case '22001':
            throw new BadRequestException('String value too long for the column');
        case '22P02':
            throw new BadRequestException('Invalid data type provided');
        case '22003':
            throw new BadRequestException('Numeric value out of range');
        default: {
            console.error('Unhandled Postgres error:', error);
            throw new InternalServerErrorException('Unexpected database error');
        }
    }
}