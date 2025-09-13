import { corsHeaders } from './utils.js';


export async function handleRegister(request, env) {
	try {
		const { username, password } = await request.json();

		if (!username || !password) {
			return new Response(JSON.stringify({ error: '请输入用户名和密码' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}

		const user = `user:${username}`;

		const existingUser = await env.chat_user_kv.get(user);
		if (existingUser) {
			return new Response(JSON.stringify({ error: '用户已存在' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}

		await env.chat_user_kv.put(user, password);

		return new Response(JSON.stringify({ success: true }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: '服务器错误' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}
