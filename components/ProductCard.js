import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProductCard({ product }) {
  const { id, name, price, originalPrice, description, image, image_url, category } = product;
  const isDiscounted = originalPrice && originalPrice > price;
  const { addItem, getItemQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  // 使用 image_url 屬性，確保至少有一個有效的圖片 URL
  const imageSource = image_url || 'https://via.placeholder.com/400x400?text=No+Image';
  
  // 獲取商品在購物車中的數量
  const quantityInCart = getItemQuantity(id);
  
  // 處理添加到購物車
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsLoading(true);
      await addItem(id, 1);
    } catch (error) {
      console.error('添加到購物車失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <Link href={`/products/${id}`}>
          <div className="relative h-64 w-full">
            {/* 使用原生 img 標籤而不是 Next.js Image 組件 */}
            <img
              src={imageSource}
              alt={name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder.jpg';
              }}
            />
            {isDiscounted && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                特價
              </div>
            )}
            {quantityInCart > 0 && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                購物車: {quantityInCart}
              </div>
            )}
          </div>
        </Link>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          <Link href={`/products/${id}`} className="hover:text-blue-600">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center">
          {isDiscounted ? (
            <>
              <span className="text-lg font-bold text-red-600">NT${price}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">NT${originalPrice}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">NT${price}</span>
          )}
        </div>
        {category && (
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
        )}
        <div className="mt-3">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </>
            ) : (
              <>加入購物車</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
