/**
 * song-model.js
 */

"use strict"

require("dotenv").config();
const mongoose = require("mongoose");


const UserSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true }
    }
)

module.exports = mongoose.model(process.env.DB_USER_MODEL, UserSchema, process.env.DB_USER_COLLECTION)