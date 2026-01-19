import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const GetUser = createParamDecorator(
    (data: unknown, etx: ExecutionContext) => {
        const request = etx.switchToHttp().getRequest();
        return request.user;
    }
)