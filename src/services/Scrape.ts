import * as puppeteer from 'puppeteer'

export class ScrapeService {
	public async scrapeBuyPage(link = 'https://kodit.io/en/apartments-for-sale') {
		const browser = await puppeteer.launch({headless: true})
		try {
			const page = await browser.newPage()
			await page.goto(`${link}`, {waitUntil: 'networkidle0'})
			const countryLinks = await page.evaluate(() => {
				const elements = Array.from(document.querySelectorAll('a.City-Link--Country')) as HTMLAnchorElement[]
				return elements.map(el => el.href)
			})
			console.log(countryLinks)
			const res = await Promise.all(countryLinks.map(async countryLink => {
				const newPage = await browser.newPage()
				await newPage.goto(countryLink), {waitUntil: 'networkidle0'}
				const apartmentLinks = await page.evaluate(() => {
					const elements = Array.from(document.querySelectorAll('a.Apartment-Card')) as HTMLAnchorElement[]
					return elements.map(el => el.href)
				})
				console.log(apartmentLinks)
				const allApartmentsInfo = await Promise.all(apartmentLinks.map(async apartmentLink => {
					const apartmentPage = await browser.newPage()
					await apartmentPage.goto(apartmentLink, {waitUntil: 'networkidle0'})
					const apartmentInfo = await page.evaluate(() => {
						const streetAddress = document.querySelector('h1.Place-Header').innerHTML
						const description = document.querySelector('h1.Place-Header').innerHTML
						const builtYear = document.querySelector('ul.apartmentHighlights > li:nth-child(3)').innerHTML
						const sizeSqm = document.querySelector('p.Place-Rooms').innerHTML
						const balcony = document.querySelector('ul.apartmentHighlights > li:nth-child(2)').innerHTML
						const roomCount = document.querySelector('p.Place-Rooms').innerHTML
						const priceSqm = document.querySelector('h2.Place-Price').innerHTML
						return {
							streetAddress,
							description,
							builtYear,
							sizeSqm,
							balcony,
							roomCount,
							priceSqm,
						}
					})
					await apartmentPage.close()
					return apartmentInfo
				}))
				await newPage.close()
				return allApartmentsInfo
			}))
			return res
		} catch (e) {
			throw e
		} finally {
			await browser.close()
		}

	}
}
