export const formatPersianDate = (dateString: string): string => {
  if (!dateString) return 'تنظیم نشده';
  
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return dateString;
  
  const year = parts[0];
  const monthIndex = parseInt(parts[1]) - 1;
  const day = parts[2];
  
  if (monthIndex >= 0 && monthIndex < 12) {
    return `${day} ${persianMonths[monthIndex]} ${year}`;
  }
  
  return dateString;
};