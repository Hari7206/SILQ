import SellerProducts from "../pages/SellerProducts";
import EditProduct from "../pages/EditProduct";
import CreateProduct from "../pages/CreateProduct";


const productRoutes = [
  { path: "products", element: <SellerProducts /> },
  { path: "products/create", element: <CreateProduct /> },
  { path: "products/edit/:id", element: <EditProduct /> },
];

export default productRoutes;