import { type WebSocket } from '@fastify/websocket';

const connections = new Map<string, Set<WebSocket>>();

//Cria conexão @socket com um usario:@userID
export function addConnection(userID: string, socket: WebSocket) {
  if (!connections.has(userID)) {
    connections.set(userID, new Set());
  }
  connections.get(userID)!.add(socket);

  console.log(
    `WS ${userID} Connected (${connections.get(userID)!.size} Connections) `
  );
}

//Remove uma conexão anteriormente criada. Quando fecha ou perde a conexão
export function removeConnection(userID: string, socket: WebSocket) {
  const userSockets = connections.get(userID); // atraves de um Map busca todas as conexões de u usuario

  if (!userSockets) {
    //Caso o usuário:@userID não tiver nenhuma connection a função para
    return;
  }

  userSockets.delete(socket); //deleta o connection-socket

  // se o user não tiver conexões restantes é deletada a entrada do Map
  if (userSockets.size === 0) {
    connections.delete(userID);
  }

  console.log(
    `WS ${userID} disconnected! (${userSockets.size} Connections left) `
  );
}

// Tipo para definir o evento ->{event: "Task:created", data{ id: ".."}}
type WSEvent = {
  event: string;
  data: unknown;
};

// Envia/atualiza um evento: @payload para o usuario passado com @userID
export function emitToUser(userID: string, payload: WSEvent) {
  const userSockets = connections.get(userID);
  if (!userSockets) return;

  const message = JSON.stringify(payload);

  for (const socket of userSockets) {
    if (socket.readyState === 1) {
      socket.send(message);
    }
  }
}
