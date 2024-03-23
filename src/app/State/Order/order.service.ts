import {BASE_API_URL} from "../../Config/api";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {catchError, map, of} from "rxjs";
import {
  createOrderFailure,
  createOrderSuccess,
  getOrderByIdFailure,
  getOrderByIdSuccess, getOrderHistoryFailure, getOrderHistoryRequest,
  getOrderHistorySuccess
} from "./order.action";

export class OrderService{
  API_BASE_URL = BASE_API_URL + '/api/order';
  constructor(private httpClient: HttpClient, private router: Router,
              private activeRoure: ActivatedRoute, private store: Store) {

  }
  private getHttpHeadersWithJWT() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
    });
  }
  createOrder (reqData: any) {
    console. log('create order', reqData);
    const url = this.API_BASE_URL  ;
    return this.httpClient.post(url, reqData, { headers:this.getHttpHeadersWithJWT()})
    .pipe(
      map ((data: any) => {
      console. log('created order- ', data);
      if (data.id) {
        this.router.navigate([`/checkout/payment/${data.id}`], {
          queryParams: {step: '3', order_id: data.id},
        });
      }
      console. log('created order -', data); return createOrderSuccess({order: data});
    }) ,
    catchError((error: any) => {
      console.log('catch error:', error);
      return of(createOrderFailure(error.response && error.response.data.message
        ? error.response.data.message : error.message))
    })
    ).subscribe((action)=>this.store.dispatch(action));
  }
  getOrderByIdService(orderId: any){
    const headers = this.getHttpHeadersWithJWT(); //if this name is change it won't work
    return this.httpClient.get(`${this.API_BASE_URL}/${orderId}`,{headers})
      .pipe(
        map((data: any)=>{
          return getOrderByIdSuccess({order: data})
        }),
        catchError((error: any)=>{
          return of(getOrderByIdFailure(
            error.response && error.response.data.message ? error.response.data.message : error.message
          ));
        })
      ).subscribe((action)=>this.store.dispatch(action))
  }
  getOrderHistoryService(orderId: any){
    const headers = this.getHttpHeadersWithJWT(); //if this name is change it won't work

    this.store.dispatch(getOrderHistoryRequest());

    return this.httpClient.get(`${this.API_BASE_URL}/user`,{headers})
      .pipe(
        map((data: any)=>{
          return getOrderHistorySuccess({order: data})
        }),
        catchError((error: any)=>{
          return of(getOrderHistoryFailure(
            error.response && error.response.data.message ? error.response.data.message : error.message
          ));
        })
      ).subscribe((action)=>this.store.dispatch(action))

  }
getAllOrder(){

}
confirmOrder(orderId: number){

}
shipOrder(orderId: number){

}
deliveryOrder(orderId: number){

}
deleteOrder(orderId: string){

}
}
