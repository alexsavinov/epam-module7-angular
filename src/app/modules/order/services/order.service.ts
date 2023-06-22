import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {urls} from "../../../../constants";
import {IPageable} from "../../../shared/interfaces";
import {ICreateOrderRequest, IOrder} from "../interfaces";


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(pageable: IPageable): Observable<any> {
    return this.httpClient.get<any>(`${urls.orders}?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort},${pageable.direction}`);
  }

  getById(id: string): Observable<IOrder> {
    return this.httpClient.get<IOrder>(`${urls.orders}/${id}`);
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
