/**
 * song-model.js
 */

"use strict"

require("dotenv").config();
const mongoose = require("mongoose");

const ArtistSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: [String], required: true },
    }
)

const SongSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        genre: { type: String, required: true },
        releasedDate: { type: Date, required: true },
        artists: { type: [ArtistSchema], require: true }
    }
)

module.exports = mongoose.model(process.env.DB_SONG_MODEL, SongSchema, process.env.DB_SONG_COLLECTION)