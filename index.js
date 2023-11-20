import child_process , { spawn }  from 'child_process';
 import { getLastHandledDomain } from './utils.js';
 import { TxtTOArray } from './utils.js';
 import { createObjectCsvWriter } from 'csv-writer';
 
// ------- Global Variables :----------------- ###

const CONDITIONS = {
  ADMIN_EMAIL : 'Admin Email: ',
  ADMIN_NAME : 'Admin Name: ',
  ADMIN_PHONE : 'Admin Phone: '
}
let input_file = './data/input/ca.txt';
const csvHeader = [
  { id: 'domain', title: 'Domain' },
  { id: 'name', title: 'Email' },
  { id: 'email', title: 'Name' },
  { id: 'phone', title: 'Phone' },
];
const csvWriter = createObjectCsvWriter({
  path: 'data.csv', // Output file name
  header: csvHeader,
  append: true,
});

// ------------------------------------------- ###

const domains = TxtTOArray(input_file)
processDomains(domains)

// -------------- Functions :----------------- ###

// iterate over domains array
// status: #under_constructin
async function processDomains(domains) {
  const lastHandledDomain = getLastHandledDomain('data.csv');
  const temp = domains;
  if (lastHandledDomain !== 0) {
    const index = temp.indexOf(lastHandledDomain);
    console.log(
      'continuing from index :  ' + index + ' of domain : ' + lastHandledDomain
    );
    domains.splice(0, index);
  }

  for (const domain of temp) {
    await executeChildProcess(domain);
  }
}

// scrape domain info and write to csv (main logic of this repo)
// status: #completed
function executeChildProcess(domain) {
    return new Promise((resolve, reject) => {
      const child = spawn('whois', [domain]);
      console.log('\n-----------------------------------------\n');
  
      child.stdout.on('data', (stdout) => {
        const data = stdout.toString().split('\n')
        const info ={
          domain : domain,
          name : '',
          email : '',
          phone : '',
        }
        if (data.length> 0) {
          data.map((line)=>{
            if(line.startsWith(CONDITIONS.ADMIN_EMAIL)) info.email = line.split(': ').pop()
            if(line.startsWith(CONDITIONS.ADMIN_NAME)) info.name = line.split(': ').pop()
            if(line.startsWith(CONDITIONS.ADMIN_PHONE)) info.phone = line.split(': ').pop()
          })
        }
        if (info.name === "REDACTED FOR PRIVACY" || info.name === '' || info.email.length>100 || info.name ===  'REDACTED FOR PRIVACY' ) {
          console.log('REDACTED FOR PRIVACY\n')
        }else{
          const csvFile = [];

          csvFile.push(info);
          // Write the data to the CSV file.
          csvWriter
            .writeRecords(csvFile)
            .then(() => console.log('CSV file written successfully\n'))
            .catch((error) => console.error('Error writing CSV file:', error));
        }
        
    });
    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`------------ ${domain} completed successfully\n\n`);
        resolve();
      } else {
        console.error(`##Child process for ${domain} exited with code ${code}`);
        reject(new Error(`###Child process for ${domain} failed`));
      }
    });
  
      child.on('error', (err) => {
        console.error(
          `Error executing child process for ${domain}: ${err.message}`
        );
        reject(err);
      });
    });
  }
 
// ------------------------------------------- ###

