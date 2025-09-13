import { v4 as uuidv4 } from 'uuid';


export class ChatRoom {
	constructor(state, env) {
		this.state = state;
		this.storage = state.storage;
		this.env = env;
		this.sessions = new Set();

		if (!this.messageHistory) {
			this.initialize();
		}
	}

	async initialize() {
		this.messageHistory = [];

		const msgKeys = await this.storage.list({ prefix: `message:` });
		for (const key of msgKeys) {
			this.messageHistory.push({ message: key[1].message, username: key[1].username, timestamp: key[1].timestamp });
		}
		this.messageHistory = this.messageHistory.sort((a, b) => {
			return a.timestamp - b.timestamp;
		});
	}

	async fetch(request) {
		const url = new URL(request.url);

		if (url.pathname === '/clear_message') {
			try {
				const keys = await this.storage.list();
				await Promise.all(Array.from(keys.keys()).map(key => this.storage.delete(key)));
				return new Response('Successfully cleared all chat messages!', { status: 200 });
			} catch (err) {
				return new Response(err.message, { status: 500 });
			}
		}

		if (request.headers.get('Upgrade') === 'websocket') {
			const pair = new WebSocketPair();
			const [client, server] = Object.values(pair);

			this.state.acceptWebSocket(server);
			this.sessions.add(server);

			if (server.readyState === 1) {
				this.messageHistory.forEach(msg => {
					server.send(JSON.stringify(msg));
				});
			}

			return new Response(null, { status: 101, webSocket: client });
		}
		return new Response('Expected WebSocket', { status: 400 });
	}

	async webSocketMessage(ws, message) {
		let data;
		try {
			data = JSON.parse(message);
		} catch {
			return;
		}

		const messageId = uuidv4();

		this.messageHistory.push({ message: data.message, username: data.username });
		await this.storage.put(`message:${messageId}`, {
			messageId: messageId,
			message: data.message,
			username: data.username,
			timestamp: performance.now()
		});
		this.broadcast(ws, message);
	}

	broadcast(ws, message) {
		this.sessions.forEach(session => {
			try {
				if (session !== ws) {
					session.send(message);
				}
			} catch (e) {
				this.sessions.delete(session);
			}
		});
	}

	async webSocketClose(ws, _code, _reason, _wasClean) {
		this.sessions.delete(ws);
	}
}
