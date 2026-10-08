import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="flex-1">
        <AppRoutes />
      </div>

      <Footer />
    </div>
  );
};

export default App;