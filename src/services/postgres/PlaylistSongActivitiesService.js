const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivities(
    playlistId,
    songId,
    userId,
    action,
  ) {
    const id = `logs-${nanoid(16)}`;

    const time = new Date().toISOString();
    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Collaboration gagal ditambahkan");
    }
    return result.rows.id;
  }

  async getPlaylistSongActivitiesById(id) {
    const queryPlaylist = {
      text: "SELECT id FROM playlists WHERE id = $1",
      values: [id],
    };
    const playlist = await this._pool.query(queryPlaylist);

    const queryActivities = {
      text: `SELECT users.username,
          songs.title,
          playlist_song_activities.action,
          playlist_song_activities.time
          FROM playlist_song_activities
          JOIN users
          ON playlist_song_activities.user_id = users.id  
          JOIN songs
          ON playlist_song_activities.song_id = songs.id 
          JOIN playlists
          ON playlist_song_activities.playlist_id = playlists.id 
          WHERE playlists.id = $1
          AND playlist_song_activities.playlist_id = $1`,
      values: [id],
    };

    const activities = await this._pool.query(queryActivities);

    return {
      playlistId: playlist.rows[0].id,
      activities: activities.rows,
    };
  }
}

module.exports = PlaylistSongActivitiesService;
