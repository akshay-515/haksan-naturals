import { useEffect } from "react";
import { apiClient } from "./api/Client";
import { Navbar } from "./components/layout/Navbar";
import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  useEffect(() => {
    const testBackend = async () => {
      const response = await apiClient.get("/api/products");

      console.log("Backend response:", response.data);
    };

    testBackend();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <AppRoutes />
    </div>
  );
};

export default App;