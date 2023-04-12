exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlistId: {
      type: "VARCHAR(50)",
      references: "\"playlists\"",
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    songId: {
      type: "VARCHAR(50)",
      references: "\"songs\"",
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
