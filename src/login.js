import { generateSessionToken, corsHeaders } from './utils.js';

export async function handleLogin(request, env) {
	try {
		const { username, password } = await request.json();

		const user = `user:${username}`;

		const storedPassword = await env.chat_user_kv.get(user);
		if (storedPassword !== password) {
			return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
				status: 401,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}

		const sessionToken = generateSessionToken();
		const sessionData = {
			username: username,
			loggedInAt: Date.now(),
			expiresAt: Date.now() + 86400 // 24小时
		};

		await env.chat_user_kv.put(`session:${sessionToken}`, JSON.stringify(sessionData));

		const response = new Response(JSON.stringify({ success: true, username: username }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});

		response.headers.append('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`); // 7天

		return response;
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ error: '服务器错误' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}
