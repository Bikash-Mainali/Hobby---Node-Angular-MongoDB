/**
 * artist-controller.js
 */

"use strict"

const res = require("express/lib/response");
const { default: mongoose, mongo } = require("mongoose");
const Song = require("../models/song-model")
const getAll = function (req, res) {
    console.log(`Get all, artist controllers`);
    const songId = req.params.songId;
    const response = { status: 200, message: {} };
    if (mongoose.isValidObjectId(songId)) {
        Song.findById(songId).select("artists")
            .then((artists) => _onSuccessGetResponse(artists, res, response))
            .catch((err) => _onFailureGetResponse(err, res, response))
    }
    else {
        response.status = 400;
        response.message = `Song ID ${songId} is Invalid`;
        _onFailureGetResponse(response.message, res, response, response.status)
    }
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

const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);

}



const getOne = function (req, res) {
    console.log(`Get one, artist controllers`);
    const songId = req.params.songId;
    const artistId = req.params.artistId;
    const response = {
        status: 200, message: {}
    };
    if (mongoose.isValidObjectId(songId) && mongoose.isValidObjectId(artistId)) {
        Song.findById(songId).select("artists")
            .then((song) => _errorCheckOnGetOne(song, res, songId, artistId, response))
            .catch((err) => _onFailureGetResponse(err, response))
    }
    else {
        response.status = 400;
        response.message = `Song ID ${songId} or artist ID ${artistId} is Invalid`;
        _onFailureGetResponse(response.message, res, response, response.status)
    }
}

const _errorCheckOnGetOne = function (song, res, songId, artistId, response) {
    if (!song) {
        response.status = 404;
        response.message = `Song ID ${songId} is not found`;
        _onFailureGetResponse(response.message, res, response, response.status)
    } else {
        response.status = 200;
        response.message = (song.artists.id(artistId) != null ? song.artists.id(artistId) : { "message": `Artist Id ${artistId} not found` });
        res.status(response.status).json(response.message);
    }
}


// const addOne = function (req, res) {
//     console.log("Add One Artist Controller");
//     const songId = req.params.songId;
//     const response = { status: 201, message: {} };

//     Song.findById(songId).exec(function (err, song) {
//         if (err) {
//             responseData.status = 500;
//             responseData.message = err;
//         } else if (!song) {
//             responseData.status = 404;
//             responseData.message = { "message": `Song ID ${songId} not found` };
//         }
//         if (song) {
//             _addArtist(req, res, song);
//         } else {
//             res.status(responseData.status).json(responseData.message);
//         }
//     })
// }


const addOne = function (req, res) {
    console.log("Add One Artist Controller");
    const songId = req.params.songId;
    const response = { status: 201, message: {} };
    Song.findById(songId)
        .then((song) => {
            _addArtist(req, res, song);
        })
        .catch((err) => {
            _onFailurePostResponse(err, res, response);
        })
}

const _onSuccessPostResponse = function (newCreatedSong, res, response) {
    response.status = 201;
    response.message = newCreatedSong;
    res.status(response.status).json(response.message);
}
const _onFailurePostResponse = function (err, res, response) {
    response.status = 500;
    response.message = err;
    res.status(response.status).json(response.message);
}

const _addArtist = function (req, res, song) {
    song.artists.push({
        "name": req.body.name, "role": req.body.role
    })
    const response = { status: 201, message: [] };

    song.save()
        .then((updatedSong) => {
            response.message = updatedSong.artists;
            _onSuccessPostResponse(updatedSong, res, response)
        })
        .catch((err) => {
            _onFailurePostResponse(err, res, response)
        })
}



const deleteOne = function (req, res) {
    console.log(`Delete one, artist controllers`);
    const songId = req.params.songId;
    const artistId = req.params.artistId;
    const response = { status: 204, message: {} }
    Song.findById(songId).select("artists")
        .then((song) => {
            _deleteArtist(song, artistId, res, response)
        })
        .catch((err) => {
            _onFailureDeleteResponse(err, res, response)
        })
    }

