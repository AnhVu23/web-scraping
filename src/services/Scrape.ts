import * as cheerio from 'cheerio'
import * as fetch from 'node-fetch'
import {ITransactionScrape} from '../interfaces/ITransactionScrape'

export class ScrapeService {
	public async scrapeBuyPage(baseUrl = 'https://kodit.io', link = 'https://kodit.io/en/apartments-for-sale'): Promise<ITransactionScrape[]> {
		const htmlResponse = await fetch(link)
		const rawHtml = await htmlResponse.text()
		const $ = cheerio.load(rawHtml)
		const countryLinks = $('div.City-List').find('a.City-Link--Country').toArray().map(node => {
			return {
				text: $(node).text(),
				url: `${baseUrl}${$(node).attr('href')}`
			}
		})
		return Promise.all(countryLinks.map(async countryLink => {
			const countryHtmlResponse = await fetch(countryLink.url)
			const rawCountryHtml = await countryHtmlResponse.text()
			const page$ = cheerio.load(rawCountryHtml)
			const apartmentLinks = page$('div.Grid').find('a.Apartment-Card').toArray().map(node => {
				return `${baseUrl}${page$(node).attr('href')}`
			})
			const data = await Promise.all(apartmentLinks.map(async apartmentLink => {
				const htmlApartmentResponse = await fetch(apartmentLink)
				const rawApartmentHtml = await htmlApartmentResponse.text()
				const apartment$ = cheerio.load(rawApartmentHtml)
				const streetAddress = apartment$('h1.Place-Heading').text().split(' ')
				const street = streetAddress[0]
				const streetNumber = !isNaN(Number(streetAddress[1])) ? Number(streetAddress[1]) : -1
				const description = apartment$('p.Place-Details').text()
				const builtYear = apartment$('ul.apartmentHighlights > li:nth-child(3)').text().includes('Built') ? apartment$('ul.apartmentHighlights > li:nth-child(3)').text() : apartment$('ul.apartmentHighlights > li:nth-child(2)').text()
				const placeRooms = apartment$('p.Place-Rooms').text().split(' ')
				const sizeSqm = Number(placeRooms[0])
				const balcony = apartment$('ul.apartmentHighlights > li:nth-child(2)').text().includes('Balcony') ? 1 : 0
				const roomCount = Number(placeRooms[3])
				const priceSqm = Number(apartment$('h2.Place-Price', 'div.Price-Card__Price-Data').text().split('€')[1].trim().split(' ').join('')) / sizeSqm
				return {
					street,
					street_number: streetNumber,
					description,
					built_year: builtYear,
					size_sqm: sizeSqm,
					balcony,
					room_count: roomCount,
					price_sqm: priceSqm,
				}
			}))
			return {
				country: countryLink.text,
				data,
			}
		}))
	}
}
