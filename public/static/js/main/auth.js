export async function checkAuth() {
	try {
		const response = await fetch(`${API_BASE}/api/user`, {
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			return [ true, data.user.username ];
		}

		return [ false ];
	} catch (error) {
		console.error('认证检查失败:', error);
		return [];
	}
}

export async function register(username, password) {
	try {
		const response = await fetch(`${API_BASE}/api/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok) {
			return await login(username, password);
		} else {
			return [ false, data.error ];
		}
	} catch (error) {
		console.error('注册失败:', error);
		return [];
	}
}

export async function login(username, password) {
	try {
		const response = await fetch(`${API_BASE}/api/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok) {
			return [ true, data.username ];
		} else {
			return [ false, data.error ];
		}
	} catch (error) {
		console.error('登录失败:', error);
		return [];
	}
}

export async function logout() {
	try {
		await fetch(`${API_BASE}/api/logout`, {
			method: 'POST',
			credentials: 'include'
		});
	} catch (error) {
		console.error('登出失败:', error);
		return [];
	}
}
