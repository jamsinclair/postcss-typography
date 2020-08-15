const fs = require('fs');
const path = require('path');

const test = require('tape');
const postcss = require('postcss');
const typography = require('..');

const read = fs.readFileSync;
const {join} = path;

const ROOT = join(__dirname, 'fixtures');

const fixtures = fs.readdirSync(ROOT);

function prettify() {
	return function (css) {
		css.walkRules((rule, index) => {
			if (index !== 0) {
				rule.raws.before = '\n';
			}

			rule.raws.between = ' ';
			rule.raws.after = '\n';
		});

		css.walkDecls((decl, index) => {
			if (index !== 0) {
				decl.raws.before = '\n';
			}

			decl.raws.before = '\n    ';
			decl.raws.between = ': ';
		});
	};
}

test('typography()', t => {
	t.is(typeof typography, 'function', 'should be a function');

	t.doesNotThrow(() => {
		typography();
	}, '');

	t.end();
});

test('shows warning if @typography rule not in css', async t => {
	const result = await postcss([typography()]).process('a { color: blue; }');
	t.equals(result.css, 'a { color: blue; }', 'should not include typography css');
	t.equals(result.warnings().length, 1, 'should be one warning');
	const warningRegex = /no "@typography" rule was found/i;
	t.assert(warningRegex.test(result.warnings()[0].text), 'should contain warning text');
});

test('fixtures', async t => {
	const tests = fixtures.filter(filepath => {
		return filepath.indexOf('.') !== 0;
	}).map(async fixture => {
		const filepath = join(ROOT, fixture);
		const output = read(join(filepath, 'output.css'), 'utf-8');
		const input = read(join(filepath, 'input.css'), 'utf-8');
		const config = require(join(filepath, 'config.js'));
		const processor = postcss([typography(config), prettify()]);
		const result = await processor.process(input);

		t.deepEqual(result.css, output, `should work on \`${fixture}\``);
		t.equals(result.warnings().length, 0, `should be no warnings for \`${fixture}\``);
	});

	await Promise.all(tests);
});
