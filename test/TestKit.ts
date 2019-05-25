import { TestKit } from '@/typings/TestKit';
const $: TestKit = require('../index');

export default () => {
	it('$(selector)', async () => {
		const el = $('body');
		if (!el.waitFor) {
			throw 'err';
		}
	});
	it(`$('') error`, async () => {
		return new Promise((r, rj) => {
			try {
				$('');
				rj('error');
			} catch (e) {
				r(e.toString());
			}
		});
	});

	it(`$.waitFor.delay`, async () => {
		const t1 = Date.now();
		await $.delay();
		if (Date.now() - t1 < 1000) {
			throw `${Date.now() - t1}`;
		}
	});
};
