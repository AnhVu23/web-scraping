/**
 *
 * External Api Service
 *
 * @author Anh Vu <vu.haianh291@gmail.com>
 *
 * @copyright Anh Vu
 */
import fetch from 'node-fetch'
import { ITransaction } from '../interfaces/ITransaction'

export class ExternalApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://cc677kr6sc.execute-api.eu-central-1.amazonaws.com'
  }

  public async gettingTransactions(): Promise<ITransaction[]> {
    const transactionRes = await fetch(`${this.baseUrl}/data`, {
      method: 'POST',
      body: JSON.stringify({
        who_rules: 'kodit.io',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return transactionRes.json()
  }
}
