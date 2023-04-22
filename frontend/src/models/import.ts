import { type IColumn } from '@/components/Table/typing';
import { useState } from 'react';

export default () => {
  const [headLine, setHeadLine] = useState<Record<string, string>>(); // A: "Mã"
  const [fileData, setFileData] = useState<Record<string, string>[]>(); // "Má": "ABC"
  const [matchedColumns, setMatchedColumns] = useState<Record<string, string>>(); // ma: "Mã"
  const [columns, setColumns] = useState<IColumn<any>[]>([]);

  return {
    headLine,
    setHeadLine,
    fileData,
    setFileData,
    matchedColumns,
    setMatchedColumns,
    columns,
    setColumns,
  };
};
