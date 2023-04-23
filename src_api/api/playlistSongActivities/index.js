const PlaylistSongActivitiesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistSongActivities",
  version: "1.0.0",
  async register(server, {
    playlistSongActivitiesService,
    playlistsService,
  }) {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      playlistSongActivitiesService,
      playlistsService,
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};
