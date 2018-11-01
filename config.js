/*
 *
 * Config File
 *
 */

 const environments = {};

 environments.default = {
 	'port': 4444,
 	'envName': 'default'
 }

 environments.production = {
 	'port': 5555,
 	'envName': 'production'
 }

 const chosenEnv = process.env.NODE_ENV !== 'production' ? environments.default : environments.production;

 module.exports = chosenEnv;

