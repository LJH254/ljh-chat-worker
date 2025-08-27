// export function createCookieAuthMiddleware(env) {
// 	return {
// 		async authenticateRequest(request) {
// 			const url = new URL(request.url);
//
// 			const cookieHeader = request.headers.get('Cookie');
// 			let sessionToken = null;
//
// 			if (cookieHeader) {
// 				const cookies = cookieHeader.split(';');
// 				for (const cookie of cookies) {
// 					const [name, value] = cookie.trim().split('=');
// 					if (name === 'session_token') {
// 						sessionToken = value;
// 						break;
// 					}
// 				}
// 			}
//
// 			if (!sessionToken) {
// 				return {
// 					authenticated: false,
// 					error: 'No session token found in cookies'
// 				};
// 			}
//
// 			try {
// 				const session = await env.chat_user_kv.get(`session:${sessionToken}`, 'json');
//
// 				if (!session) {
// 					return {
// 						authenticated: false,
// 						error: 'Invalid or expired session token'
// 					};
// 				}
//
// 				if (session.expiresAt < Date.now()) {
// 					await env.chat_user_kv.delete(`session:${sessionToken}`);
// 					return {
// 						authenticated: false,
// 						error: 'Session expired'
// 					};
// 				}
//
// 				session.expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24小时
// 				await env.chat_user_kv.put(
// 					`session:${sessionToken}`,
// 					JSON.stringify(session),
// 					{ expirationTtl: 24 * 60 * 60 } // 24小时过期
// 				);
//
// 				return {
// 					authenticated: true,
// 					user: session.user,
// 					token: sessionToken
// 				};
// 			} catch (error) {
// 				return {
// 					authenticated: false,
// 					error: 'Session validation failed'
// 				};
// 			}
// 		},
//
// 		setAuthCookie(token, response, maxAge = 24 * 60 * 60) {
// 			const newResponse = new Response(response.body, response);
// 			newResponse.headers.append('Set-Cookie',
// 				`session_token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}; Path=/`
// 			);
// 			return newResponse;
// 		},
//
// 		clearAuthCookie(response) {
// 			const newResponse = new Response(response.body, response);
// 			newResponse.headers.append('Set-Cookie',
// 				'session_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
// 			);
// 			return newResponse;
// 		}
// 	};
// }
