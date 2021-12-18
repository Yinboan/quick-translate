#!/usr/bin/env node
import * as commander from "commander";
import {translate} from "./main";

const program = new commander.Command()
const pkg = require('../package.json')

program.version(pkg.version)

program.name('fy')
       .usage('<English>')
       .arguments('<English>')
       .action((word)=>{
            translate(word)
       })

program.parse(process.argv)