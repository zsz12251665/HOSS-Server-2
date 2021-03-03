module.exports = {
	'env': {
		'node': true,
		'commonjs': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 6
	},
	'rules': {
		'quotes': ['warn', 'single'],
		'indent': ['warn', 'tab'],
		'brace-style': ['warn', '1tbs'],
		'semi': ['warn', 'always'],
		'semi-style': ['warn', 'last']
	}
};
