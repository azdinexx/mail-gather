 import fs from 'fs';
 // -------------------------------- 
// # get last proccessed domain

export function getLastHandledDomain(input_file) {
    const exists = fs.existsSync(input_file);
    if (exists) {
      const csvFile = fs.readFileSync(input_file , 'utf-8');
      if(csvFile.length === 0 ) return 0
      const arr = csvFile.split('\n');
      const lastLine = arr[arr.length - 2];
      const lastDomain = lastLine.split(',')[0];
      return lastDomain;
    } else {
      return 0;
    }
  }
  
// -------------------------------- 
// # txt file to array of string
export function TxtTOArray(filename) {
    const thefileToCovert = fs.readFileSync(filename, 'utf-8');
    const arr = thefileToCovert.split('\n');
    console.log('done converting the txt file');
    return arr;
  }
// -------------------------------- 
// -------------------------------- 