import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';

let ip_addresses = [];
let port_numbers = [];
function proxyGenerator() {
  let proxy;

  request('https://sslproxies.org/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      $('td:nth-child(1)').each(function (index, value) {
        ip_addresses[index] = $(this).text();
      });

      $('td:nth-child(2)').each(function (index, value) {
        port_numbers[index] = $(this).text();
      });

      try {
        fs.writeFileSync('./data/ports.txt', port_numbers.join('\n'));
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Error loading proxy, please try again');
    }
  });
}

proxyGenerator();
