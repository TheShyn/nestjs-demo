import { HttpException, HttpStatus } from "@nestjs/common";



export class ResponseException extends HttpException {
    constructor(status?: HttpStatus, message?: string, data?: any) {
        super(
            {
                status: status,
                message: message || "Dữ liệu không hợp lệ",
                data: data || null,
            },
            status || HttpStatus.INTERNAL_SERVER_ERROR,
        )

    }
}