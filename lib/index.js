'use strict';

const postcss = require('postcss');
const Typography = require('typography');

const calculateAndReplaceRhythms = (value, rhythmFunction) => {
	const RHYTHM_REGEX = /rhythm\(([ +-/*\.\d]+)\)/g;
	return value.replace(RHYTHM_REGEX, (_, rawUnit) => {
		// "Oh no we're using eval, that's bad!"
		// The regex is fairly restrictive in which values we allow
		// Please make an issue if any malicious code can make it through or there is a safer alternative
		// eslint-disable-next-line no-eval
		const evaluatedUnit = eval(rawUnit);
		return rhythmFunction(evaluatedUnit);
	});
};

module.exports = postcss.plugin('typography', settings => {
	const typography = new Typography(settings);

	return function (root, result) {
		let foundTypographyRule = false;

		root.walkDecls(decl => {
			const newValue = calculateAndReplaceRhythms(decl.value, typography.rhythm);
			if (newValue !== decl.value) {
				decl.value = newValue;
			}
		});

		root.walkAtRules('typography', rule => {
			foundTypographyRule = true;
			const overrides = rule.nodes || [];

			const typographyRules = postcss.parse(typography.toString());

			typographyRules.append(overrides);
			rule.replaceWith(typographyRules);
		});

		if (!foundTypographyRule) {
			result.warn('no "@typography" rule was found in your css');
		}
	};
});
