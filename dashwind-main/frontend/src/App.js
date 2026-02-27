import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import DashboardPage from "@/pages/DashboardPage";
import AccountSettingsPage from "@/pages/AccountSettingsPage";
import TablesPage from "@/pages/TablesPage";
import AuthenticationPage from "@/pages/AuthenticationPage";
import ComponentsPage from "@/pages/ComponentsPage";
import InvoiceFormPage from "@/pages/InvoiceFormPage";
import InvoicePage from "@/pages/InvoicePage";
import InvoicePrintPage from "@/pages/InvoicePrintPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/auth" element={<AuthenticationPage />} />
          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/signin" element={<AuthenticationPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/invoice/create" element={<InvoiceFormPage />} />
          <Route path="/invoice/:invoiceId" element={<InvoicePage />} />
          <Route path="/invoice/:invoiceId/print" element={<InvoicePrintPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
