import React, { useState } from 'react';
import { User } from '../types';
import {
  LanguageIcon,
  SpeakerWaveIcon,
  SunIcon,
  MoonIcon,
  TrashIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  user: User;
  onPreferencesChange: (preferences: Partial<User['preferences']>) => void;
  isConnected: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onPreferencesChange, isConnected }) => {
  const [isOpen, setIsOpen] = useState(true);

  const languages = [
    { code: 'id-ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'jv-ID', name: 'Jawa', flag: '🏛️' },
    { code: 'su-ID', name: 'Sunda', flag: '🌿' }
  ];

  const voices = [
    { id: 'id-ID-Standard-A', name: 'Sari', language: 'id-ID', gender: 'female' },
    { id: 'id-ID-Standard-B', name: 'Budi', language: 'id-ID', gender: 'male' },
    { id: 'jv-ID-Standard-A', name: 'Sri', language: 'jv-ID', gender: 'female' },
    { id: 'su-ID-Standard-A', name: 'Asep', language: 'su-ID', gender: 'male' }
  ];

  const handleLanguageChange = (language: string) => {
    onPreferencesChange({ language: language as any });
  };

  const handleVoiceChange = (voice: string) => {
    onPreferencesChange({ voice });
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    onPreferencesChange({ theme });
  };

  const clearChatHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
      // TODO: Implement clear chat history
      console.log('Clearing chat history...');
    }
  };

  const exportChatHistory = () => {
    // TODO: Implement export chat history
    console.log('Exporting chat history...');
  };

  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col ${isOpen ? '' : 'hidden'}`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pengaturan</h2>
        <p className="text-sm text-gray-500">Sesuaikan preferensi Anda</p>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Language Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <LanguageIcon className="w-4 h-4 mr-2" />
            Bahasa
          </h3>
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  user.preferences.language === lang.code
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {user.preferences.language === lang.code && (
                  <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <SpeakerWaveIcon className="w-4 h-4 mr-2" />
            Suara
          </h3>
          <div className="space-y-2">
            {voices
              .filter(voice => voice.language === user.preferences.language)
              .map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => handleVoiceChange(voice.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    user.preferences.voice === voice.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{voice.name[0]}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{voice.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{voice.gender}</p>
                  </div>
                  {user.preferences.voice === voice.id && (
                    <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tema</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                user.preferences.theme === 'light'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SunIcon className="w-4 h-4" />
              <span className="text-sm">Terang</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                user.preferences.theme === 'dark'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <MoonIcon className="w-4 h-4" />
              <span className="text-sm">Gelap</span>
            </button>
          </div>
        </div>

        {/* Chat Management */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Kelola Chat</h3>
          <div className="space-y-2">
            <button
              onClick={clearChatHistory}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span className="text-sm">Hapus Riwayat</span>
            </button>
            <button
              onClick={exportChatHistory}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span className="text-sm">Ekspor Chat</span>
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status Koneksi</h3>
          <div className={`p-3 rounded-lg border ${
            isConnected 
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">
                {isConnected ? 'Terhubung ke server' : 'Terputus dari server'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Travas v1.0.0</p>
          <p>Asisten AI Lokal Indonesia</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;