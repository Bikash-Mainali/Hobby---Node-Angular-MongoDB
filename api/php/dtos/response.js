/**
 * response.js
 */

"use strict"

// This can be used for future purpose for hardening
class ResponseModel {
    constructor(message, data, status, url) {
        this.success = (!data) ? false : true,
        this.message = message
        this.data = data;
        this.status = status;
        this.url = url
    }
}

module.exports = ResponseModel
