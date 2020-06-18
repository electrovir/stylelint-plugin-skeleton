import {visibilityRule} from './rules/visibility/visibility.rule';

export const pluginPrefix = 'skeleton';

console.log('HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
console.log('HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
console.log(visibilityRule);
console.log('HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');

// the main plugin export is just an array of rules
const rules = [visibilityRule];
export default rules;
console.log('rules!');
console.log(rules);
