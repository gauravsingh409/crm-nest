export class ResponseService {
  static success(data: unknown, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      error: null,
    };
  }

  static pagination(data: unknown, meta: unknown, message = 'Data retrived successfully') {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      pagination: meta,
      error: null,
    };
  }

  static paginationMetaData(total: number, page: number, limit: number) {
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

  static error(
    message: any,
    statusCode = 500,
    data: any = null,
    error?: string,
  ) {
    return {
      success: false,
      statusCode,
      message: message,
      data,
      error: error,
    };
  }

  static custom({ success, statusCode, message, data, error }: any) {
    return {
      success,
      statusCode,
      message,
      data,
      error,
    };
  }
}
