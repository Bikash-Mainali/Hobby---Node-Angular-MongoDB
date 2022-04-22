
/**
 * song-controller.js
 */

"use strict"

require("dotenv").config();
const Song = require("../models/song-model")
const mongoose = require("mongoose");
const res = require("express/lib/response");
const ObjectId = require("mongodb").ObjectId;

/**
 * GET ALL
 */
const getAll = function (req, res) {
    console.log(`Get all, song controller`);
    let count = parseInt(process.env.DEFAULT_COUNT_LIMIT, 10)
    let offset = parseInt(process.env.DEFAULT_OFFSET, 10)
    const maxCount = parseInt(process.env.DEFAULT_MAXIMUM_COUNT, 10)

    const response = { status: 200, message: {} };

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);

    }
    if (req.query && req.query.offset) {
        count = parseInt(req.query.offset, 10);
    }

    //for multiple filters;
    let searchQuery = {}
    if (req.query && (req.query.title || req.query.genre || req.query.releasedDate)) {
        const searchObj = []
        if (req.query.title) {
            searchObj.push({
                title: {
                    $regex: req.query.title + ".*"
                }
            });

        }
        if (req.query.genre) {
            searchObj.push({
                genre: req.query.genre
            });
        }
        if (req.query.releasedDate) {
            searchObj.push({
                releasedDate: req.query.releasedDate
            })
        }
        searchQuery = {
            $and: searchObj
        };

    }

    if (count > maxCount) {
        response.status = 400;
        response.message = `count must be less than ${maxCount}`
        res.status(response.status).json(response.message);
        return;

    }
    if (isNaN(count) || isNaN(offset)) {
        response.status = 400;
        response.message = `offset and count must be digit`;
        res.status(response.status).json(response.message);
        return;

    }

    console.log(searchQuery.releasedDate)
    Song.find(searchQuery).sort({ _id: -1 }).skip(offset).limit(count)
        .then((songs) => _onSuccessGetResponse(songs, res, response))
        .catch((err) => _onFailureGetResponse(err, res, response))
}

const _onSuccessGetResponse = function (songs, res, response) {
    response.status = 200;
    response.message = songs;
    res.status(response.status).json(response.message);
}
const _onFailureGetResponse = function (err, res, response, status) {
    response.status = status || 500;
    response.message = err;
    res.status(response.status).json(response.message);
}

/**
 * ADD ONE
 */
const addOne = function (req, res) {
    console.log(`Add one, song controller`);
    const response = { status: 201, message: {} }
    const newSong = {
        title: req.body.title,
        genre: req.body.genre,
        releasedDate: req.body.releasedDate,
        artists: req.body.artists
    };
    Song.create(newSong)
        .then((newCreatedSong) => {
            _onSuccessPostResponse(newCreatedSong, response)
        })
        .catch((err) => {
            _onFailurePostResponse(err, response);
        })
        .finally(() => {
            _sendResponse(res, response);
        })
}

const _onSuccessPostResponse = function (newCreatedSong, response) {
    response.status = 201;
    response.message = newCreatedSong;
}
const _onFailurePostResponse = function (err, response) {
    response.status = 500;
    response.message = err;
}



/**
 * GET ONE
 */
const getOne = function (req, res) {
    console.log(`Get one, song controller`);
    const songId = req.params.songId;
    const response = {
        status: 200, message: {}
    };
    if (mongoose.isValidObjectId(songId)) {
        Song.findById(songId)
            .then((song) => _errorCheckOnGetOne(song, res, songId, response))
            .catch((err) => _onFailureGetResponse(err, response))
    }
    else {
        response.status = 400;
        response.message = `Song ID is Invalid`;
        _onFailureGetResponse(response.message, res, response, response.status)
    }
}

const _errorCheckOnGetOne = function (song, res, songId, response) {
    if (!song) {
        response.status = 404;
        response.message = `Song ID ${songId} is not found`;
        _onFailureGetResponse(response.message, res, response, response.status)
    } else {
        _onSuccessGetResponse(song, res, response)
    }
}


/**
 * DELETE ONE
 */
const deleteOne = function (req, res) {
    console.log(`Delete one, song controller`);
    const songId = req.params.songId;
    const response = { status: 204, message: {} };
    if (mongoose.isValidObjectId(songId)) {
        Song.findById(songId).then((song) => {
            Song.findByIdAndDelete(songId)
                .then((deletedSong) => _onSuccessDeleteResponse(deletedSong, response))
                .catch((err) => _onFailureDeleteResponse(err, response))
                .finally(() => _sendResponse(res, response))
        })
            .catch((err) => _onFailureGetResponse(res, response))
    }
    else {
        response.status = 400;
        response.message = `Song ID ${songId} is invalid`;
        _onFailureDeleteResponse(response.message, response, response.status)
    }
}


const _onSuccessDeleteResponse = function (deletedSong, response) {
    response.status = 204;
    response.message = deletedSong;

}
const _onFailureDeleteResponse = function (err, response, status) {
    response.status = status || 500;
    response.message = err;
}


const fullUpdateOne = function (req, res) {
    console.log(`Update one, song controller`);
    const updateSong = function (req, res, song, response) {
        song.title = req.body.title;
        song.genre = req.body.genre;
        song.releasedDate = req.body.releasedDate;
        song.artists = req.body.artists;
        song.save()
            .then((updatedSong) => {
                _onSuccessUpdateResponse(updatedSong, response);
            })
            .catch((err) => {
                _onFailureUpdateResponse(err, res, response)
            })
            .finally(() => _sendResponse(res, response))
    }
    _updateOne(req, res, updateSong);
}

const partialUpdateOne = function (req, res) {
    console.log(`Patch Update one, song controller`);
    const updateSong = function (req, res, song, response) {
        if (req.body.title) {
            song.title = req.body.title;
        }
        if (req.body.genre) {
            song.genre = req.body.genre;
        }
        if (req.body.releasedDate) {
            song.releasedDate = req.body.releasedDate;
        }
        if (req.body.artists) {
            song.artists = req.body.artists;
        }
        song.save()
            .then((updatedSong) => {
                _onSuccessUpdateResponse(updatedSong, response);
            })
            .catch((err) => {
                _onFailureUpdateResponse(err, res, response)
            })
            .finally(() => _sendResponse(res, response))
    }
    _updateOne(req, res, updateSong);
}

const _updateOne = function (req, res, updateSongCallBack) {
    console.log(`Put Update one, song controller`);
    const songId = req.params.songId;
    const response = { status: 204, message: {} };
    if (mongoose.isValidObjectId(songId)) {
        Song.findById(songId)
            .then((song) => {
                if (!song) {
                    response.status = 404;
                    response.message = `Song ID ${songId} not found`;
                    _onFailureUpdateResponse(response.message, res, response, response.status)
                }
                else {
                    updateSongCallBack(req, res, song, response)
                }
            })
            .catch((err) => {
                _onFailureUpdateResponse(err, res, response)
            })
    }
    else {
        response.status = 400;
        response.message = `Song ID ${songId} is invalid`;
        _onFailureUpdateResponse(response.message, res, response, response.status)
    }
}


const _onSuccessUpdateResponse = function (updatedSong, response) {
    response.status = 204;
    response.message = updatedSong
}

const _onFailureUpdateResponse = function (err, res, response, status) {
    response.status = status || 500;
    response.message = err;
    res.status(response.status).json(response.message);

}


const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);

}

module.exports = {
    getAll,
    addOne,
    getOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}
