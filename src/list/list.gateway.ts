import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {ListService} from './list.service';
import {Server} from 'socket.io';
import {UnauthorizedException} from "@nestjs/common";


@WebSocketGateway({cors: ['*']})
export class ListGateway {
  constructor(private readonly listService: ListService) {
  }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket.io connection established');
    });
  }

  @SubscribeMessage('getList')
  async getList(client: any, payload: any): Promise<any> {
    if (!client.handshake.headers.authorization || !client.handshake.headers.authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = client.handshake.headers.authorization.split(' ')[1];

    const list = await this.listService.findOne(token, payload.listId);
    if (!list) {
        throw new UnauthorizedException('List not found');
    }
    client.emit('list', list);
  }
}
