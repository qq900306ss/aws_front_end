import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { Search, Filter } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取商品數據
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Fetched products:', data);
        
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('無法載入商品，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 處理搜尋、分類和排序
  useEffect(() => {
    if (products.length === 0) return;
    
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
        (product.description && product.description.toLowerCase().includes(term))
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

  // 獲取所有可用的分類
  const categories = products.length > 0
    ? ['all', ...new Set(products.map(product => product.category).filter(Boolean))]
    : ['all'];

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
            <h1 className="text-3xl font-bold text-gray-900">商品列表</h1>
            <p className="mt-2 text-gray-600">瀏覽我們的各種新鮮海鮮產品</p>
          </div>

          {/* 搜尋和過濾區塊 */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜尋商品..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  過濾選項
                </button>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="default">預設排序</option>
                  <option value="price-asc">價格：低到高</option>
                  <option value="price-desc">價格：高到低</option>
                  <option value="name-asc">名稱：A 到 Z</option>
                  <option value="name-desc">名稱：Z 到 A</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">商品分類</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        activeCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? '全部' : category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 商品列表 */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">沒有找到符合條件的商品</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
