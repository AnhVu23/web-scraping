export interface ITransaction {
  street: string
  street_number: number
  description: string
  size_sqm: number
  balcony: number
  room_count: number
  built_year: number
  price_sqm: number
}

export interface IAnalyzedTransaction extends ITransaction {
  same_street_trans?: number,
  same_street_and_room_trans?: number,
  same_street_and_room_and_built_year_trans?: number,
	same_street_and_room_and_balcony_trans?: number,
  same_address_trans?: number,
	same_address_and_room_trans?: number,
	same_address_and_room_and_built_year_trans?: number,
	same_address_and_room_and_balcony_trans?: number,
	same_street_and_room_avg_diff?: number,
	same_street_and_room_and_built_year_avg_diff?: number,
	same_street_and_room_and_balcony_trans_avg_diff?: number,
	same_address_and_room_avg_diff?: number,
	same_address_and_room_and_built_year_avg_diff?: number,
	same_address_and_room_and_balcony_avg_diff?: number,
}
