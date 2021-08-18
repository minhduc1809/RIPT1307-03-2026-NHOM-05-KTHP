// import { currentUser } from '@/services/user';
import { useState } from 'react';
// import { get } from '@/services/user/user';

export default () => {
  const [danhSachUser, setdanhSachUser] = useState<User.Result[]>([]);
  const [loading, setloading] = useState(true);

  return { danhSachUser, loading, setloading, setdanhSachUser };
};
