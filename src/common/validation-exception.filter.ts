import { ArgumentsHost, Catch, ExceptionFilter, UnprocessableEntityException } from "@nestjs/common";
import { ResponseService } from "./response.service";

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        const validationErrors: any = exception.getResponse();

        return response
            .status(status)
            .json(ResponseService.error(
                'Unprocessable Entity Exception',
                status,
                null,
                validationErrors.message || validationErrors
            ));
    }
}