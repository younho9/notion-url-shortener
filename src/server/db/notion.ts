/* eslint-disable @typescript-eslint/naming-convention */
import {Client} from '@notionhq/client';
import type {Except, IterableElement, ValueOf} from 'type-fest';
import type {
  CreatePageParameters,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type {ClientOptions} from '@notionhq/client/build/src/Client';

export type NotionRow = IterableElement<
  QueryDatabaseResponse['results']
>['properties'];

export default class NotionDBClient extends Client {
  private readonly databaseId: string;

  public constructor(
    options: Partial<ClientOptions> & {auth: string; databaseId: string},
  ) {
    super(options);

    this.databaseId = options.databaseId;
  }

  public async query<Type extends object>( // eslint-disable-line @typescript-eslint/ban-types
    parameters?: Except<QueryDatabaseParameters, 'database_id'>,
  ) {
    const {results} = await this.databases.query({
      ...parameters,
      database_id: this.databaseId,
    });

    return results
      .map(({properties}) => properties)
      .map((row) => this.parseRow<Type>(row));
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async create<Type extends object>(
    properties: Extract<
      CreatePageParameters,
      Record<'parent', Record<'database_id', unknown>>
    >['properties'],
  ) {
    const response = await this.pages.create({
      parent: {
        database_id: this.databaseId,
      },
      properties,
    });

    return this.parseRow<Type>(response.properties);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private parseRow<Type extends object>(row: NotionRow) {
    return Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        this.parseNotionPropertyValue(value),
      ]),
    ) as Type;
  }

  private parseNotionPropertyValue(value: ValueOf<NotionRow>) {
    const title = (value: Extract<ValueOf<NotionRow>, {type: 'title'}>) =>
      value.title.map(({plain_text}) => plain_text).join('');

    const number = ({number}: Extract<ValueOf<NotionRow>, {type: 'number'}>) =>
      number;

    const url = ({url}: Extract<ValueOf<NotionRow>, {type: 'url'}>) => url;

    const select = ({select}: Extract<ValueOf<NotionRow>, {type: 'select'}>) =>
      select?.name ?? '';

    const createdTime = ({
      created_time,
    }: Extract<ValueOf<NotionRow>, {type: 'created_time'}>) => created_time;

    const lastEditedTime = ({
      last_edited_time,
    }: Extract<ValueOf<NotionRow>, {type: 'last_edited_time'}>) =>
      last_edited_time;

    switch (value.type) {
      case 'title':
        return title(value);
      case 'number':
        return number(value);
      case 'url':
        return url(value);
      case 'select':
        return select(value);
      case 'created_time':
        return createdTime(value);
      case 'last_edited_time':
        return lastEditedTime(value);
      default:
        return null;
    }
  }
}
