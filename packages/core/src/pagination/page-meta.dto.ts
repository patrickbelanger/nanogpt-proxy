export class PageMetaDto {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;

  constructor({ page, limit, totalItems }: { page: number; limit: number; totalItems: number }) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;

    const safeLimit = limit && limit > 0 ? limit : totalItems || 1;
    this.totalPages = Math.ceil(totalItems / safeLimit);
  }
}
