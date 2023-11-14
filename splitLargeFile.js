import fs from 'fs';
import readline from 'readline';

const inputFile = './data/input/ca.txt';
const linesPerFile = 100000;

// Create a readable stream for the input file
const input = fs.createReadStream(inputFile);

// Create an interface to read lines from the input stream
const rl = readline.createInterface({
  input: input,
  crlfDelay: Infinity,
});

let lineNumber = 1;
let fileCount = 0;
let output = fs.createWriteStream(`output_prefix${fileCount}_numbered.txt`);

// Read lines from the input file
rl.on('line', (line) => {
  // Write the line number and content to the output file
  output.write(`${line}\n`);

  // Increment line number
  lineNumber++;

  // Check if it's time to start a new output file
  if (lineNumber > linesPerFile) {
    // Close the current output file
    output.end();

    // Increment file count and open a new output file
    fileCount++;
    output = fs.createWriteStream(`./data/input/ca/${fileCount}.txt`);

    // Reset line number
    lineNumber = 1;
  }
});

// Close the last output file when all lines have been processed
rl.on('close', () => {
  output.end();
  console.log('Splitting and numbering complete.');
});
