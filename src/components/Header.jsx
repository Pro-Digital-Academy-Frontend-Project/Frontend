import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../services/userApi';
import { useAuth } from '../utils/authContext';
import { FaBell } from 'react-icons/fa6';

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { nickname } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userApi.logout();
      setIsLoggedIn(false);
      localStorage.removeItem('nickname');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <div className="flex text-black_default justify-between p-3">
      <div
        className="cursor-pointer"
        onClick={() => {
          navigate('/');
        }}
      >
        <img src="/img/logo.jpg" alt="Logo" className="h-8 w-auto d-inline-block align-top" />
      </div>
      {isLoggedIn ? (
        // 로그인된 상태
        <div className="flex gap-3">
          <button>
            <FaBell className="text-blue-200 hover:text-blue-100 text-2xl" />
          </button>
          <button
            onClick={handleLogout}
            className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
          >
            로그아웃
          </button>
        </div>
      ) : (
        // 로그인되지 않은 상태
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/signUp')}
            className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
          >
            회원가입
          </button>
        </div>
      )}
    </div>
  );
}
