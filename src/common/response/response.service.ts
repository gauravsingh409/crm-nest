import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success(data: any, message = 'Success', status = 200) {
    return {
      success: true,
      status,
      message,
      data,
      error: null,
    };
  }

  error(errorMessage: any, status = 500, data: any = null) {
    return {
      success: false,
      status,
      message: 'Error',
      data,
      error: errorMessage,
    };
  }

  custom({ success, status, message, data, error }: any) {
    return {
      success,
      status,
      message,
      data,
      error,
    };
  }
}
