import env from "./config/validateEnv";
import server from "./config/socket";

server.listen(env.PORT, () => {
  console.log(`Express app is running on: ${env.BASE_URL}:${env.PORT}`);
});

interface Error {
  name: string;
  message: string;
}

process.on("unhandledRejection", (err: Error) => {
  console.log(`unhandledRejection error : ${err.name} : ${err.message}`);
  server.close(() => {
    console.log("Shutting down server...");
    process.exit(1);
  });
});
