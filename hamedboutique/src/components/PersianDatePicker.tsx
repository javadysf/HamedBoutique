"use client";
import React, { useState } from 'react';

interface PersianDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({ value, onChange, placeholder }) => {
  const [day, setDay] = useState(value ? value.split('/')[2] || '' : '');
  const [month, setMonth] = useState(value ? value.split('/')[1] || '' : '');
  const [year, setYear] = useState(value ? value.split('/')[0] || '' : '');

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const handleDateChange = (newDay: string, newMonth: string, newYear: string) => {
    if (newDay && newMonth && newYear) {
      const formattedDate = `${newYear}/${newMonth.padStart(2, '0')}/${newDay.padStart(2, '0')}`;
      onChange(formattedDate);
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = e.target.value;
    setDay(newDay);
    handleDateChange(newDay, month, year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    handleDateChange(day, newMonth, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    handleDateChange(day, month, newYear);
  };

  return (
    <div className="flex gap-2">
      <select
        value={day}
        onChange={handleDayChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
      >
        <option value="">روز</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      
      <select
        value={month}
        onChange={handleMonthChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
      >
        <option value="">ماه</option>
        {persianMonths.map((monthName, index) => (
          <option key={index + 1} value={index + 1}>{monthName}</option>
        ))}
      </select>
      
      <select
        value={year}
        onChange={handleYearChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
      >
        <option value="">سال</option>
        {Array.from({ length: 80 }, (_, i) => 1403 - i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

export default PersianDatePicker;