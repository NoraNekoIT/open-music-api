exports.up = (pgm) => {
  pgm.createTable("playlist_song_activities", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "\"playlists\"",
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "\"songs\"",
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "\"users\"",
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    action: {
      type: "VARCHAR(10)",
      notNull: true,
    },
    time: {
      type: "TEXT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_song_activities");
};
