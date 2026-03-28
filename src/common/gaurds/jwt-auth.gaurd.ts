import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This guard uses the 'jwt' strategy (defined in JwtStrategy)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

}
