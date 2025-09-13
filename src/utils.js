export const corsHeaders = {
	'Access-Control-Allow-Origin': 'https://chat.ljhchat.xyz',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Credentials': 'true'
};

export function generateSessionToken() {
	return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function parseCookies(cookieHeader) {
	const cookies = {};
	cookieHeader.split(';').forEach(cookie => {
		const [name, value] = cookie.split('=').map(c => c.trim());
		if (name) cookies[name] = value;
	});
	return cookies;
}
