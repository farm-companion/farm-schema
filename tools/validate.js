const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const root = path.join(__dirname, '..');
const schemaFarmPath = path.join(root, 'schemas', 'farm_schema.v1.json');
const schemaSeasonPath = path.join(root, 'schemas', 'season_schema.v1.json');
const farmsSamplePath = path.join(root, 'sample', 'farms.uk.json');
const seasonsSamplePath = path.join(root, 'sample', 'seasons.uk.json');

const farmSchema = loadJSON(schemaFarmPath);
const seasonItemSchema = loadJSON(schemaSeasonPath);

// Wrap as arrays because our samples are arrays
const farmArraySchema = { type: 'array', items: farmSchema };
const seasonArraySchema = { type: 'array', items: seasonItemSchema };

const validateFarms = ajv.compile(farmArraySchema);
const validateSeasons = ajv.compile(seasonArraySchema);

function report(ok, name, dataLen, errors) {
  if (ok) {
    console.log(`✅ ${name}: ${dataLen} items valid`);
  } else {
    console.error(`❌ ${name}: validation failed with ${errors.length} error(s)`);
    for (const err of errors) {
      console.error('-', err.instancePath || '(root)', err.message, JSON.stringify(err.params));
    }
    process.exitCode = 1;
  }
}

const farms = loadJSON(farmsSamplePath);
const seasons = loadJSON(seasonsSamplePath);

report(validateFarms(farms), 'farms.uk.json', farms.length, validateFarms.errors || []);
report(validateSeasons(seasons), 'seasons.uk.json', seasons.length, validateSeasons.errors || []);

if (process.exitCode !== 1) {
  console.log('🎉 All schema validations passed');
}
