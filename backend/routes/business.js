const express = require('express');
const router = express.Router();
const businessService = require('../services/businessService');

// Buscar negócios por região e nicho
router.post('/search', async (req, res) => {
  try {
    const { region, niche, hasWebsite, hasFacebook, hasInstagram, hasIfood, limit = 20 } = req.body;

    if (!region || !niche) {
      return res.status(400).json({
        error: 'Região e nicho são obrigatórios'
      });
    }

    console.log(`🔍 Buscando negócios: ${niche} em ${region}`, {
      hasWebsite, hasFacebook, hasInstagram, hasIfood
    });

    const businesses = await businessService.searchBusinesses({
      region,
      niche,
      hasWebsite,
      hasFacebook,
      hasInstagram,
      hasIfood,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      count: businesses.length,
      data: businesses
    });

  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Obter detalhes de um negócio específico
router.get('/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const business = await businessService.getBusinessDetails(placeId);
    
    res.json({
      success: true,
      data: business
    });

  } catch (error) {
    console.error('Erro ao obter detalhes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

module.exports = router;