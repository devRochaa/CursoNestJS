export const createUsuarioDtoFactory = (overrides = {}) => {
  return {
    email: 'teste@gmail.com',
    password: '123456',
    name: 'teste',
    ...overrides,
  };
};
