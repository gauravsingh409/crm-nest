import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
    async saveMessage(data: {
        roomId: string;
        message: string;
        userId: string;
    }) {
        // persist to DB (Prisma / TypeORM / etc.)
        return {
            id: crypto.randomUUID(),
            ...data,
            createdAt: new Date(),
        };
    }
}
