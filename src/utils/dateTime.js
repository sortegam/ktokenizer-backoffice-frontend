import format from 'date-fns/format';

export const dateTimeFormat = strDate => format(strDate, 'YYYY/MM/DD HH:mm:ss');
export const dateTimeMsFormat = strDate => format(strDate, 'YYYY/MM/DD HH:mm:ss.SSS');
export const dateFormat = strDate => format(strDate, 'YYYY/MM/DD');
