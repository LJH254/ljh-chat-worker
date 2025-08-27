export { ChatRoom } from './ChatRoom.js';


export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (request.headers.get('Upgrade') === 'websocket') {
			try {
				const roomName = 'main_room';

				const roomId = env.ChatRoom.idFromName(roomName);
				const room = env.ChatRoom.get(roomId);

				return room.fetch(request);
			} catch (error) {
				return new Response(`WebSocket错误: ${error.message}`, { status: 500 });
			}
		}

		if (url.pathname === '/api/clear_message') {
			try {
				const roomName = 'main_room';

				const roomId = env.ChatRoom.idFromName(roomName);
				const room = env.ChatRoom.get(roomId);

				const response = await room.fetch('https://host/clear_message');
				return new Response(await response.text());
			} catch (err) {
				return new Response(err.message);
			}
		}

		return new Response('Not Found', { status: 404 });
	}
};
