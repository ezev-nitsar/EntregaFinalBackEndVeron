import { Command } from 'commander';
const program = new Command();
program
    .option('-m, --mode <mode>', 'Modo de trabajo: dev o prod', 'dev')
program.parse();
export default program;