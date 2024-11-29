const io = require("socket.io")(8900, {
  cors: {
      origin: "http://localhost:3001",
  },
});

let users = [];

// Add a user to the list
const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
      users.push({ userId, socketId });
      console.log(`User added: ${JSON.stringify({ userId, socketId })}`);
  }
};

// Remove a user by socketId
const removeUser = (socketId) => {
  console.log(`Removing user with socketId: ${socketId}`);
  users = users.filter((user) => user.socketId !== socketId);
  console.log(`Remaining users: ${JSON.stringify(users)}`);
};

// Get a user by userId
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // Handle adding a user
  socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users); // Send updated user list to all clients
  });

  // Handle sending a message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
          io.to(user.socketId).emit("getMessage", {
              senderId,
              text,
          });
          console.log(`Message sent from ${senderId} to ${receiverId}: ${text}`);
      } else {
          console.log(`User with ID ${receiverId} not found.`);
      }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
      console.log(`A user disconnected: ${socket.id}`);
      removeUser(socket.id);
      io.emit("getUsers", users); // Send updated user list to all clients
  });
});
