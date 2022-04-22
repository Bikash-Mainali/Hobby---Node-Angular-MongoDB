"user strict"
require("dotenv").config();
const bcrypt = require("bcrypt");
const Response = require("../dtos/response")
const User = require("../models/user-model")
const jwt = require('jsonwebtoken');




const getAll = function (req, res) {

    const response = { status: 200, message: {} }

    User.find()
        .then((users) => _onSuccessGetResponse(users, res, response))
        .catch((err) => _onFailureGetResponse(err, res, response))
}


const _onSuccessGetResponse = function (users, res, response) {
    response.status = 200;
    response.message = users;
    res.status(response.status).json(response.message);
}
const _onFailureGetResponse = function (err, res, response, status) {
    response.status = status || 500;
    response.message = err;
    res.status(response.status).json(response.message);
}

/**
 * 1. generate salt synchronously
 * 2. bcrypt password
 * 3. create and save user
 */

const addOne = function (req, res) {
    req.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const salt = bcrypt.genSaltSync(10);
    const response = {
        status: 201,
        message: {}
    }
    if (req.body && req.body.username && req.body.password) {
        _createHash(null, salt, req, res)
    }
    else {
        response.status = 400;
        response.message = `Bad request`;
        //(`Bad request`, res, response);
        res.status(response.status).json(response.message)
    }

    function _createHash(err, salt, req, res) {
        if (err) {
            response.status = 500;
            response.message = err;
            _onFailurePostResponse(err, res, response);
        } else {
            bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                _createUser(err, hashedPassword, req, res);
            })
        }
    }
    function _createUser(err, hashedPassword, req, res) {
        if (err) {
            response.status = 500;
            response.message = err;
            _onFailurePostResponse(err, res, response);
        }
        else {
            const newUser = {
                name: req.body.name,
                username: req.body.username,
                password: hashedPassword,
            };

            User.create(newUser)
                .then((newCreatedUser) => {
                    _onSuccessPostResponse(newCreatedUser, res, response)
                })
                .catch((err) => {
                    _onFailurePostResponse(err, res, response);
                })
                .finally(() => {
                    _sendResponse(res, response)
                })
        }
    };

}

const _onSuccessPostResponse = function (newCreatedUser, res, response) {
    response.status = 201;
    response.message = newCreatedUser;
    // res.status(response.status).json(response.message);
}
const _onFailurePostResponse = function (err, res, response) {
    console.log("Error creating new User: ");
    response.status = 500;
    response.message = err;
    // res.status(response.status).json(response.message);
}



/**
 * using asyn/await instead of promise
 */
async function login(req, res) {
    try {

        const { username, password } = req.body;
        const response = {
            status: 200,
            data: null,
            message: {}
        }

        if (!username || !password) {
            const errorMessage = `Unauthorized Access`;
            return _onFailureLoginResponse(errorMessage, res, response)
        }

        const user = await User.findOne({ username: username });
        if (!user) {
            const errorMessage = `Username does not exists.`;
            return _onFailureLoginResponse(errorMessage, res, response)
        }
        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            const errorMessage = `Password incorrect`;
            return _onFailureLoginResponse(errorMessage, res, response)
        } else {
            //login successful then generate token
            const accessToken = jwt.sign({
                name: user.name,
                username: user.username,
                password: user.password,
                //role: user.role
            }, 
            process.env.ACCESSS_TOKEN_SECRET, { expiresIn:30000 });

            console.log(accessToken)
            const data = { username: user.username, name: user.name, token: accessToken };
            return _onSuccessLoginResponse(res, data)
        }
    } catch (error) {
        return res.status(500).json("Something went wrong. Please try again later");
    }

}



// const login = function (req, res) {
//     const response = {
//         status: 200,
//         message: {}
//     }

//     if (req.body && req.body.username && req.body.password) {
//         User.findOne({ username: req.body.username })
//             .then((user) => _verifyUser(user, req, response))
//              .catch(() => _onFailureLoginResponse(err, response))
//     }
// }

/**
 * compare password
 */
const _verifyUser = function (user, req, response) {
    if (!user) {
        response.status = 401;
        response.message = 'Unauthorized'
        _onFailureLoginResponse(response.message, response);
    }
    else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            response.status = 200;
            response.message = 'password matched, login successful';
            _onSuccessLoginResponse(response);
        }
        else {
            response.status = 401;
            response.message = 'Unauthorized';
            _onFailureLoginResponse(response.message, response);
        }

    }
}


const _onSuccessLoginResponse = function (res, response) {
    response.status = 200;
    response.message = 'Login successful'
    res.status(response.status).json(response)
}
const _onFailureLoginResponse = function (errorMessage, res, response) {
    response.status = 401;
    response.message = errorMessage;
    res.status(response.status).json(response)

}

const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);
}

module.exports = {
    getAll,
    addOne,
    login,
}


