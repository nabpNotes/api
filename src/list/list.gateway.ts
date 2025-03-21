import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {ListService} from './list.service';
import {Server, Socket} from 'socket.io';
import {Inject, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../auth/auth.service";
import {ListItemService} from "../list-item/list-item.service";

/**
 * This gateway handles list related operations
 */
@WebSocketGateway({cors: ['*']})
export class ListGateway {
    constructor(
        @Inject(AuthService) private authService: AuthService,
        @Inject(ListService) private listService: ListService,
        @Inject(ListItemService) private listItemService: ListItemService
    ) {
    }

    @WebSocketServer()
    server: Server;

    /**
     * This function is called when the module is initialized
     * It checks if the user is authenticated and disconnects if not
     */
    onModuleInit() {
        this.server.on('connection', (socket: Socket) => {
            if (!socket.handshake.headers.authorization) {
                return socket.disconnect();
            }
            const authHeader = socket.handshake.headers.authorization
            const decoded = this.authService.validateTokenWithBearer(authHeader);
            if (!decoded) {
                return socket.disconnect();
            }
        });
    }

    /**
     * This function gets a list
     * @param client - The client
     * @param payload - The payload
     * @returns The list
     */
    @SubscribeMessage('getList')
    async getList(client: any, payload: any): Promise<any> {
        const authHeader = client.handshake.headers.authorization
        const list = await this.listService.findOne(authHeader, payload.listId);
        if (!list) {
            throw new UnauthorizedException('List not found');
        }
        client.join(payload.listId);
        client.emit('list', list);
    }

    /**
     * This function gets all lists in a group
     * @param client - The client
     * @param payload - The payload
     */
    @SubscribeMessage('getListItems')
    async getListItems(client: any, payload: any): Promise<any> {
        const authHeader = client.handshake.headers.authorization
        const listItems = await this.listItemService.findAllInList(authHeader, payload.listId);
        if (!listItems) {
            throw new UnauthorizedException('List items not found');
        }
        client.emit('listItems', listItems);
    }

    @SubscribeMessage('updateListItem')
    async updateListItem(client: any, payload: any): Promise<any> {
        const authHeader = client.handshake.headers.authorization;
        const listItem = await this.listItemService.update(authHeader, payload.listId, payload.listItemId, payload.data);
        if (!listItem) {
            throw new UnauthorizedException('List item not found');
        }
        this.server.to(payload.listId).emit('listItemUpdate', listItem);
    }
}
