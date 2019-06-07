class ResponseBody {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

exports.ResponseBody = ResponseBody;