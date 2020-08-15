'use strict';

const postcss = require('postcss');
const Typography = require('typography');

module.exports = postcss.plugin('typography', settings => {
	const typography = new Typography(settings);

	return function (root, result) {
		let foundTypographyRule = false;

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
