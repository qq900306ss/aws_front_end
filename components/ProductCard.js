import Link from 'next/link';

export default function ProductCard({ product }) {
  const { id, name, price, originalPrice, description, image, image_url, category } = product;
  const isDiscounted = originalPrice && originalPrice > price;
  
  // 使用 image_url 或 image 屬性，確保至少有一個有效的圖片 URL
  const imageSource = image_url || image || 'https://via.placeholder.com/400x400?text=No+Image';

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
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors">
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}
