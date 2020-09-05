import { Get, JsonController } from 'routing-controllers'
import { ExternalApiService } from '../services/ExternalApi'

@JsonController('/scrape')
export class ScrapeController {
  private ExternalApiService: ExternalApiService
  constructor() {
    this.ExternalApiService = new ExternalApiService()
  }

  @Get('/buy')
  public async scrapingBuyPage() {
    try {
      return this.ExternalApiService.gettingTransactions()
    } catch (e) {
      throw e
    }
  }
}
