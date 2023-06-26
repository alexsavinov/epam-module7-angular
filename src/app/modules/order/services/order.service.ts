import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {urls} from "../../../../constants";
import {ICreateOrderRequest, IHighestCost, IOrder} from "../interfaces";
import {IPageable} from "../../../shared/interfaces";
import {SearchStringHelper} from "../../../shared";


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  stringHelper = new SearchStringHelper();

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable: IPageable): Observable<any> {
    const pageableString = this.stringHelper.pageableToString(pageable);
    const searchString = this.stringHelper.suffix('?', pageableString) + pageableString;
    return this.httpClient.get<any>(`${urls.orders}${searchString}`);
  }

  getById(id: string): Observable<IOrder> {
    return this.httpClient.get<IOrder>(`${urls.orders}/${id}`);
  }

  getByIdByUserId(id: string, userId: string): Observable<IOrder> {
    return this.httpClient.get<IOrder>(`${urls.orders}/${id}/user?userId=${userId}`);
  }

  getHighestCostByUserId(userId: string): Observable<IHighestCost> {
    return this.httpClient.get<IHighestCost>(`${urls.orders}/cost?userId=${userId}`);
  }

  getAllByUserId(userId: string, pageable: IPageable): Observable<any> {
      // getAll(pageable: IPageable): Observable<any> {
    const pageableString = this.stringHelper.pageableToString(pageable);
    const searchString = this.stringHelper.suffix('?', pageableString) + pageableString;
    // return this.httpClient.get<any>(`${urls.orders}${searchString}`);
    return this.httpClient.get<any>(`${urls.orders}/user${searchString}&userId=${userId}`);
  }

  create(orderRequest: ICreateOrderRequest): Observable<IOrder> {
    return this.httpClient.post<IOrder>(`${urls.orders}`, orderRequest);
  }

  update(order: IOrder): Observable<IOrder> {
    return this.httpClient.patch<IOrder>(`${urls.orders}`, order);
  }

  deleteById(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${urls.orders}/${id}`);
  }
}
