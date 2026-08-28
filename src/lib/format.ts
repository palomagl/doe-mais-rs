export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const normalizeText = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]+/g, "");

export const capitalizeWords = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}` : "")
    .join(" ");

export const formatCpf = (value: string) =>
  onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const invalidCpfPatterns = /^(\d)\1{10}$/;

export const isCpf = (value: string) => {
  const digits = onlyDigits(value);
  if (digits.length !== 11 || invalidCpfPatterns.test(digits)) return false;

  const calcDigit = (factor: number) => {
    const total = digits
      .slice(0, factor - 1)
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * (factor - index), 0);
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calcDigit(10);
  const secondDigit = calcDigit(11);

  return firstDigit === Number(digits[9]) && secondDigit === Number(digits[10]);
};

export const cpfAuthEmail = (cpf: string) => `${onlyDigits(cpf)}@cpf.doeplus.app`;
