import {IAnalyzedTransaction, ITransaction} from './ITransaction'

export interface ITransactionScrape {
	data?: ITransaction[],
	country?: string
}

export interface IAnalyzedTransactionScrape {
	data?: IAnalyzedTransaction[],
	country?: string,
}
