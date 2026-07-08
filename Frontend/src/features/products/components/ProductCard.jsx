import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 relative">
        {mainImage ? (
          <img src={mainImage.url} alt={mainImage.alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
        <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price.amount}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        <div className="flex gap-2 mt-3">
          <button onClick={() => navigate(`/seller/products/edit/${product._id}`)} className="flex-1 bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-medium py-1.5 rounded transition text-sm">
            Edit
          </button>
          <button onClick={() => onDelete(product._id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 rounded transition text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;