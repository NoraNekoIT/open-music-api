const autoBind = require("auto-bind");

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;
    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;
    await this._service.isExistAlbumLike({ credentialId, albumId });
    await this._albumsService.getAlbumById(albumId);
    await this._service.addAlbumLike({ credentialId, albumId });
    const response = h.response({
      status: "success",
      message: "Like berhasil ditambahkan ke album",
    });

    return response.code(201);
  }

  async deleteAlbumLikeByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;
    await this._service.deleteAlbumLikeById({ credentialId, albumId });
    return {
      status: "success",
      message: "Like berhasil dihapus",
    };
  }

  async getAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const result = await this._service.getAlbumLikeById(albumId);
    if (result.isCache === true) {
      const response = h.response({
        status: "success",
        data: { likes: result.likes },
      });
      response.header("X-Data-Source", "cache");
      return response;
    }
    return {
      status: "success",
      data: { likes: result.likes },
    };
  }
}

module.exports = AlbumLikesHandler;
