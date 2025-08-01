import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let passwordIsValid: boolean = false;
    let throwError = true;

    //checar email
    const usuario = await this.usuarioRepository.findOneBy({
      email: loginDto.email,
      active: true,
    });

    if (!usuario) {
      throw new UnauthorizedException('Pessoa não autorizada.');
    }

    passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      usuario.passwordHash,
    );

    if (passwordIsValid) {
      throwError = false;
    }

    if (throwError) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    return this.createTokens(usuario);
  }

  private async createTokens(usuario: Usuario) {
    const accessTokenPromise = this.signJwtAsync<Partial<Usuario>>(
      usuario.id,
      this.jwtConfiguration.jwtTtl,
      { email: usuario?.email },
    );

    const refreshTokenPromise = this.signJwtAsync<Partial<Usuario>>(
      usuario.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // assinar jwt do refresh token e de tokens normais
  private async signJwtAsync<T>(sub: number, expiresIn, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokensFunction(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );

      const user = await this.usuarioRepository.findOneBy({
        id: sub,
        active: true,
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não autorizado.');
      }
      return this.createTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
