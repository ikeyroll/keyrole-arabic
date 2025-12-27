
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Grid, List, Layers, CheckCircle, GraduationCap, Trophy, ChevronRight, Settings, Info, Heart, LayoutDashboard, Brain } from 'lucide-react';
import { TOTAL_VOCAB, CATEGORIES } from './constants';
import { Word, ViewMode, UserStats } from './types';
import WordCard from './components/WordCard';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showQuiz, setShowQuiz] = useState(false);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('keyrole-vocab-stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local stats", e);
      }
    }
    return {
      learnedIds: [],
      favoriteIds: []
    };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('keyrole-vocab-stats', JSON.stringify(stats));
  }, [stats]);

  const filteredWords = useMemo(() => {
    const filtered = TOTAL_VOCAB.filter(word => {
      const matchesSearch = 
        word.arabic.toLowerCase().includes(search.toLowerCase()) ||
        word.transliteration.toLowerCase().includes(search.toLowerCase()) ||
        word.meaning.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || word.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    return filtered.sort((a, b) => {
      const aLearned = stats.learnedIds.includes(a.id);
      const bLearned = stats.learnedIds.includes(b.id);
      
      if (aLearned && !bLearned) return 1;
      if (!aLearned && bLearned) return -1;
      return 0;
    });
  }, [search, activeCategory, stats.learnedIds]);

  const toggleLearned = (id: number) => {
    setStats(prev => ({
      ...prev,
      learnedIds: prev.learnedIds.includes(id) 
        ? prev.learnedIds.filter(i => i !== id) 
        : [...prev.learnedIds, id]
    }));
  };

  const toggleFavorite = (id: number) => {
    setStats(prev => ({
      ...prev,
      favoriteIds: prev.favoriteIds.includes(id) 
        ? prev.favoriteIds.filter(i => i !== id) 
        : [...prev.favoriteIds, id]
    }));
  };

  const learnedCount = stats.learnedIds.length;
  const totalCount = TOTAL_VOCAB.length;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
              <GraduationCap className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Key-Role Vocab</h1>
              <p className="text-xs text-gray-500 font-medium">500 Core Arabic Essentials</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 flex-1 md:max-w-md">
            <Search className="text-gray-400 ml-2" size={18} />
            <input 
              type="text" 
              placeholder="Search Arabic, Transliteration or Meaning..." 
              className="bg-transparent border-none outline-none text-sm w-full py-1 text-gray-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end lg:hidden">
                <span className="text-xs text-gray-500 font-semibold">{learnedCount}/{totalCount}</span>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-gray-100 relative flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle 
                    cx="24" cy="24" r="20" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    className="text-pink-500"
                    strokeDasharray={126}
                    strokeDashoffset={126 - (126 * progressPercent / 100)}
                  />
                </svg>
                <span className="text-[10px] font-bold text-gray-700">{progressPercent}%</span>
             </div>
             <button
               onClick={() => setShowQuiz(true)}
               className="md:hidden w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center"
             >
               <Brain size={18} />
             </button>
             <button
               onClick={() => setShowQuiz(true)}
               className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
             >
               <Brain size={18} />
               Quiz Me
             </button>
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs text-gray-400 font-bold uppercase">Progress</span>
                <span className="text-sm font-bold text-gray-800">{learnedCount} / {totalCount} words</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Welcome Section */}
        <section className="mb-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-pink-100">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-2">Master Arabic Vocabulary</h2>
            <p className="text-pink-50 opacity-90 mb-6">Track your progress, use AI-powered mnemonics, and conquer the first 500 essential words of the Arabic language.</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3">
                <Trophy className="text-yellow-300" size={24} />
                <div>
                  <div className="text-lg font-bold leading-none">{learnedCount}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Learned</div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3">
                <Heart className="text-red-300" size={24} />
                <div>
                  <div className="text-lg font-bold leading-none">{stats.favoriteIds.length}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Favorites</div>
                </div>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="md:hidden bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 hover:bg-white/30 transition-colors"
              >
                <Brain className="text-purple-300" size={24} />
                <div>
                  <div className="text-sm font-bold leading-none">Quiz</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Test Yourself</div>
                </div>
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <LayoutDashboard size={200} />
          </div>
        </section>

        {/* Filters and View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Grid / List Display */}
        {filteredWords.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}>
            {filteredWords.map(word => (
              <WordCard 
                key={word.id} 
                word={word} 
                isLearned={stats.learnedIds.includes(word.id)}
                isFavorite={stats.favoriteIds.includes(word.id)}
                onToggleLearned={toggleLearned}
                onToggleFavorite={toggleFavorite}
                viewMode={viewMode === 'grid' ? 'grid' : 'list'}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No words found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
            <button 
              onClick={() => {setSearch(''); setActiveCategory('All');}}
              className="mt-6 text-pink-500 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer / Mobile Nav (Optional) */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">Made with ❤️ for Arabic learners</p>
          <div className="flex items-center justify-center gap-6 mt-4 opacity-50">
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Arabic Vocab v1.0</span>
          </div>
        </div>
      </footer>

      {showQuiz && (
        <Quiz
          words={TOTAL_VOCAB}
          learnedIds={stats.learnedIds}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

export default App;
