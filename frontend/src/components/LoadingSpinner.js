import React from 'react';
import { Search, MapPin, Globe } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center space-x-4 mb-6">
        <div className="animate-bounce">
          <Search className="h-8 w-8 text-blue-500" />
        </div>
        <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>
          <MapPin className="h-8 w-8 text-green-500" />
        </div>
        <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
          <Globe className="h-8 w-8 text-purple-500" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Buscando negócios...
      </h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>🔍 Consultando Google Places API</p>
        <p>🌐 Analisando websites encontrados</p>
        <p>📊 Organizando resultados</p>
      </div>
      
      <div className="mt-6">
        <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Este processo pode levar alguns segundos...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;