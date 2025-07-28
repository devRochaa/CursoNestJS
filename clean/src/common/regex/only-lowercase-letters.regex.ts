import { RegexProtocol } from './regex.protocol';

export class OnlyLowerCaseLettersRegex extends RegexProtocol {
  //se fosse interface seria implements no lugar de extends
  execute(str: string): string {
    return str.replace(/[^a-z]/g, '');
  }
}
