import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ShopifyCollections from "./pages/ShopifyCollections";
import CollectionsRouter from "./pages/CollectionsRouter";
import ProductDetail from "./pages/ProductDetail";
import ShopifyProductDetail from "./pages/ShopifyProductDetail";
import HipHopJewelry from "./pages/HipHopJewelry";
import PlatinumJewelry from "./pages/PlatinumJewelry";
import RingSizeGuide from "./pages/RingSizeGuide";
import MeetTheDesigner from "./pages/MeetTheDesigner";
import BespokeServices from "./pages/BespokeServices";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReports from "./pages/admin/AdminReports";
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/collections" element={<ShopifyCollections />} />
                <Route path="/collections/:handle" element={<CollectionsRouter />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/shopify-product/:handle" element={<ShopifyProductDetail />} />
                <Route path="/hip-hop-jewelry" element={<HipHopJewelry />} />
                <Route path="/platinum-jewelry" element={<PlatinumJewelry />} />
                <Route path="/ring-size-guide" element={<RingSizeGuide />} />
                <Route path="/meet-the-designer" element={<MeetTheDesigner />} />
                <Route path="/bespoke-services" element={<BespokeServices />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
