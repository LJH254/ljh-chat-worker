import { register } from './auth.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const register_username = document.getElementById('username').value;
	const register_password = document.getElementById('password').value;
	const confirm_register_password = document.getElementById('confirm-password').value;

	if (register_password !== confirm_register_password) {
		document.getElementById('register-message-container').style.display = 'flex';
		document.getElementById('register-message').textContent = '两次输入密码不一致';
		return;
	}

	try {
		const username = await register(register_username, register_password);

		if (username[0]) {
			open_page('/');
		} else {
			document.getElementById('register-message-container').style.display = 'flex';
			document.getElementById('register-message').textContent = (username === []) ? '未知错误，请联系站长' : username[1];
		}
	} catch (error) {
		document.getElementById('register-message-container').style.display = 'flex';
		document.getElementById('register-message').textContent = '登录失败';
	}
});
