const { getJson } = require('serpapi');
const websiteAnalyzer = require('./websiteAnalyzer');

class BusinessService {
  constructor() {
    this.apiKey = process.env.SERPAPI_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  SERPAPI_KEY não configurada');
    }
  }

  async searchBusinesses({ region, niche, hasWebsite, hasFacebook, hasInstagram, hasIfood, limit = 20 }) {
    try {
      // Buscar negócios usando SerpAPI Google Maps
      const query = `${niche} ${region}`;
      
      console.log(`📍 Buscando: "${query}"`);

      const response = await getJson({
        engine: "google_maps",
        q: query,
        hl: "pt",
        gl: "br",
        api_key: this.apiKey
      });

      if (!response.local_results) {
        console.log('❌ Nenhum resultado encontrado');
        return [];
      }

      let businesses = response.local_results.slice(0, limit);

      // Processar cada negócio
      const processedBusinesses = await Promise.all(
        businesses.map(async (place) => {
          const business = {
            id: place.place_id || place.data_id || Math.random().toString(36),
            name: place.title,
            address: place.address,
            rating: place.rating || 0,
            totalRatings: place.reviews || 0,
            types: place.type ? [place.type] : [],
            priceLevel: place.price,
            website: null,
            hasWebsite: false,
            websiteStatus: 'unknown',
            phone: place.phone,
            openingHours: place.hours,
            position: place.position,
            // Redes sociais e plataformas
            socialMedia: {
              facebook: null,
              instagram: null,
              ifood: null
            },
            hasSocialMedia: false
          };

          // Verificar se tem website diretamente
          if (place.website) {
            business.website = place.website;
            business.hasWebsite = true;
            console.log(`✅ Website encontrado para ${place.title}: ${business.website}`);
            
            // Analisar website se disponível
            try {
              const websiteInfo = await websiteAnalyzer.analyzeWebsite(business.website);
              business.websiteStatus = websiteInfo.isUpdated ? 'updated' : 'outdated';
              business.websiteInfo = websiteInfo;
            } catch (error) {
              console.log(`⚠️  Erro ao analisar website ${business.website}:`, error.message);
              business.websiteStatus = 'error';
            }
          } else {
            console.log(`❌ Nenhum website encontrado para ${place.title}`);
          }

          // Verificar redes sociais e plataformas nos links
          if (place.links) {
            // Verificar todos os links disponíveis
            Object.keys(place.links).forEach(linkType => {
              const url = place.links[linkType];
              if (url && typeof url === 'string') {
                // Detectar Facebook
                if (url.includes('facebook.com') || url.includes('fb.com')) {
                  business.socialMedia.facebook = url;
                  business.hasSocialMedia = true;
                }
                // Detectar Instagram
                if (url.includes('instagram.com') || url.includes('instagr.am')) {
                  business.socialMedia.instagram = url;
                  business.hasSocialMedia = true;
                }
                // Detectar iFood
                if (url.includes('ifood.com.br') || url.includes('ifood.com')) {
                  business.socialMedia.ifood = url;
                  business.hasSocialMedia = true;
                }
              }
            });
          }

          return business;
        })
      );

      // Aplicar filtros
      let filteredBusinesses = processedBusinesses;
      console.log(`🔍 Filtros recebidos:`, { hasWebsite, hasFacebook, hasInstagram, hasIfood });
      
      // Filtrar por website
      if (hasWebsite === true) {
        filteredBusinesses = filteredBusinesses.filter(b => b.hasWebsite);
        console.log(`📊 Filtrado para negócios COM website: ${filteredBusinesses.length}/${processedBusinesses.length}`);
      } else if (hasWebsite === false) {
        filteredBusinesses = filteredBusinesses.filter(b => !b.hasWebsite);
        console.log(`📊 Filtrado para negócios SEM website: ${filteredBusinesses.length}/${processedBusinesses.length}`);
      }

      // Filtrar por Facebook
      if (hasFacebook === true) {
        filteredBusinesses = filteredBusinesses.filter(b => b.socialMedia.facebook);
        console.log(`📊 Filtrado para negócios COM Facebook: ${filteredBusinesses.length} negócios`);
      } else if (hasFacebook === false) {
        filteredBusinesses = filteredBusinesses.filter(b => !b.socialMedia.facebook);
        console.log(`📊 Filtrado para negócios SEM Facebook: ${filteredBusinesses.length} negócios`);
      }

      // Filtrar por Instagram
      if (hasInstagram === true) {
        filteredBusinesses = filteredBusinesses.filter(b => b.socialMedia.instagram);
        console.log(`📊 Filtrado para negócios COM Instagram: ${filteredBusinesses.length} negócios`);
      } else if (hasInstagram === false) {
        filteredBusinesses = filteredBusinesses.filter(b => !b.socialMedia.instagram);
        console.log(`📊 Filtrado para negócios SEM Instagram: ${filteredBusinesses.length} negócios`);
      }

      // Filtrar por iFood
      if (hasIfood === true) {
        filteredBusinesses = filteredBusinesses.filter(b => b.socialMedia.ifood);
        console.log(`📊 Filtrado para negócios COM iFood: ${filteredBusinesses.length} negócios`);
      } else if (hasIfood === false) {
        filteredBusinesses = filteredBusinesses.filter(b => !b.socialMedia.ifood);
        console.log(`📊 Filtrado para negócios SEM iFood: ${filteredBusinesses.length} negócios`);
      }

      console.log(`✅ Encontrados ${filteredBusinesses.length} negócios`);
      return filteredBusinesses;

    } catch (error) {
      console.error('❌ Erro na busca:', error);
      throw new Error(`Erro ao buscar negócios: ${error.message}`);
    }
  }

  async getBusinessDetails(placeId) {
    try {
      console.log(`🔍 Buscando detalhes para: ${placeId}`);

      // Buscar detalhes usando SerpAPI
      const response = await getJson({
        engine: "google_maps",
        data_id: placeId,
        hl: "pt",
        gl: "br",
        api_key: this.apiKey
      });

      if (!response.place_info) {
        throw new Error('Negócio não encontrado');
      }

      const place = response.place_info;
      
      const business = {
        id: placeId,
        name: place.title,
        address: place.address,
        rating: place.rating || 0,
        totalRatings: place.reviews || 0,
        types: place.type ? [place.type] : [],
        phone: place.phone,
        website: place.website,
        hasWebsite: !!place.website,
        websiteStatus: 'unknown',
        openingHours: place.hours,
        photos: place.photos || [],
        reviews: response.reviews || []
      };

      // Analisar website se disponível
      if (business.website) {
        try {
          const websiteInfo = await websiteAnalyzer.analyzeWebsite(business.website);
          business.websiteStatus = websiteInfo.isUpdated ? 'updated' : 'outdated';
          business.websiteInfo = websiteInfo;
        } catch (error) {
          console.log(`⚠️  Erro ao analisar website:`, error.message);
          business.websiteStatus = 'error';
        }
      }

      console.log(`✅ Detalhes obtidos para: ${business.name}`);
      return business;

    } catch (error) {
      console.error('❌ Erro ao obter detalhes:', error);
      throw new Error(`Erro ao obter detalhes do negócio: ${error.message}`);
    }
  }
}

module.exports = new BusinessService();