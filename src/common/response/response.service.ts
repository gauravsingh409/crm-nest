import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success(data: unknown, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      error: null,
    };
  }

  pagination(data: unknown, meta: unknown) {
    return {
      success: true,
      statusCode: 200,
      message: 'Data retrived successfully',
      data,
      pagination: meta,
      error: null,
    };
  }

  paginationMetaData(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);

    return {
      totalItems: total,
      currentPage: page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      firstItemIndex: (page - 1) * limit + 1,
      lastItemIndex: Math.min(page * limit, total),
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
