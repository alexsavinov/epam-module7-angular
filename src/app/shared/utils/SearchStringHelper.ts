import {IPageable} from "../interfaces";
import {ISearchRequest} from "../../modules/certificate/interfaces";


export class SearchStringHelper {

  public searchString(pageable: IPageable, searchRequest: ISearchRequest): string {
    const pageableString = this.pageableToString(pageable);
    const searchRequestString = this.searchRequestToString(searchRequest);
    const params = pageableString + searchRequestString;
    return this.suffix('?', params) + pageableString + this.suffix('&', searchRequestString) + searchRequestString;
  }

  public pageableToString(pageable?: IPageable): string {
    if (!pageable) {
      return '';
    }

    let result: string = '';
    if (pageable.page === 0 || pageable.page) {
      result += this.suffix('&', result) + `page=${pageable.page}`;
    }
    if (pageable.size) {
      result += this.suffix('&', result) + `size=${pageable.size}`;
    }
    if (pageable.sort) {
      result += this.suffix('&', result) + `sort=${pageable.sort}`;
      if (pageable.direction) {
        result += `,${pageable.direction}`;
      }
    }

    return result;
  }

  public searchRequestToString(searchRequest: ISearchRequest) {
    if (!searchRequest) {
      return '';
    }

    let result: string = '';
    if (searchRequest.name) {
      result += this.suffix('&', result) + `name=${searchRequest.name}`;
    }
    if (searchRequest.tags) {
      result += this.suffix('&', result) + `tags=${searchRequest.tags}`;
    }

    return result;
  }

  public suffix(suffix: string, input: string): string {
    return (input) ? suffix : '';
  }
}
