import { parseCookies, corsHeaders, generateSessionToken } from './utils.js';


export async function handleGetUser(request, env) {
	try {
		const cookieHeader = request.headers.get('Cookie');
		if (!cookieHeader) {
			return new Response(JSON.stringify({ error: '未认证' }), {
				status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}

		const cookies = parseCookies(cookieHeader);
		const sessionToken = cookies.session;

		if (!sessionToken) {
			return new Response(JSON.stringify({ error: '未认证' }), {
				status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}

		const sessionData_json = await env.chat_user_kv.get(`session:${sessionToken}`);
		if (!sessionData_json) {
			return new Response(JSON.stringify({ error: '无效会话' }), {
				status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}

		const sessionData = JSON.parse(sessionData_json);

		if (sessionData.expiresAt < Date.now()) {
			const newSessionToken = generateSessionToken();
			const newSessionData = {
				username: sessionData.username,
				loggedInAt: Date.now(),
				expiresAt: Date.now() + 86400 // 24小时
			};
			await env.chat_user_kv.delete(`session:${sessionToken}`);
			await env.chat_user_kv.put(`session:${newSessionToken}`, JSON.stringify(newSessionData));

			const response =  new Response(JSON.stringify({ user: newSessionData }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});

			response.headers.append('Set-Cookie', `session=${newSessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`);

			return response;
		}

		return new Response(JSON.stringify({ user: sessionData }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: '服务器错误' }), {
			status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}
