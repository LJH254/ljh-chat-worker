import { corsHeaders, parseCookies } from './utils.js';

export async function handleLogout(request, env) {
	try {
		const cookieHeader = request.headers.get('Cookie');
		if (cookieHeader) {
			const cookies = parseCookies(cookieHeader);
			const sessionToken = cookies.session;

			if (sessionToken) {
				await env.chat_user_kv.delete(`session:${sessionToken}`);
			}
		}

		const response = new Response(JSON.stringify({ success: true }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});

		response.headers.append('Set-Cookie', `session=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);

		return response;
	} catch (error) {
		return new Response(JSON.stringify({ error: '服务器错误' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}
