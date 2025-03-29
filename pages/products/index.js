import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { Search, Filter } from 'lucide-react';

// 模擬更多產品資料
const mockProducts = [
  {
    id: '1',
    name: '新鮮蚵仔',
    price: 299,
    description: '來自台灣東部的優質蚵仔，鮮美多汁，適合各種料理方式。',
    image: 'https://images.unsplash.com/photo-1635146037526-e21e379df5b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '蚵仔'
  },
  {
    id: '2',
    name: '極品大蚵',
    price: 499,
    originalPrice: 599,
    discount: true,
    description: '特大號蚵仔，肉質飽滿，鮮甜可口，是高級料理的首選。',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '蚵仔'
  },
  {
    id: '3',
    name: '鮮蝦組合',
    price: 399,
    description: '精選各種新鮮蝦類，包括草蝦、白蝦等，適合多種烹飪方式。',
    image: 'https://images.unsplash.com/photo-1565680018160-64827b3608ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '蝦類'
  },
  {
    id: '4',
    name: '鮮活螃蟹',
    price: 599,
    originalPrice: 699,
    discount: true,
    description: '當季捕撈的新鮮螃蟹，肉質鮮美，適合清蒸或其他烹飪方式。',
    image: 'https://images.unsplash.com/photo-1550747545-c896b5f89ff7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '螃蟹'
  },
  {
    id: '5',
    name: '特選生蠔',
    price: 799,
    description: '進口特選生蠔，口感鮮美，適合生食或烹調。',
    image: 'https://images.unsplash.com/photo-1466553556096-7e2c4ca157cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '蚵仔'
  },
  {
    id: '6',
    name: '龍蝦',
    price: 1299,
    originalPrice: 1499,
    discount: true,
    description: '新鮮捕撈的龍蝦，肉質鮮甜，是高級餐廳的必備食材。',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '龍蝦'
  },
  {
    id: '7',
    name: '鮭魚片',
    price: 499,
    description: '新鮮鮭魚片，富含營養，適合生食或烹調。',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '魚類'
  },
  {
    id: '8',
    name: '鮪魚生魚片',
    price: 599,
    description: '頂級鮪魚生魚片，口感鮮美，適合生食。',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: '魚類'
  }
];

// 產品分類
const categories = [
  { id: 'all', name: '全部商品' },
  { id: '蚵仔', name: '蚵仔' },
  { id: '蝦類', name: '蝦類' },
  { id: '螃蟹', name: '螃蟹' },
  { id: '龍蝦', name: '龍蝦' },
  { id: '魚類', name: '魚類' }
];

export default function Products() {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  // 處理搜尋、分類和排序
  useEffect(() => {
    let result = [...products];
    
    // 分類過濾
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // 搜尋過濾
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
      );
    }
    
    // 排序
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // 預設排序，不做任何操作
        break;
    }
    
    setFilteredProducts(result);
  }, [products, activeCategory, searchTerm, sortOption]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>商品列表 -  海鮮專賣</title>
        <meta name="description" content="瀏覽  海鮮專賣的各種新鮮海鮮產品，包括蚵仔、蝦類、螃蟹等" />
      </Head>

      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">海鮮商品列表</h1>
            <p className="mt-2 text-lg text-gray-600">瀏覽我們的各種新鮮海鮮產品</p>
          </div>
          
          {/* 搜尋和過濾區 */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜尋商品..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">預設排序</option>
                  <option value="price-asc">價格：低至高</option>
                  <option value="price-desc">價格：高至低</option>
                  <option value="name-asc">名稱：A 到 Z</option>
                  <option value="name-desc">名稱：Z 到 A</option>
                </select>
                
                <button
                  className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} className="mr-2" />
                  過濾
                </button>
              </div>
            </div>
            
            {/* 行動裝置過濾選項 */}
            {showFilters && (
              <div className="mt-4 md:hidden">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* 桌面版分類側邊欄 */}
            <div className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-sm h-fit">
              <h3 className="font-medium text-gray-900 mb-4">商品分類</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 產品列表 */}
            <div className="flex-grow">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 text-lg">沒有找到符合條件的商品</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
