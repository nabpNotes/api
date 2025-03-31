export class CreateGroupDto {
    name: string;
    members: {
        userId: string,
        role: string,
        joinedAt: number
    } [];
    lists: {
        listId: string
    } [];
    createdAt?: number;
}


export class Member {
    userId: string;
    role: string;
    joinedAt: Date;
}

class List {
    listId: string;
    addedAt: Date;
}