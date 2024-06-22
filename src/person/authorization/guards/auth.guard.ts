import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Attach the user payload to the request object
      request['user'] = payload;

      // Extract the user ID from the request parameters
      const userIdFromParams = request.params.id;
      const userIdFromToken = payload.id;

      // Check if the user ID from the parameters matches the ID in the JWT payload
      if (userIdFromParams !== userIdFromToken) {
        throw new UnauthorizedException('User ID does not match');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token or user ID');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
