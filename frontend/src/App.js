import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import BusinessList from './components/BusinessList';
import LoadingSpinner from './components/LoadingSpinner';
import { Search, MapPin, Globe } from 'lucide-react';

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (searchData) => {
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const response = await fetch('/api/business/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const result = await response.json();
      
      if (result.success) {
        setBusinesses(result.data);
      } else {
        console.error('Erro na busca:', result.error);
        alert('Erro ao buscar negócios: ' + result.error);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Finder</h1>
              <p className="text-sm text-gray-600">Encontre negócios por região e nicho</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Buscar Negócios</h2>
          </div>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Section */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <LoadingSpinner />
          </div>
        )}

        {!loading && searchPerformed && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Resultados da Busca
                  </h2>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {businesses.length} negócios encontrados
                </span>
              </div>
            </div>
            <BusinessList businesses={businesses} />
          </div>
        )}

        {!loading && !searchPerformed && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Pronto para encontrar negócios?
            </h3>
            <p className="text-gray-600">
              Use o formulário acima para buscar negócios por região e nicho
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;