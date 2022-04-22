/**
 * song.routes.js
 */

"use strict"
const authController = require("../controllers/auth/authentication.controller")
const songController = require("../controllers/song-controller")
const artistController = require("../controllers/artist-controller")
const express = require("express");
const songRoutes = express.Router();

songRoutes.route("/")
    .get(songController.getAll)
    .post(authController.authenticateToken, songController.addOne)

songRoutes.route("/:songId")
    .get(songController.getOne)
    .put(authController.authenticateToken, songController.fullUpdateOne)
    .patch(authController.authenticateToken, songController.partialUpdateOne)
    .delete(authController.authenticateToken, songController.deleteOne)


songRoutes.route("/:songId/artists")
    .get(artistController.getAll)
    .post(authController.authenticateToken, artistController.addOne)

songRoutes.route("/:songId/artists/:artistId")
    .get(artistController.getOne)
    .put(authController.authenticateToken, artistController.fullUpdateOne)
    .patch(authController.authenticateToken, artistController.partialUpdateOne)
    .delete(authController.authenticateToken, artistController.deleteOne)


module.exports = songRoutes;