import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {ListService} from './list.service';
import {Server, Socket} from 'socket.io';
import {Inject, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../auth/auth.service";
import {ListItemService} from "../list-item/list-item.service";


@WebSocketGateway({cors: ['*']})
export class ListGateway {
  constructor(
      @Inject(AuthService) private authService: AuthService,
      @Inject(ListService) private listService: ListService,
      @Inject(ListItemService) private listItemService: ListItemService
  ) {}

  @WebSocketServer()
  server: Server;

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

  @SubscribeMessage('getList')
  async getList(client: any, payload: any): Promise<any> {
    const authHeader = client.handshake.headers.authorization
    const list = await this.listService.findOne(authHeader, payload.listId);
    if (!list) {
        throw new UnauthorizedException('List not found');
    }
    client.emit('list', list);
    client.join(list._id);
  }

  @SubscribeMessage('getListItems')
    async getListItems(client: any, payload: any): Promise<any> {
        const authHeader = client.handshake.headers.authorization
        const listItems = await this.listItemService.findAllInList(authHeader, payload.listId);
        if (!listItems) {
            throw new UnauthorizedException('List items not found');
        }
        client.emit('listItems', listItems);
    }
}
