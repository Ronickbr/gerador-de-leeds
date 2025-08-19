const puppeteer = require('puppeteer');
const axios = require('axios');

class WebsiteAnalyzer {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  async analyzeWebsite(url) {
    try {
      console.log(`🌐 Analisando website: ${url}`);

      // Primeiro, verificar se o site responde
      const basicCheck = await this.checkWebsiteBasic(url);
      if (!basicCheck.accessible) {
        return {
          status: 'inaccessible',
          accessible: false,
          error: basicCheck.error,
          url
        };
      }

      // Análise detalhada com Puppeteer
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        await page.goto(url, { 
          waitUntil: 'networkidle2', 
          timeout: 10000 
        });

        // Extrair informações da página
        const pageInfo = await page.evaluate(() => {
          const title = document.title || '';
          const description = document.querySelector('meta[name="description"]')?.content || '';
          const lastModified = document.lastModified || '';
          const hasContactForm = !!document.querySelector('form[action*="contact"], form[action*="contato"], input[type="email"]');
          const hasPhone = !!document.querySelector('a[href^="tel:"], .phone, .telefone');
          const hasWhatsApp = !!document.querySelector('a[href*="whatsapp"], a[href*="wa.me"]');
          
          // Verificar se parece desatualizado
          const currentYear = new Date().getFullYear();
          const hasCurrentYear = document.body.innerHTML.includes(currentYear.toString());
          const hasOldYear = document.body.innerHTML.includes((currentYear - 1).toString()) || 
                           document.body.innerHTML.includes((currentYear - 2).toString());

          return {
            title,
            description,
            lastModified,
            hasContactForm,
            hasPhone,
            hasWhatsApp,
            hasCurrentYear,
            hasOldYear,
            bodyLength: document.body.innerHTML.length
          };
        });

        await page.close();

        // Determinar status do website
        let status = 'updated';
        
        if (pageInfo.bodyLength < 1000) {
          status = 'outdated';
        } else if (!pageInfo.hasCurrentYear && pageInfo.hasOldYear) {
          status = 'outdated';
        } else if (pageInfo.title.toLowerCase().includes('em construção') || 
                   pageInfo.title.toLowerCase().includes('coming soon')) {
          status = 'under_construction';
        }

        return {
          status,
          accessible: true,
          url,
          title: pageInfo.title,
          description: pageInfo.description,
          lastModified: pageInfo.lastModified,
          features: {
            hasContactForm: pageInfo.hasContactForm,
            hasPhone: pageInfo.hasPhone,
            hasWhatsApp: pageInfo.hasWhatsApp
          },
          analysis: {
            hasCurrentYear: pageInfo.hasCurrentYear,
            bodyLength: pageInfo.bodyLength
          }
        };

      } catch (error) {
        await page.close();
        throw error;
      }

    } catch (error) {
      console.warn(`Erro ao analisar ${url}:`, error.message);
      return {
        status: 'error',
        accessible: false,
        error: error.message,
        url
      };
    }
  }

  async checkWebsiteBasic(url) {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return {
        accessible: response.status === 200,
        statusCode: response.status
      };

    } catch (error) {
      return {
        accessible: false,
        error: error.message,
        statusCode: error.response?.status || 0
      };
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = new WebsiteAnalyzer();