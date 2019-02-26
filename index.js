'use strict';

const puppeteer = require('puppeteer');
 
const run = async () => {
    const browser = await puppeteer.launch({ headless: false });
 
    const page = await browser.newPage();
 
    await page.goto(
        'https://kotlinlang.org/docs/books.html',
        { waitUntil: 'domcontentloaded' },
        { waitUntil: 'load' }
    );
 
    const booksHandler = await page.evaluate(() => {
        const pageContentElement = document.querySelector('.page-content');
        const titles = Array.from(pageContentElement.getElementsByTagName('h2')).map(el => el.innerHTML);
        const language = Array.from(pageContentElement.getElementsByClassName('book-lang')).map(el => el.innerHTML);
        const descriptions = Array.from(pageContentElement.getElementsByTagName('p')).map(el => el.innerHTML.replace(/<[^>]*>/gim, '').replace(/\s+/gim, ' '));
        const firstDescription = descriptions.slice(0, 3).reduce((acc, cur) => acc + cur, '');
        const links = [...new Set(Array.from(pageContentElement.getElementsByTagName('a')).map(el => el.href))];
 
        descriptions.shift();
        descriptions.shift();
        descriptions.shift();
        descriptions.unshift(firstDescription);
 
        links.shift();
 
        const books = titles.map((el, index) => {
            return ({
                title: el,
                description: descriptions[index],
                isbn: '',
                language: language[index]
            })
        });
 
        const numberBooks = titles.length;
 
        return { numberBooks, books, links };
    });
 
    const isbnArray = [];
 
    for (let index = 0; index < booksHandler.links.length; index++) {
        const bookURL = booksHandler.links[index];
 
        await page.goto(
            bookURL,
            { waitUntil: 'domcontentloaded' },
            { waitUntil: 'load' }
        )
 
        const isbn = await page.evaluate(bookURL => {
            if (bookURL.startsWith('https://www.amazon')) {
                return document.querySelector('.content').getElementsByTagName('li')[4]
                    .textContent.slice(9).replace(/\D+/g, '').trim() ||
                    document.querySelector('.content').getElementsByTagName('li')[5]
                        .textContent.slice(5).trim();
            };
            if (bookURL.startsWith('https://www.packtpub')) {
                const spanElements = document.querySelector('.book-info-isbn13 > span[itemprop="isbn"]');
                return spanElements.length > 1
                    ? spanElements[0].textContent
                    : spanElements.textContent;
 
            }
            if (bookURL.endsWith('the-joy-of-kotlin')) {
                return document.querySelectorAll('.product-info')[1]
                    .getElementsByTagName('ul')[1].children[0].textContent
                    .replace(/\D+/, '')
                    .trim();
            }
            if (bookURL.startsWith('https://www.manning') || bookURL.startsWith('https://manning.com')) {
                return document.querySelectorAll('.product-info')[1]
                    .getElementsByTagName('ul')[0].children[1].textContent
                    .replace(/\D+/, '')
                    .trim();
            }
            if (bookURL.startsWith('http://www.fundamental')) {
                return document.querySelector('.dark-blue-text').textContent.slice(6).trim();
            }
 
            return '';
        }, bookURL);
 
        isbnArray.push(isbn);
    }
 
    isbnArray.forEach((isbn, index) => {
        booksHandler.books[index].isbn = isbn;
    });
 
    await browser.close();
 
    return console.log({
        numberBooks: booksHandler.numberBooks,
        books: booksHandler.books,
    });
};
 
run();