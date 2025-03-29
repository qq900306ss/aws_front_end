import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { cartAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      cartAPI.addToCart(product, 1);
      toast.success(`已加入購物車: ${product.name}`);
      
      // 觸發自定義事件，通知 Navbar 更新購物車數量
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      toast.error('加入購物車失敗');
      console.error('Error adding to cart:', error);
    }
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      toast.success(`已加入收藏: ${product.name}`);
    } else {
      toast.success(`已移除收藏: ${product.name}`);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div 
        className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 w-full overflow-hidden">
          {product.image ? (
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className={`transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">無圖片</span>
            </div>
          )}
          
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
            } transition-colors duration-300 shadow-md`}
          >
            <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
          </button>
          
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              特價
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          
          <div className="flex items-center justify-between">
            <div>
              {product.discount ? (
                <div className="flex items-center">
                  <span className="text-red-500 font-bold">NT$ {product.price}</span>
                  <span className="text-gray-400 text-sm line-through ml-2">NT$ {product.originalPrice}</span>
                </div>
              ) : (
                <span className="text-gray-700 font-bold">NT$ {product.price}</span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
          
          <div className="mt-2 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </div>
        </div>
      </div>
    </Link>
  );
}
