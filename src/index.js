import { handleRegister } from './register.js';
import { handleLogin } from './login.js';
import { handleGetUser } from './getuser.js';
import { handleLogout } from './logout.js';
import { corsHeaders } from './utils.js';

export { ChatRoom } from './ChatRoom.js';


export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

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

		if (pathname === '/api/clear_message') {
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

		if (pathname === '/api/register' && request.method === 'POST') {
			return handleRegister(request, env);
		} else if (pathname === '/api/login' && request.method === 'POST') {
			return handleLogin(request, env);
		} else if (pathname === '/api/user' && request.method === 'GET') {
			return handleGetUser(request, env);
		} else if (pathname === '/api/logout' && request.method === 'POST') {
			return handleLogout(request, env);
		}


		return new Response('Not Found', { status: 404 });
	}
};
