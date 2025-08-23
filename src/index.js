export default {
  	async fetch(request, env) {
	  	const url = new URL(request.url);
	  	const id = env.ChatRoom.idFromName("main-room");
	  	const room = env.ChatRoom.get(id);
	  	return room.fetch(request);
  	}
};