const _deleteArtist = function (song, artistId, res, response) {
    const artist = song.artists.id(artistId);
    artist.remove();
    song.save()
        .then((deletedSong) => {
            _onSuccessDeleteResponse(deletedSong, res, response);
        })
        .catch((err) => {
            _onFailureDeleteResponse(err, res, response)
        })
}

const _onSuccessDeleteResponse = function (deletedSong, res, response) {
    response.status = 204;
    response.message = deletedSong;
    res.status(response.status).json(response.message);

}
const _onFailureDeleteResponse = function (err, res, response, status) {
    response.status = status || 500;
    response.message = err;
    res.status(response.status).json(response.message);
}





const fullUpdateOne = function (req, res) {
    console.log(`Put Update one, song controller`);
    if (mongoose.isValidObjectId(req.params.songId) && mongoose.isValidObjectId(req.params.artistId)) {
    const updateSong = function (req, res, song, responseData) {
        const artistId = req.params.artistId;
        const artist = song.artists.id(artistId);
        if (artist) {
            artist.name = req.body.name;
            artist.role = req.body.role;
            song.save()
                .then((updatedSong) => {
                    response.message = updatedSong.artists;
                    _onSuccessUpdateResponse(updatedSong, res, response);
                })
                .catch((err) => {
                    _onFailureUpdateResponse(err, res, response)
                })

        } else {
            responseData.status = 404;
            responseData.message = { "message": `Artist ID ${artistId} not found` };
            res.json(responseData.message)
        }
    }
    _updateOne(req, res, updateSong);
    }
    else {
        responseData.status = 404;
        responseData.message = { "message": `Artist ID ${artistId} not found` };
        _onFailureUpdateResponse(err, res, response, response.status)
    }
}

const partialUpdateOne = function (req, res) {
    console.log(`Patch Update one, song controller`);
    if (mongoose.isValidObjectId(req.params.songId) && mongoose.isValidObjectId(req.params.artistId)) {
        const updateSong = function (req, res, song, responseData) {
            const artistId = req.params.artistId;
            const artist = song.artists.id(artistId);
            const response = { status: 400, message: {}}
            if (artist) {
                if (req.body.name) {
                    artist.name = req.body.name;
                }
                if (req.body.role) {
                    artist.role = req.body.role;
                }
                song.save()
                .then((updatedSong) => {
                    response.message = updatedSong.artists;
                    _onSuccessUpdateResponse(updatedSong, res, response);
                })
                .catch((err) => {
                    _onFailureUpdateResponse(err, res, response)
                })
                
            } else {
                responseData.status = 404;
                responseData.message = { "message": `Artist ID ${artistId} not found` };
                _onFailureUpdateResponse(err, res, response, response.status)

            }

        }
        _updateOne(req, res, updateSong);
    }
    else {
        response.status = 400;
        response.message = { "message": `Artist ID ${artistId} not found` };
        _onFailureUpdateResponse(err, res, response, response.status)
    
    }
}

const _updateOne = function (req, res, updateSongCallBack) {
    const songId = req.params.songId;
    const response = { status: 204, message: {} }
    Song.findById(songId)
        .then((song) => {
            response.message = song;
            updateSongCallBack(req, res, song, response);
        })
        .catch((err) => {
            _onFailureUpdateResponse(err, res, response)
        })
    
    
    // .exec(function (err, song) {
    //     const responseData = { status: 204, message: song };
    //     if (err) {
    //         responseData.status = 500;
    //         responseData.message = err;
    //     }
    //     else if (!song) {
    //         responseData.status = 404;
    //         responseData.message = { "message": `Song ID ${songId} not found` };
    //     }
    //     if (responseData.status !== 204) {
    //         res.status(responseData.status).json(responseData.message);
    //     } else {
    //         updateSongCallBack(req, res, song, responseData);
    //     }
    // })
}




const _onSuccessUpdateResponse = function (updatedSong, res, response) {
    response.status = 204;
    response.message = updatedSong
    res.status(response.status).json(response.message);
}

const _onFailureUpdateResponse = function (err, res, response, status) {
    response.status = status || 500;
    response.message = err;
    res.status(response.status).json(response.message);

}


module.exports = {
    getAll,
    getOne,
    addOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}