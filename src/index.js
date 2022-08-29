#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
import * as Docopt from 'docopt';
const { docopt } = Docopt;
import main, { doc } from './main.js';

main(docopt(doc, { version }));
