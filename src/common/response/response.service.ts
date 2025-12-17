import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success(data: any, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      error: null,
    };
  }

  error(errorMessage: any, statusCode = 500, data: any = null) {
    return {
      success: false,
      statusCode,
      message: 'Error',
      data,
      error: errorMessage,
    };
  }

  custom({ success, statusCode, message, data, error }: any) {
    return {
      success,
      statusCode,
      message,
      data,
      error,
    };
  }
}
