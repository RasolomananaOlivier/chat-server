import httpServer from "./app";

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
