import React from 'react';
import { User } from '../types';
import { 
  SignalIcon, 
  SignalSlashIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  user: User;
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, isConnected }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Travas</h1>
            <p className="text-sm text-gray-500">Asisten AI Lokal Indonesia</p>
          </div>
        </div>

        {/* Connection Status and User Info */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <SignalIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600">Terhubung</span>
              </>
            ) : (
              <>
                <SignalSlashIcon className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-600">Terputus</span>
              </>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-gray-500 capitalize">
                {user.preferences.language === 'id-ID' && 'Indonesia'}
                {user.preferences.language === 'en-US' && 'English'}
                {user.preferences.language === 'jv-ID' && 'Jawa'}
                {user.preferences.language === 'su-ID' && 'Sunda'}
              </p>
            </div>
          </div>

          {/* Settings Button */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;