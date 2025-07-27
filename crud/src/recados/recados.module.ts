import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import {
  ONLY_LOWERCASE_LETTER_REGEX,
  ONLY_LOWERCASE_LETTER_REGEX_FACTORY,
  REMOVE_SPACES_REGEX,
  REMOVE_SPACES_REGEX_FACTORY,
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
    RegexFactory, //modo 3
    {
      provide: REMOVE_SPACES_REGEX_FACTORY, //token
      useFactory: (regexFactory: RegexFactory) => {
        // Meu código / logica
        return regexFactory.create('RemoveSpacesRegex');
      }, //factory
      inject: [RegexFactory], //injetando na factory na hora
    },

    {
      provide: ONLY_LOWERCASE_LETTER_REGEX_FACTORY, //token
      useFactory: async (regexFactory: RegexFactory) => {
        //espera alguma coisa acontecer /
        console.log('Vou aguardar a Promise abaixo ser resolvida');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Pronto');
        // Meu código / logica
        return regexFactory.create('OnlyLowercaseLettersRegex');
      }, //factory
      inject: [RegexFactory], //injetando na factory na hora
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
      provide: RegexProtocol, // modo 1 - logica no module para escolher
      // eslint-disable-next-line no-constant-condition
      useClass: 2 !== 2 ? RemoveSpacesRegex : OnlyLowerCaseLettersRegex,
    },
    {
      //modo 2
      provide: ONLY_LOWERCASE_LETTER_REGEX, //ASSIM VOCE PODE USAR INTERFACES
      useClass: OnlyLowerCaseLettersRegex,
    },
    {
      //modo 2
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
