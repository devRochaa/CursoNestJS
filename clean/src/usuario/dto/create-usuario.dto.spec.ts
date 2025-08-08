import { validate } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

describe('CreateUsuarioDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateUsuarioDto();
    dto.email = 'teste@emample.com';
    dto.name = 'teste';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if invalid email', async () => {
    const dto = new CreateUsuarioDto();
    dto.email = 'email-invalido';
    dto.name = 'teste';
    dto.password = '123456';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });
});
