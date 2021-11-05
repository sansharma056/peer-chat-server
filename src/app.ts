import * as http from "http";
import { Server } from "socket.io";

type Message =
	| {
			type: "video-offer" | "video-answer";
			sdp: RTCSessionDescriptionInit;
	  }
	| {
			type: "new-ice-candidate";
			candidate: RTCIceCandidateInit;
	  }
	| {
			type: "stream-info";
			id: string;
			content: "screen" | "audio";
	  };

const port = process.env.PORT || 3000;
const server = http.createServer();

const io = new Server(server, {
	cors: {
		origin: process.env.ORIGIN_URL || "http://localhost:1234",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`connected ${socket.id}`);

	let roomId: string = "";

	socket.on("room:join", (id: string) => {
		roomId = id;
		socket.join(id);
		console.log(`room joined ${socket.id}`);
	});

	socket.on("msg:post", (msg: Message) => {
		socket.to(roomId).volatile.emit("msg:get", msg);
	});

	socket.on("disconnect", () => {
		console.log(`disconnected ${socket.id}`);
	});
});

server.listen(port, () => {
	console.log(`listening on port ${port}`);
});
