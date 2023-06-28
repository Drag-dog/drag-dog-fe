const RFC5322 =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const email = RFC5322;
const domain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+(?:\:[0-9]{1,})*$/;
const engAndNum = /(?=.*[A-Za-z])(?=.*\d)/;
const specialCharacters = /(?=.*[$@$!%*#?&])/;

export type Validations = { (value: string, criterion?: number): boolean };

export const isRequired: Validations = (value) => {
  return value.length > 0;
};

export const isMin: Validations = (value, criterion = NaN) => {
  return Number(value) >= criterion;
};

export const isMax: Validations = (value, criterion = NaN) => {
  return Number(value) <= criterion;
};

export const isMinLength: Validations = (value, criterion = NaN) => {
  return value.length >= criterion;
};

export const isMaxLength: Validations = (value, criterion = NaN) => {
  return value.length <= criterion;
};

export const isEngAndNum: Validations = (value) => {
  return engAndNum.test(value);
};

export const isSpecialCharactors: Validations = (value) => {
  return specialCharacters.test(value);
};

export const isEmail: Validations = (value) => {
  return email.test(value);
};

export const isDomain: Validations = (value) => {
  return domain.test(value);
};
