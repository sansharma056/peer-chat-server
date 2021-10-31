import http from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;
const server = http.createServer();

const io = new Server(server, {
	cors: {
		origin: `http://localhost:1234`,
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`connected ${socket.id}`);

	socket.on("disconnect", () => {
		console.log(`disconnected ${socket.id}`);
	});
});

server.listen(port, () => {
	console.log(`listening on port ${port}`);
});
