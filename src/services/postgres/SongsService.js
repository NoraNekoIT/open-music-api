const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let text = "SELECT id, title, performer FROM songs";
    const values = [];

    if (title) {
      text += " WHERE LOWER(title) LIKE '%' || LOWER($1) || '%'";
      values.push(title);
    }

    if (!title && performer) {
      text += " WHERE LOWER(performer) LIKE '%' || LOWER($1) || '%'";
      values.push(performer);
    }

    if (title && performer) {
      text += " AND LOWER(performer) LIKE '%' || LOWER($2) || '%'";
      values.push(performer);
    }

    const query = {
      text,
      values,
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async getSongByAlbumId(albumId) {
    const querySongs = {
      text: "SELECT id, title, performer FROM songs WHERE \"albumId\" = $1 ",
      values: [albumId],
    };
    let resultSongs;
    try {
      resultSongs = await this._pool.query(querySongs);
    } catch (e) {
      console.error(e);
      resultSongs = [];
    }
    return resultSongs.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return result.rows[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    let text = "UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5, duration = $6 WHERE id = $1 RETURNING id";
    const values = [id, title, year, genre, performer, duration];
    if (albumId !== null) {
      text = "UPDATE songs SET title = $2,year = $3, genre = $4, performer = $5, duration = $6, albumId = $7 WHERE id = $1 RETURNING id";
      values.push(albumId);
    }

    const query = {
      text,
      values,
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui musik. Id tidak ditemukan.");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Song gagal dihapus");
    }
  }
}

module.exports = SongsService;
