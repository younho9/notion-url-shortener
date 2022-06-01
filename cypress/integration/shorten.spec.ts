import url from '../fixtures/url.json';

import type {Shorten} from '@/schemas';

/* eslint-disable @typescript-eslint/naming-convention */
const NOTION_API_TOKEN = Cypress.env('NOTION_API_TOKEN') as string;
const NOTION_API_TOKEN_STORAGE_KEY = 'NOTION_API_KEY';
/* eslint-enable @typescript-eslint/naming-convention */

beforeEach(() => {
	cy.visit('http://localhost:3000', {
		onBeforeLoad(window: Window): void {
			cy.spy(window.navigator.clipboard, 'writeText').as('copy');
		},
	});
	cy.intercept('POST', '/api/shortens').as('shorten');
	localStorage.clear();
});

describe('인증되지 않은 경우', () => {
	it('강제로 URL을 입력하고 제출한 경우, 에러 얼럿 메시지를 표시한다', () => {
		cy.get('.chakra-portal')
			.then(($portal) => {
				$portal.remove();
			})
			.should('not.exist');

		cy.get('[name="originalUrl"]')
			.type(url.repository, {force: true})
			.should('have.value', url.repository)
			.get('[type="submit"]')
			.contains('Shorten')
			.click();

		cy.wait('@shorten')
			.get('[role="alert"]')
			.should('have.text', 'API token is invalid.');
	});
});

describe('인증된 경우', () => {
	let shorten: Shorten;

	beforeEach(() => {
		localStorage.setItem(NOTION_API_TOKEN_STORAGE_KEY, `"${NOTION_API_TOKEN}"`);

		cy.get('[name="originalUrl"]')
			.type(url.repository)
			.should('have.value', url.repository)
			.get('[type="submit"]')
			.contains('Shorten')
			.click();
	});

	it('유효한 URL을 입력하고 제출하면 성공 얼럿 메시지를 표시한다', () => {
		cy.wait('@shorten').get('[role="alert"]').should('have.text', 'Success!');
	});

	it('유효한 URL을 입력하고 제출하면 단축된 URL을 표시한다', () => {
		cy.wait('@shorten')
			.its('response.body')
			.then((interception: {shorten: Shorten}) => {
				shorten = interception.shorten;

				cy.get('[name="shortenUrl"]').should(
					'have.value',
					`${window.location.origin}/${shorten.shortenUrlPath}`,
				);
			});
	});

	it(
		'Copy 버튼을 클릭 시, 클립보드에 URL 주소가 복사된다.',
		{browser: 'chrome'},
		() => {
			cy.wait('@shorten')
				.its('response.body')
				.then(() => {
					cy.get('[name="shortenUrl"]', {timeout: 8000}).should('exist');
					cy.get('button').contains('Copy').click();
					cy.get('[name="shortenUrl"]').then(($input) => {
						const shortenUrl = $input.val();

						cy.get('@copy').should('be.calledWithExactly', shortenUrl);
					});
				});
		},
	);

	it('단축된 URL로 이동 시, 원본 URL로 리다이렉트된다', () => {
		cy.wait('@shorten')
			.its('response.body')
			.then(({shorten}: {shorten: Shorten}) => {
				cy.get('[name="shortenUrl"]').then(($input) => {
					const shortenUrl = $input.val() as string;

					cy.origin(
						new URL(url.repository).origin,
						{args: {shorten, shortenUrl}},
						// eslint-disable-next-line max-nested-callbacks
						({shorten, shortenUrl}) => {
							cy.visit(encodeURI(shortenUrl)).then(
								// eslint-disable-next-line max-nested-callbacks
								() => cy.url().should('eq', shorten.originalUrl),
							);
						},
					);
				});
			});
	});
});
