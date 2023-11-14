import child_process from 'child_process';
import fs from 'fs';
import { spawn } from 'child_process';
import { createObjectCsvWriter } from 'csv-writer';

let input_file = './data/input/ca.txt';
const csvHeader = [
  { id: 'domain', title: 'Domain' },
  { id: 'admin_name', title: 'Admin_Name' },
  { id: 'admin_mail', title: 'Admin_Email' },
  { id: 'admin_phone', title: 'Admin_Phone' },
  { id: 'tech_name', title: 'Tech_Name' },
  { id: 'tech_mail', title: 'Tech_Email' },
  { id: 'tech_phone', title: 'Tech_Phone' },
];

const csvWriter = createObjectCsvWriter({
  path: 'data.csv', // Output file name
  header: csvHeader,
});

async function processDomains(domains) {
  for (const domain of domains) {
    await executeChildProcess(domain);
  }
}

function executeChildProcess(domain) {
  return new Promise((resolve, reject) => {
    const child = spawn('whois', [domain]);

    child.stdout.on('data', (stdout) => {
      const obj = createObjectFromDomainInfo(domain, stdout);
      if (obj.admin_name === 'REDACTED FOR PRIVACY' || obj.admin_name === '')
        console.log('data is not valid');
      else {
        // writing to a csv file
        const csvFile = [];

        csvFile.push(obj);
        // Write the data to the CSV file.
        csvWriter
          .writeRecords(csvFile)
          .then(() => console.log('CSV file written successfully'))
          .catch((error) => console.error('Error writing CSV file:', error));
      }
    });
    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`------------ ${domain} completed successfully`);
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

const domains = TxtTOArray(input_file);
processDomains(domains)
  .then(() => {
    console.log('All processes completed successfully');
  })
  .catch((err) => {
    console.error('#############################################');
    console.error(`Error processing domains: ${err.message}`);
    console.error('#############################################');
  });

//______________________________________________________________________
// FUNCTIONS
//______________________________________________________________________

export function createObjectFromDomainInfo(domain, domainInfo) {
  const initial_obj = {
    domain: domain,
    admin: {
      name: '',
      email: '',
      phone: '',
    },
    tech: {
      name: '',
      email: '',
      phone: '',
    },
  };

  domainInfo
    .toString()
    .split('\r')
    .forEach((info) => {
      if (info.includes('Admin Name')) {
        initial_obj.admin.name = info.split(': ')[1];
      }
      if (info.includes('Admin Phone:')) {
        initial_obj.admin.phone = info.split(': ')[1];
      }
      if (info.includes('Admin Email')) {
        initial_obj.admin.email = info.split(': ')[1];
      }
      if (info.includes('Tech Name')) {
        initial_obj.tech.name = info.split(': ')[1];
      }
      if (info.includes('Tech Phone')) {
        initial_obj.tech.phone = info.split(': ')[1];
      }
      if (info.includes('Tech Email')) {
        initial_obj.tech.email = info.split(': ')[1];
      }
    });
  console.log('done creating obj for ' + domain);

  return {
    domain: initial_obj.domain,
    admin_name: initial_obj.admin.name,
    admin_mail: initial_obj.admin.email,
    admin_phone: initial_obj.admin.phone,
    tech_name: initial_obj.tech.name,
    tech_mail: initial_obj.tech.email,
    tech_phone: initial_obj.tech.phone,
  };
}

export function TxtTOArray(filename) {
  const thefileToCovert = fs.readFileSync(filename, 'utf-8');
  const arr = thefileToCovert.split('\n');
  console.log('done converting the txt file');
  return arr;
}
