import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState<number>(0);
  const [tab, setTab] = useState<string>('1');

  return {
    tab,
    setTab,
    current,
    setCurrent,
  };
};
