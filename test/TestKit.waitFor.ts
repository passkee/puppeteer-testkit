import { TestKit } from '@/typings/TestKit';
const $: TestKit = require('../index');
declare var $Z;
export default () => {
	it(`$.waitFor.target`, async () => {
		await $.waitFor.target('registry.npm.taobao.org');
	});
	it(`$.waitFor.response`, async () => {
		$.page.evaluate(() => {
			$Z('body').append(
				'<img src="https://img.to8to.com/to8to_pc/xiaoguotu/tumax/banner3.png?v=20181120" alt="">'
			);
		});
		await $.waitFor.response('/to8to_pc/xiaoguotu/tumax/banner3.png?v=20181120');
	});

	it(`$.waitFor.request`, async () => {
		$.page.evaluate(() => {
			$Z.ajax({
				url: '/aaa?v=2',
				data: {
					a: 1,
					bbb: 1,
					rrr: 3
				},
				type: 'post'
			});
		});
		await $.waitFor.request('/aaa?v=2', 'a=1&rrr=3');
	});

	it(`$.waitFor.fn`, async () => {
		await $.waitFor.fn(async () => {
			return true;
		});
	});

	// https://registry.npm.taobao.org/passkee?param=1#/hash?hashparam=3
	it(`$.waitFor.location`, async () => {
		await $.waitFor.location('/passkee?param=1');
	});
};
