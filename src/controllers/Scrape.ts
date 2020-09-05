import { Get, JsonController } from 'routing-controllers'
import { ExternalApiService } from '../services/ExternalApi'
import {ScrapeService} from '../services/Scrape'

@JsonController('/scrape')
export class ScrapeController {
  private ExternalApiService: ExternalApiService
  private ScrapeService: ScrapeService
  constructor() {
    this.ExternalApiService = new ExternalApiService()
    this.ScrapeService = new ScrapeService()
  }

  @Get('/buy')
  public async scrapingBuyPage() {
    try {
      return await this.ScrapeService.scrapeBuyPage()
      return this.ExternalApiService.gettingTransactions()
    } catch (e) {
      throw e
    }
  }
}
