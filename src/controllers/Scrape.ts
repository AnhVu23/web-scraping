import {Get, JsonController} from 'routing-controllers'
import {ExternalApiService} from '../services/ExternalApi'
import {ScrapeService} from '../services/Scrape'
import {IAnalyzedTransactionScrape, ITransactionScrape} from '../interfaces/ITransactionScrape'
import {IAnalyzedTransaction, ITransaction} from '../interfaces/ITransaction'
import {IComparisonInfo} from '../interfaces/IComparisonInfo'

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
			const [scrapeData, thirdPartyTransactions] = await Promise.all([this.ScrapeService.scrapeBuyPage(), this.ExternalApiService.gettingTransactions()])
			return this.populateScrapeData(scrapeData, thirdPartyTransactions)
		} catch (e) {
			throw e
		}
	}

	private populateScrapeData(scrapeData: ITransactionScrape[], transactions: ITransaction[]): IAnalyzedTransactionScrape[] {
		return scrapeData.map(item => {
			item.data = item.data.map(itemTrans => {
				const analyzedTrans = {...itemTrans} as IAnalyzedTransaction
				this.populateDataToObject(analyzedTrans, ['same_street_trans'], transactions, analyzedTrans, ['street'])
				this.populateDataToObject(analyzedTrans, ['same_street_and_room_trans', 'same_street_and_room_avg_diff'], transactions, analyzedTrans, ['street', 'room_count'])
				this.populateDataToObject(analyzedTrans, ['same_street_and_room_and_built_year_trans', 'same_street_and_room_and_built_year_avg_diff'], transactions, analyzedTrans, ['street', 'room_count', 'built_year'])
				this.populateDataToObject(analyzedTrans, ['same_street_and_room_and_balcony_trans', 'same_street_and_room_and_balcony_avg_diff'], transactions, analyzedTrans, ['street', 'room_count', 'balcony'])
				this.populateDataToObject(analyzedTrans, ['same_address_trans', 'same_address_avg_diff'], transactions, analyzedTrans,  ['street', 'street_number'])
				this.populateDataToObject(analyzedTrans, ['same_address_and_room_trans', 'same_address_and_room_avg_diff'], transactions, analyzedTrans,  ['street', 'street_number', 'room_count'])
				this.populateDataToObject(analyzedTrans, ['same_address_and_room_and_built_year_trans', 'same_address_and_room_and_built_year_avg_diff'], transactions, analyzedTrans,  ['street', 'street_number', 'room_count', 'built_year'])
				this.populateDataToObject(analyzedTrans, ['same_address_and_room_and_balcony_trans', 'same_address_and_room_and_balcony_avg_diff'], transactions, analyzedTrans,  ['street', 'street_number', 'room_count', 'balcony'])
				return analyzedTrans
			})
			return item
		})
	}

	private populateDataToObject(trans: ITransaction, populatedKey: string[], data: ITransaction[], compared: ITransaction, keys: string[]) {
		const comparedInfo = this.getComparisonInfo(data, compared, keys)
		populatedKey.forEach((key, index) => {
			// Populate data to current object
			trans[key] = comparedInfo[Object.keys(comparedInfo)[index]]
		})
	}

	private getComparisonInfo(data: ITransaction[], compared: ITransaction, keys: string[]): IComparisonInfo {
		// Filter transactions
		const sameTrans = data.filter(item => {
			return keys.every(key => {
				return compared[key] === item[key]
			})
		})
		// Calculate avg price
		const avgPrice = this.calculateAveragePrice(sameTrans)
		const avgDiff = this.calculateAvgDiff(sameTrans, compared.price_sqm, avgPrice)
		return {
			length: sameTrans.length,
			avg_diff: avgDiff,
		}
	}

	private calculateAveragePrice(array: ITransaction[]): number {
		return array.length > 0 ? array.reduce((totalPrice, trans) => {
			return totalPrice + trans.price_sqm
		}, 0) / array.length : 0
	}

	private calculateAvgDiff(array: ITransaction[], comparedPrice: number, avgPrice: number): number {
		return array.length > 0 ? Number(((comparedPrice - avgPrice) / avgPrice * 100).toFixed(2)) : 0
	}
}
