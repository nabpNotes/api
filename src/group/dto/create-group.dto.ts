export class CreateGroupDto {
    name: string;
    description: string;
    members: { userId: string, role: string }[];
    lists: { listId: string }[];
    createdAt: Date;
}

class Member {
    userId: string;
    role: string;
    joinedAt: Date;
}

class List {
    listId: string;
    addedAt: Date;
}
