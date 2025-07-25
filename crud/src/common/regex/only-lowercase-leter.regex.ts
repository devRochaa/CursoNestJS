import { RegexProtocol } from './regex.protocol';

export class OnlyLowerCaseLetters extends RegexProtocol {
  //se fosse interface seria implements no lugar de extends
  execute(str: string): string {
    return str.replace(/^[a-z]/g, '');
  }
}
