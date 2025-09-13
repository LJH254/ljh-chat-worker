import { checkAuth, login } from './auth.js';

const username = await checkAuth();

if (username[0]) {
	open_page(`/`);
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const login_username = document.getElementById('username').value;
	const login_password = document.getElementById('password').value;

	try {
		const username = await login(login_username, login_password);

		if (username[0]) {
			open_page('/');
		} else {
			document.getElementById('login-message-container').style.display = 'flex';
			document.getElementById('login-message').textContent = (username === []) ? '未知错误，请联系站长' : username[1];
		}
	} catch (error) {
		document.getElementById('login-message').textContent = '登录失败';
	}
});
