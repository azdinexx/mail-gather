// ---------------------------
//      MADE IN CASABLANCA
// ---------------------------

import { createObjectCsvWriter } from 'csv-writer';
import { createObjectFromDomainInfo } from './funcs.js';
import { TxtTOArray } from './funcs.js';
import { csvHeader } from './constants.js';
import whois from 'whois';

// ------------------------
//      GLOBAL VARIABLES
// ------------------------

let tld = {
  ma: 'whois.iam.net.ma',
  com: 'whois.verisign-grs.com',
  ca: 'whois.ca.fury.ca',
};
const CURRENT = 'ca';
let txt_file = `./data/input/ca/1.txt`;
let csv_output_file = `./data/output/${CURRENT}.csv`;
let SERVER = tld[CURRENT];
// let ips = TxtTOArray('./data/ips.txt');
// let ports = TxtTOArray('./data/ports.txt');
// let random_index = Math.floor(Math.random() * ips.length);
// let proxy = `${ips[random_index]}:${ports[random_index]}`;

// -------------------------------------------------------
//      READING INPUT FILE AND CREATING OUTPUT FILE
// -------------------------------------------------------

const csvWriter = createObjectCsvWriter({
  path: csv_output_file, // Output file name
  header: csvHeader,
});
const input = TxtTOArray(txt_file);

// ------------------------
//      SCRIPT CODE
// ------------------------
//const input_uniq = [...new Set(input)];
input.forEach((domain) => {
  whois.lookup(domain, { server: SERVER }, (err, data) => {
    if (err) {
      console.error(err.message);
      return;
    } else {
      const obj = createObjectFromDomainInfo(data);
      if (obj.admin_name === 'REDACTED FOR PRIVACY' || obj.admin_name === '')
        return;
      else {
        const csvFile = [];

        csvFile.push(obj);
        // Write the data to the CSV file.
        csvWriter
          .writeRecords(csvFile)
          .then(() => console.log('CSV file written successfully'))
          .catch((error) => console.error('Error writing CSV file:', error));
      }
    }
  });
});

// ------------------------
//      FUNCTIONS
// ------------------------

console.log('-----------------------------');
console.log('       start of script');
console.log('-----------------------------');
