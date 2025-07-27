import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import {
  ONLY_LOWERCASE_LETTER_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from 'src/recados/recados.constant';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowerCaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
import { RegexFactory } from 'src/common/regex/regex.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: REMOVE_SPACES_REGEX,
      useFactory: () => {
        // Meu código
        new RemoveSpacesRegex();
      },
    },
    {
      provide: RecadosUtils, //token
      useValue: new RecadosUtilsMock(), ///fingi ser a classe para escrever testes
    },
    {
      provide: SERVER_NAME, //variavel criada para nao errar nome na hora de passar
      useValue: 'My name is NestJS',
    },
    {
      provide: RegexProtocol,
      // eslint-disable-next-line no-constant-condition
      useClass: 2 !== 2 ? RemoveSpacesRegex : OnlyLowerCaseLettersRegex,
    },
    {
      provide: ONLY_LOWERCASE_LETTER_REGEX, //ASSIM VOCE PODE USAR INTERFACES
      useClass: OnlyLowerCaseLettersRegex,
    },
    {
      provide: REMOVE_SPACES_REGEX, //ASSIM VOCE PODE USAR INTERFACES E ADICIONAR TDS AO MESMO TEMPO
      useClass: RemoveSpacesRegex,
    },
  ],
  exports: [
    SERVER_NAME,
    {
      provide: RecadosUtils,
      useClass: RecadosUtils,
    },
  ],
})
export class RecadosModule {}
