
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
      <div className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all hover:shadow-sm ${isLearned ? 'border-emerald-200 bg-emerald-50/30' : 'border-emerald-100'}`}>
        <div className="flex items-center gap-6">
          <div className="w-16 text-2xl font-bold arabic-font text-emerald-900">{word.arabic}</div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-teal-600">{word.transliteration}</span>
          </div>
          <div className="text-emerald-800 font-medium">{word.meaning}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={speak} className="p-2 text-emerald-400 hover:text-teal-600 transition-colors">
            <Volume2 size={18} />
          </button>
          <button 
            onClick={() => onToggleLearned(word.id)}
            className={`p-2 transition-colors ${isLearned ? 'text-emerald-600' : 'text-gray-300 hover:text-emerald-500'}`}
          >
            <CheckCircle size={20} fill={isLearned ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={() => onToggleFavorite(word.id)}
            className={`p-2 transition-colors ${isFavorite ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}
          >
            <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isLearned ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-emerald-100'}`}>
      <div className="absolute top-4 right-4 flex gap-2">
         <button 
          onClick={() => onToggleFavorite(word.id)}
          className={`transition-colors ${isFavorite ? 'text-amber-500' : 'text-gray-300 group-hover:text-amber-300'}`}
        >
          <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button 
          onClick={() => onToggleLearned(word.id)}
          className={`transition-colors ${isLearned ? 'text-emerald-600' : 'text-gray-300 group-hover:text-emerald-300'}`}
        >
          <CheckCircle size={20} fill={isLearned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-3">
        <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">{word.category}</span>
        
        <h2 className="text-4xl font-bold arabic-font text-emerald-900 cursor-pointer" onClick={speak}>{word.arabic}</h2>
        
        <div className="space-y-1">
          <p className="text-lg font-medium text-teal-600">{word.transliteration}</p>
        </div>

        <div className="w-full h-px bg-emerald-100 my-2"></div>
        
        <p className="text-lg text-emerald-800 font-semibold">{word.meaning}</p>
        
        <div className="flex gap-4 pt-2">
          <button 
            onClick={speak}
            className="flex items-center gap-1 text-xs text-teal-600 font-medium hover:underline"
          >
            <Volume2 size={14} /> Listen
          </button>
          {word.mnemonic && (
            <button 
              onClick={handleMnemonic}
              className="flex items-center gap-1 text-xs text-amber-600 font-medium hover:underline"
            >
              <Lightbulb size={14} /> Mnemonic
            </button>
          )}
        </div>

        {showMnemonic && word.mnemonic && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
            <p>{word.mnemonic}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;
