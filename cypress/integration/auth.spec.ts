/* eslint-disable @typescript-eslint/naming-convention */
const NOTION_API_TOKEN = Cypress.env('NOTION_API_TOKEN') as string;
const NOTION_API_TOKEN_STORAGE_KEY = 'NOTION_API_KEY';
const INVALID_NOTION_API_TOKEN = 'INVALID_TOKEN';
/* eslint-enable @typescript-eslint/naming-convention */

beforeEach(() => {
	cy.visit('http://localhost:3000');
	cy.intercept('GET', '/api/auth').as('auth');
	localStorage.clear();
});

describe('무효한 토큰이 저장되어 있는 경우', () => {
	beforeEach(() => {
		localStorage.setItem(
			NOTION_API_TOKEN_STORAGE_KEY,
			`"${INVALID_NOTION_API_TOKEN}"`,
		);
	});

	it('모달을 연다', () => {
		cy.get('[name="token"]').should('not.exist');

		cy.wait('@auth').get('[name="token"]').should('exist');
	});
});

describe('유효한 토큰이 저장되어 있는 경우', () => {
	beforeEach(() => {
		localStorage.setItem(NOTION_API_TOKEN_STORAGE_KEY, `"${NOTION_API_TOKEN}"`);
	});

	it('모달을 열지 않는다', () => {
		cy.get('[name="token"]').should('not.exist');

		cy.wait('@auth').get('[name="token"]').should('not.exist');
	});
});

describe('토큰이 저장되어 있지 않은 경우', () => {
	/** @see https://docs.cypress.io/faq/questions/using-cypress-faq#Can-I-check-that-a-form-s-HTML-form-validation-is-shown-when-an-input-is-invalid */
	it('토큰을 입력하지 않고 제출한 경우, HTML 폼 유효성 에러 메시지를 표시한다', () => {
		cy.get('.chakra-portal', {timeout: 8000}).should('exist');

		cy.get('[type="submit"]').contains('Verify').click();

		cy.get('[name="token"]').then(($input) => {
			expect(($input[0] as HTMLInputElement).validationMessage).to.eq(
				'Please fill out this field.',
			);
		});
	});

	it('토큰을 입력하고 제출한 경우, 응답을 기다리는 동안 로딩 스피너를 표시한다', () => {
		cy.get('.chakra-portal', {timeout: 8000}).should('exist');

		cy.get('[name="token"]')
			.type(INVALID_NOTION_API_TOKEN)
			.should('have.value', INVALID_NOTION_API_TOKEN);

		cy.get('[type="submit"]')
			.contains('Verify')
			.click()
			.should('have.attr', 'data-loading');
	});

	it('무효한 토큰을 입력할 경우, 에러 메시지를 표시한다', () => {
		cy.get('.chakra-portal', {timeout: 8000}).should('exist');

		cy.get('[name="token"]')
			.type(INVALID_NOTION_API_TOKEN)
			.should('have.value', INVALID_NOTION_API_TOKEN);

		cy.get('[type="submit"]').contains('Verify').click();

		cy.get('[name="token"]')
			.should('have.attr', 'aria-invalid', 'true')
			.next()
			.should('have.text', 'API token is invalid.');
	});

	it('유효한 토큰을 입력한 경우, 로컬스토리지에 토큰을 저장하고, 모달을 닫는다', () => {
		cy.get('.chakra-portal', {timeout: 8000}).should('exist');

		cy.get('[name="token"]')
			.type(NOTION_API_TOKEN)
			.should('have.value', NOTION_API_TOKEN);

		cy.get('[type="submit"]')
			.contains('Verify')
			.click()
			.should(() => {
				expect(localStorage.getItem(NOTION_API_TOKEN_STORAGE_KEY)).to.equal(
					`"${NOTION_API_TOKEN}"`,
				);
			});

		cy.get('[name="token"]').should('not.exist');
	});
});
