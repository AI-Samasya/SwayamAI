import React, { useState } from 'react';
import { Search, Star, Download, ArrowRight, Clock, TrendingUp, Heart, Filter } from 'lucide-react';

const ExtensionMarketplace = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'All Extensions', count: 150 },
    { name: 'Accessibility', count: 45 },
    { name: 'Productivity', count: 38 },
    { name: 'Developer Tools', count: 27 },
    { name: 'AI & ML', count: 24 },
    { name: 'Security', count: 16 }
  ];

  const extensions = [
    {
      id: 1,
      name: 'AI Voice Commander',
      description: 'Control your browser with natural voice commands powered by advanced AI.',
      tags: ['AI/ML', 'Accessibility'],
      rating: 4.9,
      reviews: 1243,
      downloads: '125K',
      pricing: 'Free',
      author: 'VoiceFlow Labs',
      authorAvatar: '/api/placeholder/32/32',
      badge: 'Featured'
    },
    {
      id: 2,
      name: 'Code Translator Pro',
      description: 'Instantly translate code between 20+ programming languages using AI.',
      tags: ['Developer', 'AI/ML'],
      rating: 4.8,
      reviews: 856,
      downloads: '89K',
      pricing: '$4.99',
      author: 'DevTech AI',
      authorAvatar: '/api/placeholder/32/32',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Focus Flow',
      description: 'Block distractions and boost productivity with customizable focus modes.',
      tags: ['Productivity'],
      rating: 4.7,
      reviews: 2156,
      downloads: '230K',
      pricing: 'Free',
      author: 'Mindful Tech',
      authorAvatar: '/api/placeholder/32/32'
    },
    {
      id: 4,
      name: 'Smart Reader',
      description: 'AI-powered screen reader with natural voice and 40+ languages support.',
      tags: ['Accessibility', 'AI/ML'],
      rating: 4.9,
      reviews: 1867,
      downloads: '156K',
      pricing: '$2.99',
      author: 'AccessTech Pro',
      authorAvatar: '/api/placeholder/32/32',
      badge: 'Popular'
    },
    {
      id: 5,
      name: 'DevTools X',
      description: 'Enhanced developer tools with AI code suggestions and debugging.',
      tags: ['Developer', 'AI/ML'],
      rating: 4.6,
      reviews: 945,
      downloads: '67K',
      pricing: 'Free',
      author: 'CodeCraft',
      authorAvatar: '/api/placeholder/32/32'
    },
    {
      id: 6,
      name: 'Password Shield Pro',
      description: 'Advanced password management with biometric authentication.',
      tags: ['Security'],
      rating: 4.8,
      reviews: 3241,
      downloads: '289K',
      pricing: '$3.99',
      author: 'SecureFlow',
      authorAvatar: '/api/placeholder/32/32',
      badge: 'Trending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Extensions</h1>
        
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-50 text-left group"
            >
              <span className="text-gray-700 group-hover:text-gray-900">{category.name}</span>
              <span className="text-sm text-gray-500">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search extensions..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-gray-700">Filters</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-6 mb-8">
          {[
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'new', label: 'New', icon: Clock },
            { id: 'popular', label: 'Most Popular', icon: Heart }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 pb-2 border-b-2 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Extensions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {extensions.map((extension) => (
            <div
              key={extension.id}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={extension.authorAvatar}
                    alt={extension.author}
                    className="w-10 h-10 rounded-lg mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{extension.name}</h3>
                    <p className="text-sm text-gray-500">{extension.author}</p>
                  </div>
                </div>
                {extension.badge && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                    {extension.badge}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{extension.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {extension.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-700">{extension.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({extension.reviews})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Download className="w-4 h-4 mr-1" />
                    {extension.downloads}
                  </div>
                </div>

                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                  {extension.pricing === 'Free' ? 'Install' : extension.pricing}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtensionMarketplace;