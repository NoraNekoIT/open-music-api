const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1,$2,$3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, 
        playlists.name, 
        (select users.username from users where users.id = playlists.owner)
        FROM playlists
        LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
        LEFT JOIN users on collaborations.user_id = users.id
        WHERE users.id = $1 or playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlists gagal dihapus. Id tidak ditemukan");
    }
  }

  async addSongToPlaylistById(playlistId, songId) {
    const id = `playlist_item-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs (id, \"playlistId\", \"songId\") VALUES ($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Song gagal ditambahkan kedalam playlist");
    }
  }

  async IsExistsSongId(songId) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Resource yang anda minta tidak ditemukan");
    }
  }

  async getSongsFromPlaylistById(id) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists
            INNER JOIN users
            ON users.id = playlists.owner
            WHERE playlists.id = $1 `,
      values: [id],
    };
    const playlist = await this._pool.query(queryPlaylist);

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer from songs
          INNER JOIN playlist_songs
          ON playlist_songs."songId" = songs.id
          WHERE playlist_songs."playlistId" = $1`,
      values: [id],
    };

    const songs = await this._pool.query(querySongs);
    return {
      id: playlist.rows[0].id,
      name: playlist.rows[0].name,
      username: playlist.rows[0].username,
      songs: songs.rows,
    };
  }

  async deleteSongFromPlaylistById(id, songId) {
    const query = {
      text: `DELETE FROM playlist_songs
            WHERE "playlistId" = $1 AND "songId" = $2`,
      values: [id, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Song gagal dihapus dari playlist. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: "SELECT * from playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Resource yang anda minta tidak ditemukan");
    }

    const playlist = result.rows[0];

    // console.log(playlist.owner !== owner);
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Forbidden Resource 403");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new NotFoundError("Playlist not found");
    }

    if (rows[0].owner !== userId) {
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch (error) {
        throw new AuthorizationError("You don't have access for this resource");
      }
    }
  }

  async isExistSongInPlaylist(playlistId, songId) {
    const query = {
      text: "SELECT * from playlist_songs where 'playlistId' = $1 and 'songId' = $2",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount >= 1) {
      throw new InvariantError("Resource Bad Request");
    }
  }
}

module.exports = PlaylistsService;
