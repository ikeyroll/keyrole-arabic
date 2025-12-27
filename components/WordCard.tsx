
import React, { useState } from 'react';
import { Word } from '../types';
import { Lightbulb, CheckCircle, Info, Volume2, Bookmark, Star } from 'lucide-react';

interface WordCardProps {
  word: Word;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleLearned: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  viewMode: 'grid' | 'list';
}

const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  isLearned, 
  isFavorite, 
  onToggleLearned, 
  onToggleFavorite,
  viewMode 
}) => {
  const [showMnemonic, setShowMnemonic] = useState(false);

  const handleMnemonic = () => {
    setShowMnemonic(!showMnemonic);
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.arabic);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  if (viewMode === 'list') {
    return (
      <div className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all hover:shadow-sm ${isLearned ? 'border-green-100 bg-green-50/20' : 'border-gray-100'}`}>
        <div className="flex items-center gap-6">
          <div className="w-16 text-2xl font-bold arabic-font text-gray-800">{word.arabic}</div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-pink-600">{word.transliteration}</span>
          </div>
          <div className="text-gray-700 font-medium">{word.meaning}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={speak} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Volume2 size={18} />
          </button>
          <button 
            onClick={() => onToggleLearned(word.id)}
            className={`p-2 transition-colors ${isLearned ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
          >
            <CheckCircle size={20} fill={isLearned ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={() => onToggleFavorite(word.id)}
            className={`p-2 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
          >
            <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isLearned ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
      <div className="absolute top-4 right-4 flex gap-2">
         <button 
          onClick={() => onToggleFavorite(word.id)}
          className={`transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-300 group-hover:text-yellow-200'}`}
        >
          <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button 
          onClick={() => onToggleLearned(word.id)}
          className={`transition-colors ${isLearned ? 'text-green-500' : 'text-gray-300 group-hover:text-green-200'}`}
        >
          <CheckCircle size={20} fill={isLearned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-3">
        <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-full uppercase tracking-wider">{word.category}</span>
        
        <h2 className="text-4xl font-bold arabic-font text-gray-800 cursor-pointer" onClick={speak}>{word.arabic}</h2>
        
        <div className="space-y-1">
          <p className="text-lg font-medium text-pink-500">{word.transliteration}</p>
        </div>

        <div className="w-full h-px bg-gray-50 my-2"></div>
        
        <p className="text-lg text-gray-700 font-semibold">{word.meaning}</p>
        
        <div className="flex gap-4 pt-2">
          <button 
            onClick={speak}
            className="flex items-center gap-1 text-xs text-blue-500 font-medium hover:underline"
          >
            <Volume2 size={14} /> Listen
          </button>
          {word.mnemonic && (
            <button 
              onClick={handleMnemonic}
              className="flex items-center gap-1 text-xs text-purple-500 font-medium hover:underline"
            >
              <Lightbulb size={14} /> Mnemonic
            </button>
          )}
        </div>

        {showMnemonic && word.mnemonic && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
            <p>{word.mnemonic}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;
