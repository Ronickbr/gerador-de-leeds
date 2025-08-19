import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Download,
  Facebook,
  Instagram,
  UtensilsCrossed
} from 'lucide-react';

const BusinessList = ({ businesses }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filtrar negócios
  const filteredBusinesses = businesses.filter(business => {
    if (filter === 'all') return true;
    if (filter === 'with-website') return business.hasWebsite;
    if (filter === 'without-website') return !business.hasWebsite;
    if (filter === 'updated') return business.websiteStatus === 'updated';
    if (filter === 'outdated') return business.websiteStatus === 'outdated';
    return true;
  });

  // Ordenar negócios
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'website') return Number(b.hasWebsite) - Number(a.hasWebsite);
    return 0;
  });

  const getWebsiteStatusIcon = (status, hasWebsite) => {
    if (!hasWebsite) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    switch (status) {
      case 'updated':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'outdated':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'inaccessible':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getWebsiteStatusText = (status, hasWebsite) => {
    if (!hasWebsite) return 'Sem website';
    
    switch (status) {
      case 'updated': return 'Website atualizado';
      case 'outdated': return 'Website desatualizado';
      case 'inaccessible': return 'Website inacessível';
      case 'under_construction': return 'Em construção';
      default: return 'Status desconhecido';
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Endereço', 'Telefone', 'Website', 'Status Website', 'Facebook', 'Instagram', 'iFood', 'Avaliação', 'Total Avaliações'];
    const csvContent = [
      headers.join(','),
      ...sortedBusinesses.map(business => [
        `"${business.name}"`,
        `"${business.address}"`,
        `"${business.phone || 'N/A'}"`,
        `"${business.website || 'N/A'}"`,
        `"${getWebsiteStatusText(business.websiteStatus, business.hasWebsite)}"`,
        `"${business.socialMedia?.facebook || 'N/A'}"`,
        `"${business.socialMedia?.instagram || 'N/A'}"`,
        `"${business.socialMedia?.ifood || 'N/A'}"`,
        business.rating || 'N/A',
        business.totalRatings || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `negocios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (businesses.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Nenhum negócio encontrado para os critérios especificados.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros e Controles */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Todos ({businesses.length})</option>
                <option value="with-website">Com website ({businesses.filter(b => b.hasWebsite).length})</option>
                <option value="without-website">Sem website ({businesses.filter(b => !b.hasWebsite).length})</option>
                <option value="updated">Website atualizado ({businesses.filter(b => b.websiteStatus === 'updated').length})</option>
                <option value="outdated">Website desatualizado ({businesses.filter(b => b.websiteStatus === 'outdated').length})</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="name">Nome</option>
                <option value="rating">Avaliação</option>
                <option value="website">Website</option>
              </select>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Lista de Negócios */}
      <div className="divide-y divide-gray-200">
        {sortedBusinesses.map((business, index) => (
          <div key={business.id || index} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              {/* Informações Principais */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {business.phone && (
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{business.phone}</span>
                    </div>
                  )}

                  {business.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{business.rating}</span>
                      <span className="text-gray-500">({business.totalRatings} avaliações)</span>
                    </div>
                  )}
                </div>

                {/* Status do Website */}
                <div className="flex items-center space-x-2">
                  {getWebsiteStatusIcon(business.websiteStatus, business.hasWebsite)}
                  <span className="text-sm font-medium">
                    {getWebsiteStatusText(business.websiteStatus, business.hasWebsite)}
                  </span>
                </div>
              </div>

              {/* Website e Ações */}
              <div className="flex flex-col space-y-2 lg:items-end">
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Visitar website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                {/* Redes Sociais */}
                {business.socialMedia && (
                  <div className="flex flex-col space-y-1">
                    {business.socialMedia.facebook && (
                      <a
                        href={business.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    
                    {business.socialMedia.instagram && (
                      <a
                        href={business.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-pink-600 hover:text-pink-800 text-sm"
                      >
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    
                    {business.socialMedia.ifood && (
                      <a
                        href={business.socialMedia.ifood}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>iFood</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}

                {business.types && business.types.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {business.types.slice(0, 3).map((type, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {type.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className="p-6 bg-gray-50 border-t">
        <p className="text-sm text-gray-600 text-center">
          Exibindo {sortedBusinesses.length} de {businesses.length} negócios encontrados
        </p>
      </div>
    </div>
  );
};

export default BusinessList;