const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike({ credentialId, albumId }) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes VALUES($1,$2,$3) RETURNING id",
      values: [id, credentialId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Like ke album gagal ditambahkan");
    }
    await this._cacheService.delete(`cache:${albumId}`);
    return result.rows[0].id;
  }

  async deleteAlbumLikeById({ credentialId, albumId }) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [credentialId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
    await this._cacheService.delete(`cache:${albumId}`);
  }

  async getAlbumLikeById(albumId) {
    try {
      // cache
      const countLike = await this._cacheService.get(`cache:${albumId}`);
      return { likes: JSON.parse(countLike), isCache: true };
    } catch (error) {
      const queryAlbumLike = {
        text: "SELECT Count(*) FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const { rows } = await this._pool.query(queryAlbumLike);
      const countLike = parseInt(rows[0].count, 10);

      await this._cacheService.set(`cache:${albumId}`, JSON.stringify(countLike));
      return { likes: countLike, isCache: false };
    }
  }

  async isExistAlbumLike({ credentialId, albumId }) {
    const query = {
      text: "SELECT * FROM user_album_likes WHERE user_id = $1 and album_id = $2",
      values: [credentialId, albumId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError("Bad Request");
    }
  }
}

module.exports = AlbumLikeService;
