import React, { useState } from 'react';
import { Search, MapPin, Tag, Globe, Filter, Facebook, Instagram, UtensilsCrossed } from 'lucide-react';

const SearchForm = ({ onSearch, loading }) => {
  const [formData, setFormData] = useState({
    region: '',
    niche: '',
    hasWebsite: '',
    hasFacebook: '',
    hasInstagram: '',
    hasIfood: '',
    limit: 20
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.region.trim() || !formData.niche.trim()) {
      alert('Por favor, preencha a região e o nicho');
      return;
    }

    const searchData = {
      region: formData.region.trim(),
      niche: formData.niche.trim(),
      limit: parseInt(formData.limit)
    };

    // Adicionar filtros se especificados
    if (formData.hasWebsite !== '') {
      searchData.hasWebsite = formData.hasWebsite === 'true';
    }
    if (formData.hasFacebook !== '') {
      searchData.hasFacebook = formData.hasFacebook === 'true';
    }
    if (formData.hasInstagram !== '') {
      searchData.hasInstagram = formData.hasInstagram === 'true';
    }
    if (formData.hasIfood !== '') {
      searchData.hasIfood = formData.hasIfood === 'true';
    }

    onSearch(searchData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nicheOptions = [
    'Restaurantes',
    'Bares e Lanchonetes',
    'Salões de Beleza',
    'Academias',
    'Farmácias',
    'Supermercados',
    'Lojas de Roupas',
    'Oficinas Mecânicas',
    'Clínicas Médicas',
    'Dentistas',
    'Advogados',
    'Contadores',
    'Imobiliárias',
    'Pet Shops',
    'Escolas',
    'Hotéis e Pousadas',
    'Agências de Viagem',
    'Floriculturas',
    'Padarias',
    'Pizzarias'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Região */}
        <div>
          <label htmlFor="region" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4" />
            <span>Região *</span>
          </label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="Ex: São Paulo, SP ou Rio de Janeiro, RJ"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Digite a cidade e estado onde deseja buscar
          </p>
        </div>

        {/* Nicho */}
        <div>
          <label htmlFor="niche" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4" />
            <span>Nicho *</span>
          </label>
          <select
            id="niche"
            name="niche"
            value={formData.niche}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione um nicho</option>
            {nicheOptions.map(niche => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Escolha o tipo de negócio que deseja encontrar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Filtro de Website */}
        <div>
          <label htmlFor="hasWebsite" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4" />
            <span>Filtro de Website</span>
          </label>
          <select
            id="hasWebsite"
            name="hasWebsite"
            value={formData.hasWebsite}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os negócios</option>
            <option value="true">Apenas com website</option>
            <option value="false">Apenas sem website</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Filtre negócios pela presença de website
          </p>
        </div>

        {/* Limite de Resultados */}
        <div>
          <label htmlFor="limit" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Filter className="h-4 w-4" />
            <span>Limite de Resultados</span>
          </label>
          <select
            id="limit"
            name="limit"
            value={formData.limit}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="10">10 resultados</option>
            <option value="20">20 resultados</option>
            <option value="50">50 resultados</option>
            <option value="100">100 resultados</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Quantidade máxima de negócios para buscar
          </p>
        </div>
      </div>

      {/* Filtros de Redes Sociais */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filtro de Facebook */}
          <div>
            <label htmlFor="hasFacebook" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </label>
            <select
              id="hasFacebook"
              name="hasFacebook"
              value={formData.hasFacebook}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="true">Com Facebook</option>
              <option value="false">Sem Facebook</option>
            </select>
          </div>

          {/* Filtro de Instagram */}
          <div>
            <label htmlFor="hasInstagram" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </label>
            <select
              id="hasInstagram"
              name="hasInstagram"
              value={formData.hasInstagram}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="true">Com Instagram</option>
              <option value="false">Sem Instagram</option>
            </select>
          </div>

          {/* Filtro de iFood */}
          <div>
            <label htmlFor="hasIfood" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span>iFood</span>
            </label>
            <select
              id="hasIfood"
              name="hasIfood"
              value={formData.hasIfood}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="true">Com iFood</option>
              <option value="false">Sem iFood</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão de Busca */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          <Search className="h-5 w-5" />
          <span>{loading ? 'Buscando...' : 'Buscar Negócios'}</span>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;