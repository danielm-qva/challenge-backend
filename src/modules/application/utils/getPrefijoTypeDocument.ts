export const getPrefTypeDocument = (typeDocument: string) => {
  switch (typeDocument) {
    case 'Passport':
      return 'PSP';
    case 'DNI':
      return 'DNI';
    case 'Accreditation':
      return 'ADC';
    default:
      return '';
  }
};

export const parseDate = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]?.replace(/-/g, '');
};
