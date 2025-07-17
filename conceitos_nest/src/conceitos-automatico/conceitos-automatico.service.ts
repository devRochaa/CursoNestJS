import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceitosAutomaticoService {
  getHome() {
    return 'Conceito Automaticos pelo service';
  }
}
