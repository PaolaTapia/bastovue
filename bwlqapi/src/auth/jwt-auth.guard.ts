import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //para saber rol se puede usar aqui: canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> { }
}
