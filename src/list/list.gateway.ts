import {SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
import { ListService } from './list.service';

@WebSocketGateway()
export class ListGateway {
  constructor(private readonly listService: ListService) {}

  @SubscribeMessage('list')
  async getList(client: any, payload: any): Promise<any> {
    console.log(client.handshake.headers['authorization']);
    console.log(payload);
  }
}
